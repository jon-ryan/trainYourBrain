import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  // class variables
  // reference to database
  private questionDatabase: PouchDB.Database;
  private categoryDatabase: PouchDB.Database;
  private isInstantiated: boolean;

  // local array to store the question's id
  private questionIDs: Array<string> = [];
  // selector to iterate the array of questions
  private questionSelector: number = 0;
  // questionCount counts the items in the database and the array
  private questionCount: number = 0;

  // modified flag
  private databaseModified: boolean = false;

  // temp variables for editing
  private editId: string;
  private pageToRouteBackTo: string;


  // category array to store the questions in a certian category
  private questionsByCategory: Array<any> = [];
  private questionsByCategorySelector: number = 0;
  private selectedCategory: string = "";

  private questionsWrongThisSession: Array<any> = [];


  constructor() {
    if (!this.isInstantiated) {
      // instantiate
      this.questionDatabase = new PouchDB('questions');
      this.categoryDatabase = new PouchDB('categories');
      this.isInstantiated = true;
    }

    this.questionCount = 0;

    // get doc count from database
    this.getQuestionCountFromDatabase();

    // get doc id's from database
    this.getQuestionIDs();

    // optimize databases on startup
    this.questionDatabase.viewCleanup();
    this.questionDatabase.compact();

    this.categoryDatabase.viewCleanup();
    this.categoryDatabase.compact();
  }

  // shuffle question list
  private shuffleArray(a: Array<string>) {
    var j: number, x: string, i: number;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }


  // getRandomQuestion returns a random item from the database
  public async getRandomQuestion() {
    // check if the questionlist was iterated once
    if (this.questionIDs.length == this.questionSelector) {
      // list has been iterated
      // shuffle list again
      this.questionIDs = this.shuffleArray(this.questionIDs);
      this.questionSelector = 0;
    }

    var doc: Map<String, any>;
    try {
      doc = await this.questionDatabase.get(this.questionIDs[this.questionSelector]);
    } catch (err) {
      console.log(err);
    }

    // increment selector
    this.questionSelector++;

    return doc;
  }

  // getRandomQuestionInCategory returns a random question within a specified category
  // it utilizes an additional array for the category selection
  public async getRandomQuestionInCategory(category: string) {
    // check if this category was already extracted
    if (this.selectedCategory == category) {
      // check if the list has been completely iterated
      if (this.questionsByCategory.length - 1 == this.questionsByCategorySelector) {
        // reset iterator
        this.questionsByCategorySelector = 0;
        // reshuffle the array
        this.questionsByCategory = this.shuffleArray(this.questionsByCategory);

        return this.questionsByCategory[this.questionsByCategorySelector];
      } else {
        // increment selector
        this.questionsByCategorySelector++;
        // return list of questions
        return this.questionsByCategory[this.questionsByCategorySelector];
      }
    }

    // this is a new category
    this.selectedCategory = category;

    // reset selector
    this.questionsByCategorySelector = 0;

    try {
      var result = await this.questionDatabase.allDocs({ include_docs: true })
    } catch (err) {
      console.log(err);
    }

    // add every document to an array
    this.questionsByCategory = [];
    var i: number = 0;
    for (i = 0; i < result.total_rows; i++) {
      if (result.rows[i].doc["category"] == category) {
        this.questionsByCategory.push(result.rows[i].doc);
      }
    }

    // shuffle list
    this.questionsByCategory = this.shuffleArray(this.questionsByCategory);

    return this.questionsByCategory[this.questionsByCategorySelector];
  }


  // getAllQuestionsWithSpecificCategory is utlizied by allItems when selecting a category
  public async getAllQuestionsWithSpecificCategory(category: string) {
    // check if this category was already extracted
    if (this.selectedCategory == category && !this.databaseModified) {
      return this.questionsByCategory;
    }

    // this is a new category
    this.selectedCategory = category;

    try {
      var result = await this.questionDatabase.allDocs({ include_docs: true })
    } catch (err) {
      console.log(err);
    }

    // add every document to an array
    this.questionsByCategory = [];
    var i: number = 0;
    for (i = 0; i < result.total_rows; i++) {
      if (result.rows[i].doc["category"] == category) {
        this.questionsByCategory.push(result.rows[i].doc);
      }
    }
    return this.questionsByCategory;
  }

  // getSpecific returns the item at the position id
  public async getSpecificQuestion(id: number) {
    var doc: Map<String, any>;

    try {
      doc = await this.questionDatabase.get(id.toString());
    } catch (err) {
      console.log(err);
    }
    return doc;
  }


  // putQuestion adds a new question to the database and the array in memory
  public async putQuestion(questionText: string, answerText: string, category: string, questionImagePath: string, answerImagePath: string) {
    // increment itemCount
    this.questionCount++;

    // id is the current date (year, month, day, hours, minutes, seconds, milliseconds)
    var dateTime = new Date();
    var timeString = dateTime.getFullYear() + "-" + dateTime.getMonth() + "-" + dateTime.getDate()
      + "-" + dateTime.getHours() + "-" + dateTime.getMinutes() + "-" + dateTime.getSeconds()
      + "-" + dateTime.getMilliseconds();

    // append new id to questionIDs
    this.questionIDs.push(timeString);


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
      await this.questionDatabase.put({
        _id: timeString,
        questionText: questionText,
        questionImagePath: questionImagePath,
        answerText: answerText,
        answerImagePath: answerImagePath,
        category: category,
        total: 0,
        correct: 0,
      });
    } catch (err) {
      console.log(err);
    }

  }

  public async updateQuestion(id: string, rev: string, questionText: string, questionImagePath: string, answerText: string, answerImagePath: string, total: number, correct: number, category: string) {
    // turn it into a document
    var doc = {
      _id: id,
      _rev: rev,
      questionText: questionText,
      questionImagePath: questionImagePath,
      answerText: answerText,
      answerImagePath: answerImagePath,
      total: total,
      correct: correct,
      category: category
    };

    // update database
    try {
      await this.questionDatabase.put(doc);
    } catch (err) {

    }
  }

  public setEditItem(id: string, pageToRouteBackTo: string) {
    this.editId = id;
    this.pageToRouteBackTo = pageToRouteBackTo;
  }

  public async getEditItem() {
    var doc: Map<String, any>;
    try {
      doc = await this.questionDatabase.get(this.editId);
    } catch (err) {
      console.log(err);
    }
    return doc;
  }

  public getPageToRouteBackTo() {
    return this.pageToRouteBackTo;
  }

  // getItemCount returns how many items are in the database
  public getQuestionCount() {
    return this.questionCount;
  }

  // getItemCountFromDatabase will retrieve the itemcount directly from the database
  public async getQuestionCountFromDatabase() {
    try {
      var info = await this.questionDatabase.info();
      this.questionCount = info.doc_count;
      return this.questionCount;
    } catch (err) {
      console.log(err);
    }
  }


  public async getQuestionIDs() {
    try {
      // get the data from the database
      var result = await this.questionDatabase.allDocs();

      // reset array
      this.questionIDs = [];

      // add every id per row
      var i: number = 0;
      for (i = 0; i < result.total_rows; i++) {
        this.questionIDs.push(result.rows[i].id);
      }

      // shuffle array
      this.questionIDs = this.shuffleArray(this.questionIDs);

      // update item count
      this.getQuestionCountFromDatabase();

    } catch (err) {
      console.log(err);
    }
  }

  public async getAllQuestions() {
    try {
      // get all items
      var result = await this.questionDatabase.allDocs({ include_docs: true })

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

  public async deleteQuestion(id: string, rev: string) {
    // get category of this document
    var doc = await this.questionDatabase.get(id);
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
      await this.questionDatabase.remove(id, rev);
      // update the document id array
      this.getQuestionIDs();
    } catch (err) {
      console.log(err);
    }

    // mark the database as modified
    this.databaseModified = true;
  }


  public async bulkDelete() {
    // destroy old database
    await this.questionDatabase.destroy();

    // create new database
    this.questionDatabase = new PouchDB('questions');

    // reset category db
    this.deleteCategoryDB();

    this.getQuestionCountFromDatabase();
    this.getQuestionIDs();
  }

  public async deleteCategoryDB() {
    await this.categoryDatabase.destroy();
    this.categoryDatabase = new PouchDB('categories');
  }

  public async deleteCertainCategory(category: string) {
    // load all
    try {
      var result = await this.questionDatabase.allDocs({ include_docs: true })
    } catch (err) {
      console.log(err);
    }

    // add every document in the specified category to an array
    var questionsToDelete = [];
    var i: number = 0;
    for (i = 0; i < result.total_rows; i++) {
      if (result.rows[i].doc["category"] == category) {
        questionsToDelete.push(result.rows[i].doc);
      }
    }

    // delete all of those categories
    for (var item of questionsToDelete) {
      try {
        // remove document
        await this.questionDatabase.remove(item["_id"], item["_rev"]);
        // update the document id array
        this.getQuestionIDs();
      } catch (err) {
        console.log(err);
      }
    }

    // delete category
    try {
      var cat = await this.categoryDatabase.get(category);
      await this.categoryDatabase.remove(cat["_id"], cat["_rev"])
    } catch(err) {
      console.log(err)
    }
  }

  // adds question which was answered incorrectly
  public addIncorrect(id: string) {
    this.questionsWrongThisSession.push(id);
  }

  // gets first question in the list of wrong questions this session
  public async getNextIncorrect() {
    if (this.questionsWrongThisSession.length == 0) {
      return 0;
    }
    
    var id = this.questionsWrongThisSession.shift();

    try {
      var doc = await this.questionDatabase.get(id);
    } catch (err) {
      console.log(err);
    }

    return doc;
  }
}
