import { ipcRenderer } from 'electron';
import { Component, OnInit } from '@angular/core';
import { DbserviceService } from '../dbservice.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as fs from 'fs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private _database: DbserviceService, private _router: Router, private _sanitizer: DomSanitizer) { }

  submitError: boolean = false;

  questionID: string;
  questionRev: string;

  questionText: string;
  questionImagePath: string = "";
  questionImage: any;

  answerText: string;
  answerImagePath: string = "";
  answerImage: any;

  category: string;
  categoryNew: string;
  categoryFromList: string;
  existingCategories: Array<any> = [];

  questionTotalAnswered: number;
  questionCorrectAnswered: number;

  returnTo: string;

  errorText: string = "";


  ngOnInit(): void {
    this.loadItem()
  }

  private async loadItem() {
    this.getAllCategories()

    var item: any;

    item = await this._database.getEditItem();

    this.questionID = item["_id"];
    this.questionRev = item["_rev"];

    this.questionText = item["questionText"];
    this.questionImagePath = item["questionImagePath"];

    this.answerText = item["answerText"];
    this.answerImagePath = item["answerImagePath"];

    this.questionTotalAnswered = item["total"];
    this.questionCorrectAnswered = item["correct"];

    this.category = item["category"];
    this.categoryFromList = item["category"];

    this.returnTo = this._database.getPageToRouteBackTo();


    // load images
    // question image
    if (this.questionImagePath != '') {
      try {
        var data = fs.readFileSync(this.questionImagePath);
        this.questionImage = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + Buffer.from(data).toString('base64'));
      } catch (err) {
        console.log(err);
      }
    }


    // answer image
    if (this.answerImagePath != '') {
      try {
        var data = fs.readFileSync(this.answerImagePath);
        this.answerImage = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + Buffer.from(data).toString('base64'));
      } catch (err) {
        console.log(err);
      }
    }

  }

  private async getAllCategories() {
    this.existingCategories = await this._database.getAllCategories();
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

  public async saveItem() {
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


    // reset submit error
    this.submitError = false;

    var tmpCategory: string;

    // get the valid category
    if (this.categoryNew != undefined && this.categoryNew != "") {
      tmpCategory = this.categoryNew;
    } else if (this.categoryFromList != undefined && this.categoryFromList != "") {
      tmpCategory = this.categoryFromList;
    }

    // update database
    await this._database.updateQuestion(this.questionID, this.questionRev, this.questionText, this.questionImagePath, this.answerText, this.answerImagePath, this.questionTotalAnswered, this.questionCorrectAnswered, this.category)

    this._router.navigateByUrl(this.returnTo)
  }

}
