import { Component, OnInit } from '@angular/core';
import { SessionDBService } from '../session-db.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {

  // array with all documents
  allSessions: Array<any> = [];
  toggleDeleteArray: Array<boolean> = [];

  // statistic vars
  totalAverage: number = 0;
  totalQuestions: number = 0;
  totalLastSession: number = 0;

  correctAverage: number = 0;
  totalCorrectQuestions: number = 0;
  correctLastSession: number = 0;


  constructor(private _sessionsDB: SessionDBService) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  private async getAllItems() {
    this.allSessions = await this._sessionsDB.getAllDocuments();
    // reset toggle array
    this.toggleDeleteArray = [];

    // reset statistic vars
    this.totalQuestions = 0;
    this.totalCorrectQuestions = 0;

    // initialize toggleDelete array to false
    var i: number = 0;
    for (i = 0; i < this.allSessions.length; i++) {
      // push toggle var
      this.toggleDeleteArray.push(false);

      // calculate statistic vars
      this.totalQuestions += this.allSessions[i].totalSession;
      this.totalCorrectQuestions += this.allSessions[i].correctSession;
    }

    // average
    this.totalAverage = this.totalQuestions / this.allSessions.length;
    this.correctAverage = this.totalCorrectQuestions / this.allSessions.length;

    // last session
    if (this.allSessions.length == 1) {
      // only one session available
      this.totalLastSession = this.allSessions[0].totalSession;
      this.correctLastSession = this.allSessions[0].correctSession;
    } else {
      this.totalLastSession = this.allSessions[1].totalSession;
      this.correctLastSession = this.allSessions[1].correctSession;
    }
  }

  async deleteItem(i: number, id: string, rev: string) {
    // close confirm delete dialog
    this.toggleDeleteArray[i] = false;
    // delete item
    this._sessionsDB.deleteItem(id, rev);
    this.getAllItems();
  }

  toggleConfirmDelete(i: number) {
    this.toggleDeleteArray[i] = !this.toggleDeleteArray[i];
  }





}
