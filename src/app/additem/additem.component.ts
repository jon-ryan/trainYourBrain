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

  constructor(private _databaseReference: DbserviceService) { }

  public async submitNewItem() {
    // check for valid input
    // a question Text and answer Text is always required
    if (this.questionText == undefined || this.answerText == undefined) {
      this.submitError = true;
      return;
    }

    // TODO
    // deal with files


    // put into database
    await this._databaseReference.putDocument(this.questionText, this.answerText);

    // reset values
    this.questionText = undefined;
    this.questionImage = undefined;
    this.answerText = undefined;
    this.answerImage = undefined;
  }

  ngOnInit(): void {
  }

}
