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
  questionText: String = "";
  // questionImage
  answerText: String = "";
  // answerImage

  // boolean for showing the answer
  showAnswer: boolean = false;

  constructor(private _databaseReference: DbserviceService) {
    this.initialSetup();
  }

  private async initialSetup() {
    this.itemsInDatabase = await this._databaseReference.getItemCountFromDatabase();
    await this.getRandomItem();
  }

  ngOnInit(): void {
    // get how many items are in the database
    this.getItemCountInDatabase();
    // if the db is not empty get a question
    if (this.itemsInDatabase != 0) {
      this.getRandomItem();
    }
  }

  // getItemCountInDatabase will retrieve the amount of items in the database
  private getItemCountInDatabase() {
    // get how many items are in the database
    this.itemsInDatabase = this._databaseReference.getItemCount();
  }

  private async getRandomItem() {
    var item = await this._databaseReference.getRandom();

    console.log(item);

    // populate the local properties
    this.questionText = item["questionText"];
    this.answerText = item["answerText"];
  }


  showSolution() {
    this.showAnswer = true;
  }

  nextQuestion() {
    // reset showAnswer to false
    this.showAnswer = false;

    // get the next question
    this.getRandomItem();
  }
}
