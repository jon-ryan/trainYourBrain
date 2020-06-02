import { Component, OnInit } from '@angular/core';
//import { Router } from '@angular/router';
import { DbserviceService } from '../dbservice.service';
import { SessionDBService } from '../session-db.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as fs from 'fs';


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
  questionImagePath: string = "";
  questionImage: any;
  questionImageError: string = "";

  answerText: string = "";
  answerImagePath: string = "";
  answerImage: any;
  answerImageError: string = "";

  providedAnswer: string = "";

  // category
  existingCategories: Array<any> = [];
  selectedCategory: string = "";
  category: string = "";

  questionTotalAnswered: number = 0;
  questionCorrectAnswered: number = 0;



  // boolean for showing the answer
  showAnswer: boolean = false;

  // session variables
  totalThisSession: number = 0;
  correctThisSession: number = 0;

  constructor(private _databaseReference: DbserviceService, private _sessionReference: SessionDBService, private _sanitizer: DomSanitizer) {
    this.initialSetup();
    this.getAllCategories();
  }

  private async initialSetup() {
    this.itemsInDatabase = await this._databaseReference.getQuestionCountFromDatabase();
    if (this.itemsInDatabase == 0) {
      return;
    }
    await this.getRandomItem();
  }

  private async getAllCategories() {
    this.existingCategories = await this._databaseReference.getAllCategories();
  }

  ngOnInit(): void {
    // scroll to top
    document.documentElement.scrollTop = 0;


    // call async init method
    this.initialSetup();

    // get session counter
    this.totalThisSession = this._sessionReference.getTotalSession();
    this.correctThisSession = this._sessionReference.getCorrectSession();
  }

  private async getRandomItem() {
    // check if there are items that can be fetched
    if (this.itemsInDatabase == 0) {
      return;
    }

    // hide the answer
    this.showAnswer = false;

    var item: any;
    // check if a category is selected
    if (this.selectedCategory != undefined && this.selectedCategory != "") {
      item = await this._databaseReference.getRandomQuestionInCategory(this.selectedCategory);
    } else {
      item = await this._databaseReference.getRandomQuestion();
    }


    // populate the local properties
    this.questionID = item["_id"];
    this.questionRev = item["_rev"];

    this.questionText = item["questionText"];
    this.questionImagePath = item["questionImagePath"];

    this.answerText = item["answerText"];
    this.answerImagePath = item["answerImagePath"];

    this.questionTotalAnswered = item["total"];
    this.questionCorrectAnswered = item["correct"];

    this.category = item["category"];

    // load images if available
    if (this.questionImagePath != "") {
      // open the question image and display it
      try {
        var data = fs.readFileSync(this.questionImagePath);
        this.questionImage = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + Buffer.from(data).toString('base64'));

            // reset error for Q image
    this.questionImageError = "";
      } catch (err) {
        console.log(err);

        // Set error message
        this.questionImageError = "Could not load image. Looking for the file at " + this.questionImagePath;
      }
    } else {
      this.questionImage = undefined;
    }

    if (this.answerImagePath != "") {
      // open the image and display it
      try {
        var data = fs.readFileSync(this.answerImagePath);
        this.answerImage = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + Buffer.from(data).toString('base64'));
            // reset A image error
    this.answerImageError = "";
      } catch (err) {
        console.log(err);

        // Set error message
        this.answerImageError = "Could not load image. Looking for the file at " + this.answerImagePath;
      }
    } else {
      this.answerImage = undefined;
    }

  }


  // showSolution will unhide the answer
  public showSolution() {
    // show answer
    this.showAnswer = true;
  }

  // skip Question will skip a question. It will not increment the 'total' or 'correct' counter
  public skipQuestion() {
    // make sure the anser is hidden
    this.showAnswer = false;

    // get the next question
    this.getRandomItem();
  }

  // correctAnswer will increment total and correct answered, update the item
  // and go to the next question
  public correctAnswer() {
    // remove provided answer
    this.providedAnswer = "";

    // hide the answer
    this.showAnswer = false;

    // increment session counter
    this.totalThisSession++;
    this.correctThisSession++;

    // update session service
    this._sessionReference.incrementCorrectAndTotalSession();

    // increment question counters
    this.questionCorrectAnswered++;
    this.questionTotalAnswered++;

    // update database
    this._databaseReference.updateQuestion(this.questionID, this.questionRev, this.questionText, this.questionImagePath, this.answerText, this.answerImagePath, this.questionTotalAnswered, this.questionCorrectAnswered, this.category);
    // next question
    this.getRandomItem();
  }

  // incorrectAnswer will increment total answered, upate the item
  // and go to the next question
  public incorrectAnswer() {
    // remove provided answer
    this.providedAnswer = "";

    // hide the answer
    this.showAnswer = false;

    // increment session counter
    this.totalThisSession++;

    // update session service
    this._sessionReference.incrementTotalSession();

    // increment question counters
    this.questionTotalAnswered++;

    // update database
    this._databaseReference.updateQuestion(this.questionID, this.questionRev, this.questionText, this.questionImagePath, this.answerText, this.answerImagePath, this.questionTotalAnswered, this.questionCorrectAnswered, this.category);
    // next question
    this.getRandomItem();
  }

}
