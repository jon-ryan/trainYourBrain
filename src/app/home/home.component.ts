import { Component, OnInit } from '@angular/core';
//import { Router } from '@angular/router';
import { DbserviceService } from '../dbservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // TODO
  // load random question from db and display it (text, image)

  itemsInDatabase: number = 0;
  question: Promise<Map<String, any>>;

  questionText: String = "";

  constructor(private _databaseReference: DbserviceService) {
  }

  ngOnInit(): void {
    // get how many items are in the database
    this.getItemsInDatabase();
    // if the db is not empty get a question
    if (this.itemsInDatabase != 0) {
      this.question = this._databaseReference.getRandom();
    }
  }

  private async getItemsInDatabase() {
    // get how many items are in the database
    this.itemsInDatabase = await this._databaseReference.getItemCount();
  }

  showSolution() {

  }
}
