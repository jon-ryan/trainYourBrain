import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  // class variables
  // reference to database
  private database: PouchDB.Database;
  private categoryDatabase: PouchDB.Database;
  private isInstansiated: boolean;

  // local array to store the document id's of the db in memory
  private documentIDs: Array<string> = [];
  // itemCount counts the items in the database and the array
  // it is used to set the id of new items
  private itemCount: number = 0;


  constructor() {
    if (!this.isInstansiated) {
      // instantiate
      this.database = new PouchDB('questions');
      this.categoryDatabase = new PouchDB('categories');
      this.isInstansiated = true;
    }

    this.itemCount = 0;

    // get doc count from database
    this.getItemCountFromDatabase();

    // get doc id's from database
    this.getDocumentIDs();

    // optimize database on startup
    this.database.viewCleanup();
    this.database.compact();

    this.categoryDatabase.viewCleanup();
    this.categoryDatabase.compact();
  }

  // getRandom returns a random item from the database
  public async getRandom() {
    // generate a random number
    var randomNumber: number = Math.floor(Math.random() * this.itemCount - 1) + 1;

    var doc: Map<String, any>;
    try {
      doc = await this.database.get(this.documentIDs[randomNumber]);
    } catch (err) {
      console.log(err);
    }
    return doc;
  }

  // getSpecific returns the item at the position id
  public async getSpecific(id: number) {
    var doc: Map<String, any>;

    try {
      doc = await this.database.get(id.toString());
    } catch (err) {
      console.log(err);
    }
    return doc;
  }


  // putDocument adds a new item to the database and the array in memory
  public async putDocument(questionText: string, answerText: string, category: string) {
    // increment itemCount
    this.itemCount++;

    // id is the current date (year, month, day, hours, minutes, seconds, milliseconds)
    var dateTime = new Date();
    var timeString = dateTime.getFullYear() + "-" + dateTime.getMonth() + "-" + dateTime.getDate()
      + "-" + dateTime.getHours() + "-" + dateTime.getMinutes() + "-" + dateTime.getSeconds()
      + "-" + dateTime.getMilliseconds();

    // append new id to docuemntIDs
    this.documentIDs.push(timeString);


    // update category count
    // see if the category already exists
    try {
      // try to get existing document
      var doc = await this.categoryDatabase.get(category);
      // update the reference count by one
      await this.categoryDatabase.put({
        _id: category,
        _rev: doc._rev,
        references: doc["references"] + 1,
      })

    } catch (err) {
      if (err["name"] == "not_found") {
        // document does not exist
        // create new one
        await this.categoryDatabase.put({
          _id: category,
          references: 1,
        })
      } else {
        console.log(err);
      }

    }

    // create a new document
    try {
      await this.database.put({
        _id: timeString,
        questionText: questionText,
        answerText: answerText,
        category: category,
        total: 0,
        correct: 0,
      });
    } catch (err) {
      console.log(err);
    }

  }

  public async updateDocument(id: string, rev: string, questionText: string, answerText: string, total: number, correct: number, category: string) {
    // turn it into a document
    var doc = { _id: id, _rev: rev, questionText: questionText, answerText: answerText, total: total, correct: correct, category: category };

    // update database
    try {
      await this.database.put(doc);
    } catch (err) {

    }
  }

  // getItemCount returns how many items are in the database
  public getItemCount() {
    return this.itemCount;
  }

  // getItemCountFromDatabase will retrieve the itemcount directly from the database
  public async getItemCountFromDatabase() {
    try {
      var info = await this.database.info();
      this.itemCount = info.doc_count;
      return this.itemCount;
    } catch (err) {
      console.log(err);
    }
  }


  public async getDocumentIDs() {
    try {
      // get the data from the database
      var result = await this.database.allDocs();

      // reset array
      this.documentIDs = [];

      // add every id per row
      var i: number = 0;
      for (i = 0; i < result.total_rows; i++) {
        this.documentIDs.push(result.rows[i].id);
      }

      // update item count
      this.getItemCountFromDatabase();

    } catch (err) {
      console.log(err);
    }
  }

  public async getAllDocuments() {
    try {
      // get all items
      var result = await this.database.allDocs({ include_docs: true })

      // add every document to an array
      var tmpArray: Array<any> = [];
      var i: number = 0;
      for (i = 0; i < result.total_rows; i++) {
        tmpArray.push(result.rows[i].doc);
      }

      return tmpArray;
    } catch (err) {
      console.log(err);
    }
  }

  public async getAllDocumentsWithSpecificCategory(category: string) {
    try {
      var result = await this.database.allDocs({ include_docs: true})

      // add every document to an array
      var tmpArray: Array<any> = [];
      var i: number = 0;
      for (i = 0; i < result.total_rows; i++) {
        if (result.rows[i].doc["category"] == category) {
          tmpArray.push(result.rows[i].doc);
        }
      }

      return tmpArray;
    } catch (err) {
      console.log(err);
    }
  }

  public async getAllCategories() {
    try {
      var result = await this.categoryDatabase.allDocs({ include_docs: true });

      var tmpArray: Array<any> = [""];
      var i: number = 0;
      for (i = 0; i < result.total_rows; i++) {
        tmpArray.push(result.rows[i].doc);
      }

      return tmpArray;
    } catch (err) {
      console.log(err);
    }
  }

  public async deleteDocument(id: string, rev: string) {
    // get category of this document
    var doc = await this.database.get(id);
    var category = doc["category"];

    // decrease reference count of category
    var catDocument = await this.categoryDatabase.get(category);
    // check if after decrement there is no more reference
    if (catDocument["references"] - 1 == 0) {
      try {
        // if so, delete this category
        await this.categoryDatabase.remove(category, catDocument._rev);
      } catch (err) {
        console.log(err);
      }

    } else {
      try {
        // decrease references by one
        await this.categoryDatabase.put({
          _id: category,
          _rev: catDocument._rev,
          references: catDocument["references"] - 1,
        });
      } catch (err) {
        console.log(err);
      }
    }


    try {
      // remove document
      await this.database.remove(id, rev);
      // update the document id array
      this.getDocumentIDs();
    } catch (err) {
      console.log(err);
    }
  }


  public async bulkDelete() {
    // destroy old database
    await this.database.destroy();

    // create new database
    this.database = new PouchDB('questions');

    // reset category db
    this.deleteCategoryDB();

    this.getItemCountFromDatabase();
    this.getDocumentIDs();
  }

  public async deleteCategoryDB() {
    await this.categoryDatabase.destroy();
    this.categoryDatabase = new PouchDB('categories');
  }
}
