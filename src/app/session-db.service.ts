import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class SessionDBService {
  // reference to database
  private database: PouchDB.Database;
  private isInstansiated: boolean;

  // session variables
  totalSession: number = 0;
  correctSession: number = 0;
  docuemntID: string = "";
  documentRev: string = "";

  constructor() {
    if (!this.isInstansiated) {
      // instantiate
      this.database = new PouchDB('sessions');
      this.isInstansiated = true;
      // put new session document
      this.putNewSessionDocument();
    }
  }

  private async putNewSessionDocument() {
    // create new session document
    var dateTime = new Date();
    var month = dateTime.getMonth() < 10 ? "0" + dateTime.getMonth() : dateTime.getMonth();
    var date = dateTime.getDate() < 10 ? "0" + dateTime.getDate() : dateTime.getDate();
    var hours = dateTime.getHours() < 10 ? "0" + dateTime.getHours() : dateTime.getHours();
    var minutes = dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes();
    var seconds = dateTime.getSeconds() < 10 ? "0" + dateTime.getSeconds() : dateTime.getSeconds();
    var timeString = dateTime.getFullYear() + "-" + month + "-" + date + " " + hours + ":" + minutes + "." + seconds;

    // put document to database
    try {
      var response = await this.database.put({
        _id: timeString,
        totalSession: 0,
        correctSession: 0,
      });

      // set session ID and Rev
      this.docuemntID = response["id"];
      this.documentRev = response["rev"];

    } catch (err) {
      console.log(err);
    }
  }

  public getTotalSession() {
    return this.totalSession;
  }

  public getCorrectSession() {
    return this.correctSession;
  }

  public getID() {
    return this.docuemntID;
  }

  public async getAllDocuments() {
    try {
      // get all items
      var result = await this.database.allDocs({include_docs: true, descending: true})

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

  public async incrementTotalSession() {
    this.totalSession++;

    // update database
    try {
      var response = await this.database.put({
        _id: this.docuemntID,
        _rev: this.documentRev,
        totalSession: this.totalSession,
        correctSession: this.correctSession,
      });

      this.documentRev = response["rev"];
    } catch (err) {
      console.log(err);
    }
  }

  public async incrementCorrectSession() {
    this.correctSession++;

    // update database
    try {
      var response = await this.database.put({
        _id: this.docuemntID,
        _rev: this.documentRev,
        totalSession: this.totalSession,
        correctSession: this.correctSession,
      });

      this.documentRev = response["rev"];
    } catch (err) {
      console.log(err);
    }
  }

  public async incrementCorrectAndTotalSession() {
    this.correctSession++;
    this.totalSession++;

    // update database
    try {
      var response = await this.database.put({
        _id: this.docuemntID,
        _rev: this.documentRev,
        totalSession: this.totalSession,
        correctSession: this.correctSession,
      });

      this.documentRev = response["rev"];
    } catch (err) {
      console.log(err);
    }
  }

  public async deleteItem(id: string, rev: string) {
    try {
      await this.database.remove(id, rev);
    } catch (err) {
      console.log(err);
    }
  }

  public async deleteAllDocuments() {
    // destroy old db
    await this.database.destroy()

    // create new db
    this.database = new PouchDB('sessions');
  }
}
