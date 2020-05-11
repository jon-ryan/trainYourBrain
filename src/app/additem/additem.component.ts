import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit {

  submitError: boolean = false;

  questionText: String;
  questionImage: any;

  answerText: String;
  answerImage: any;

  constructor() { }

  public submitNewItem() {
    // check for valid input
    if ((this.questionText == undefined && this.questionImage == undefined) ||
        (this.answerText == undefined && this.answerImage == undefined)) {
      this.submitError = true;
      return;
    }

    // TODO
    // deal with files
    // put into database

    console.log("Question:");
    console.log(this.questionText);
    console.log(this.questionImage);
    console.log("Answer:");
    console.log(this.answerText);
    console.log(this.answerImage);
  }

  ngOnInit(): void {
  }

}
