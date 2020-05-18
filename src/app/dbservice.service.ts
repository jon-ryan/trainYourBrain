import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  // class variables
  // reference to database
  private database: PouchDB.Database;
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
      this.isInstansiated = true;
    }

    this.itemCount = 0;

    // get doc count from database
    this.getItemCountFromDatabase();

    // get doc id's from database
    this.getDocumentIDs();
  }

  // getRandom returns a random item from the database
  public async getRandom () {
    // generate a random number
    var randomNumber: number = Math.floor(Math.random() * this.itemCount - 1) + 1;

    var doc: Map<String,any>;
    try {
      doc = await this.database.get(this.documentIDs[randomNumber]);
    } catch (err) {
      console.log(err);
    }
    return doc;
  }

  // getSpecific returns the item at the position id
  public async getSpecific (id: number) {
    var doc: Map<String, any>;

    try {
      doc = await this.database.get(id.toString());
    } catch (err) {
      console.log(err);
    }
    return doc;
  }

  // putDocument adds a new item to the database and the array in memory
  public async putDocument (questionText: String, answerText: String, ) {
    // increment itemCount
    this.itemCount++;

    // id is the current date (year, month, day, hours, minutes, seconds, milliseconds)
    var dateTime = new Date();
    var timeString = dateTime.getFullYear() + "-" + dateTime.getMonth() + "-" + dateTime.getDate() + "-" + dateTime.getHours() + "-" + dateTime.getMinutes() + "-" + dateTime.getSeconds() + "-" + dateTime.getMilliseconds();

    // append new id to docuemntIDs
    this.documentIDs.push(timeString);

    // create a new document
    try {
      await this.database.put({
        _id: timeString,
        questionText: questionText,
        answerText: answerText,
        total: 0,
        correct: 0,
      });
    } catch (err) {
      console.log(err);
    }

  }

  public async updateDocument(id: string, rev: string, questionText: string, answerText: string, total: number, correct: number) {
    // turn it into a document
    var doc = {_id: id, _rev: rev, questionText: questionText, answerText: answerText, total: total, correct: correct};

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
      var result = await this.database.allDocs({include_docs: true})

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

  public async deleteItem(id: string, rev: string) {
    try {
      // remove document
      await this.database.remove(id, rev);
      // update the document id array
      this.getDocumentIDs();
    } catch (err) {
      console.log(err);
    }
  }
}
