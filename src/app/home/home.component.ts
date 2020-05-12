import { Component, OnInit } from '@angular/core';
//import { Router } from '@angular/router';
import { DbserviceService } from '../dbservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // local counter for how many items are currently in the database
  itemsInDatabase: number = 0;

  // properties for the document
  questionID: string = "";
  questionRev: string = "";

  questionText: string = "";
  // questionImage

  answerText: string = "";
  // answerImage

  questionTotalAnswered: number = 0;
  questionCorrectAnswered: number = 0;

  // boolean for showing the answer
  showAnswer: boolean = false;

  constructor(private _databaseReference: DbserviceService) {
    this.initialSetup();
  }

  private async initialSetup() {
    this.itemsInDatabase = await this._databaseReference.getItemCountFromDatabase();
    if (this.itemsInDatabase == 0) {
      return;
    }
    await this.getRandomItem();
  }

  ngOnInit(): void {
    // call async init method
    this.initialSetup();
  }

  // getItemCountInDatabase will retrieve the amount of items in the database
  private getItemCountInDatabase() {
    // get how many items are in the database
    this.itemsInDatabase = this._databaseReference.getItemCount();
  }

  private async getRandomItem() {
    // check if there are items that can be fetched
    if (this.itemsInDatabase == 0) {
      return;
    }

    var item = await this._databaseReference.getRandom();

    // populate the local properties
    this.questionID = item["_id"];
    this.questionRev = item["_rev"];

    this.questionText = item["questionText"];
    this.answerText = item["answerText"];

    this.questionTotalAnswered = item["total"];
    this.questionCorrectAnswered = item["correct"];
  }


  // showSolution will unhide the answer
  showSolution() {
    // show answer
    this.showAnswer = true;
  }

  // skip Question will skip a question. It will not increment the 'total' or 'correct' counter
  skipQuestion() {
    // make sure the anser is hidden
    this.showAnswer = false;

    // get the next question
    this.getRandomItem();
  }

  // correctAnswer will increment total and correct answered, update the item
  // and go to the next question
  correctAnswer() {
    // hide the answer
    this.showAnswer = false;

    // increment question counters
    this.questionCorrectAnswered++;
    this.questionTotalAnswered++;

    // update database
    this._databaseReference.updateDocument(this.questionID, this.questionRev, this.questionText, this.answerText, this.questionTotalAnswered, this.questionCorrectAnswered);
    // next question
    this.getRandomItem();
  }

  // incorrectAnswer will increment total answered, upate the item
  // and go to the next question
  incorrectAnswer() {
    // hide the answer
    this.showAnswer = false;

    // increment question counters
    this.questionTotalAnswered++;

    // update database
    this._databaseReference.updateDocument(this.questionID, this.questionRev, this.questionText, this.answerText, this.questionTotalAnswered, this.questionCorrectAnswered);
    // next question
    this.getRandomItem();
  }

}
