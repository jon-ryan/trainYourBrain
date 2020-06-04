import { ipcRenderer } from 'electron';
import { Component, OnInit } from '@angular/core';
import { DbserviceService } from '../dbservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as fs from 'fs';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {

  submitError: boolean = false;

  questionText: string;
  questionImagePath: string = "";
  questionImage: any;

  answerText: string;
  answerImagePath: string = "";
  answerImage: any;

  categoryNew: string;
  categoryFromList: string;
  existingCategories: Array<any> = [];

  errorText: string = "";

  constructor(private _databaseReference: DbserviceService, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // scroll to top
    document.documentElement.scrollTop = 0;
    this.getAllCategories();
  }

  public async submitNewItem() {

    // check for valid input
    // a question Text and answer Text is always required
    if (this.questionText == undefined || this.answerText == undefined) {
      this.submitError = true;
      this.errorText = "Please provide some text for both, question and answer.";
      return;
    }

    // check if a category is selected or if a new category is created and an old one selected
    if ((this.categoryNew == undefined || this.categoryNew == "") && (this.categoryFromList == undefined || this.categoryFromList == "")) {
      this.submitError = true;
      this.errorText = "Please specify a category. ";
      return;

      // both categories are set
    } else if ((this.categoryNew != undefined && this.categoryNew != "") && (this.categoryFromList != undefined && this.categoryFromList != "")) {
      this.submitError = true;
      this.errorText = "Please only specify one category. Creating a new one and selecting an existing category is not possible."
      return;
    }

    // scroll to top
    document.documentElement.scrollTop = 0;

    // reset submit error
    this.submitError = false;

    var tmpCategory: string;
    // get the valid category
    if (this.categoryNew != undefined && this.categoryNew != "") {
      tmpCategory = this.categoryNew;
    } else if (this.categoryFromList != undefined && this.categoryFromList != "") {
      tmpCategory = this.categoryFromList;
    }

    // put into database
    await this._databaseReference.putQuestion(this.questionText, this.answerText, tmpCategory, this.questionImagePath, this.answerImagePath);

    // refresh all categories
    await this.getAllCategories();

    // reset values
    this.questionText = undefined;
    this.questionImagePath = "";
    this.questionImage = undefined;
    this.answerText = undefined;
    this.answerImagePath = "";
    this.answerImage = undefined;
    this.categoryNew = undefined;
    this.categoryFromList = undefined;
  }

  private async getAllCategories() {
    this.existingCategories = await this._databaseReference.getAllCategories();
  }

  public openFileDialogQuestionImage() {
    ipcRenderer.invoke("showOpenFileDialog").then((path: Array<string>) => {
      this.questionImagePath = path[0];

      // open the image and display it
      try {
        var data = fs.readFileSync(this.questionImagePath);
        this.questionImage = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + Buffer.from(data).toString('base64'));
      } catch (err) {
        console.log(err);
      }
    })
  }

  public async openFileDialogAnswerImage() {
    ipcRenderer.invoke("showOpenFileDialog").then((path: Array<string>) => {
      this.answerImagePath = path[0];

      // open the image and display it
      try {
        var data = fs.readFileSync(this.answerImagePath);
        this.answerImage = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + Buffer.from(data).toString('base64'));
      } catch (err) {
        console.log(err);
      }
    }
    );
  }





}
