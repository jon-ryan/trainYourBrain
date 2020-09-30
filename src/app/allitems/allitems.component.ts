import { Component, OnInit } from '@angular/core';
import { DbserviceService } from '../dbservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allitems',
  templateUrl: './allitems.component.html',
  styleUrls: ['./allitems.component.scss']
})
export class AllitemsComponent implements OnInit {

  // array which holds all question objects
  allItems: Array<any> = [];

  existingCategories: Array<any> = [];
  selectedCategory: string = "";

  toggleDeleteArray: Array<boolean> = [];

  toggleDeleteAll: boolean = false;

  public open_close: string = "Open";

  constructor(private _databaseReference: DbserviceService, private _router: Router) { }

  ngOnInit(): void {
    // scroll to top
    document.documentElement.scrollTop = 0;

    this.getAllItems();
    this.getAllCategories();
    this.toggleDeleteAll = false;
  }

  // getAllItems gets all items from the database
  private async getAllItems() {
    // get all items
    this.allItems = await this._databaseReference.getAllQuestions();
    // initialize toggleDelete
    this.toggleDeleteArray = [];
    var i: number = 0;
    for (i = 0; i < this.allItems.length; i++) {
      this.toggleDeleteArray.push(false);
    }
  }

  private async getAllCategories() {
    this.existingCategories = await this._databaseReference.getAllCategories();
  }

  private async getFilteredQuestions(category: string) {
    // debug
    console.log("get filtered questions")

    
    this.allItems = await this._databaseReference.getAllQuestionsWithSpecificCategory(category);

    // initialize toggleDelete
    this.toggleDeleteArray = [];
    var i: number = 0;
    for (i = 0; i < this.allItems.length; i++) {
      this.toggleDeleteArray.push(false);
    }
  }

  public filterByCategory() {
    if (this.selectedCategory != "") {
      this.getFilteredQuestions(this.selectedCategory);
    } else {
      this.getAllItems();
    }
  }

  public async editItem(id: string) {
    // set the item id to edit and the page where the edit came from
    this._databaseReference.setEditItem(id, '/allitems')

    // route to edit page
    this._router.navigateByUrl('/edit')
  }


  // deleteItem will prompt the database to delete the specified item
  public async deleteItem(i: number, id: string, rev: string) {
    // close confirm delete dialog
    this.toggleDeleteArray[i] = false;
    // delete item
    await this._databaseReference.deleteQuestion(id, rev);

    // if a category is selected, get all according questions
    if (this.selectedCategory != "") {
      await this.getFilteredQuestions(this.selectedCategory);
      // debug
      console.log("delete item with category selected");
    } else {
      // get all items
      await this.getAllItems();
    }
  }

  public toggleConfirmDelete(i: number) {
    this.toggleDeleteArray[i] = !this.toggleDeleteArray[i];
  }

  public toggleConfirmDeleteAll() {
    this.toggleDeleteAll = !this.toggleDeleteAll;

    if (this.open_close == "Open") {
      this.open_close = "Close";
    } else {
      this.open_close = "Open";
    }
  }

  public async deleteAllDocuments() {

    this.toggleDeleteAll = false;

    await this._databaseReference.bulkDelete();

    this.getAllItems();
  }
}
