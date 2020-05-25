import { Component, OnInit } from '@angular/core';
import { DbserviceService } from '../dbservice.service';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {

  submitError: boolean = false;

  questionText: string;
  questionImage: any;

  answerText: string;
  answerImage: any;

  categoryNew: string;
  categoryFromList: string;
  existingCategories: Array<any> = [];

  errorText: string = "";

  constructor(private _databaseReference: DbserviceService) { }

  public async submitNewItem() {

    // check for valid input
    // a question Text and answer Text is always required
    if (this.questionText == undefined || this.answerText == undefined) {
      this.submitError = true;
      this.errorText = "Please provide some text or an image for both, question and answer.";
      return;
    }

    // check if a category is selected or if a new category is created and an old one selected
    if ((this.categoryNew == undefined || this.categoryNew == "") && (this.categoryFromList == undefined || this.categoryFromList == "")) {
      this.submitError = true;
      this.errorText = "Please specify a category. ";
      return;

    // both categories are set
    } else if ((this.categoryNew != undefined && this.categoryNew != "")  && (this.categoryFromList != undefined && this.categoryFromList != "")) {
      this.submitError = true;
      this.errorText = "Please only specify one category. Creating a new one and selecting an existing category is not possible."
      return;
    }

    // reset submit error
    this.submitError = false;

    // TODO
    // deal with files


    var tmpCategory: string;
    // get the valid category
    if (this.categoryNew != undefined && this.categoryNew != "") {
      tmpCategory = this.categoryNew;
    } else if (this.categoryFromList != undefined && this.categoryFromList != "") {
      tmpCategory = this.categoryFromList;
    }

    // put into database
    await this._databaseReference.putQuestion(this.questionText, this.answerText, tmpCategory);

    // refresh all categories
    await this.getAllCategories();

    // reset values
    this.questionText = undefined;
    this.questionImage = undefined;
    this.answerText = undefined;
    this.answerImage = undefined;
    this.categoryNew = undefined;
    this.categoryFromList = undefined;
  }

  private async getAllCategories() {
    this.existingCategories = await this._databaseReference.getAllCategories();
  }

  ngOnInit(): void {
    this.getAllCategories();
  }
}
