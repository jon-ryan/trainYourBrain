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

  // local array to store the content of the db in memory
  //private dbArray: Array<Map<String, any>>;
  // itemCount counts the items in the database and the array
  // it is used to set the id of new items
  private itemCount: number = 0;


  constructor() {
    console.log("Constructor called 1");
    
    if (!this.isInstansiated) {
      // instantiate
      this.database = new PouchDB('questions');
      this.isInstansiated = true;
    }
    console.log("Constructor called 2");

    // get itemCount
    this.database.info().then(function (info) {
      this.itemCount = info["doc_count"];
      console.log("Item Count in DB: " + this.itemCount);
    })
    
  }

  // getRandom returns a random item from the database
  public async getRandom () {
    var randomNumber: number = Math.floor(Math.random() * this.itemCount) + 1;

    var doc: Map<String,any>;

    try {
      doc = await this.database.get(randomNumber.toString());
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
  public async putDocument (question: String, questionImage: any, answer: String, answerImage: any) {
    
  }

  // getItemCount returns how many items are in the database
  public getItemCount() {
    return this.itemCount;
  }
}
