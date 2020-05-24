import { Component, OnInit } from '@angular/core';
import { DbserviceService } from '../dbservice.service';

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

  constructor(private _databaseReference: DbserviceService) { }

  ngOnInit(): void {
    this.getAllItems();
    this.getAllCategories();
    this.toggleDeleteAll = false;
  }

  // getAllItems gets all items from the database
  private async getAllItems() {
    // get all items
    this.allItems = await this._databaseReference.getAllDocuments();
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
    this.allItems = await this._databaseReference.getAllDocumentsWithSpecificCategory(category);

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

  // deleteItem will prompt the database to delete the specified item
  public async deleteItem(i: number, id: string, rev: string) {
    // close confirm delete dialog
    this.toggleDeleteArray[i] = false;
    // delete item
    await this._databaseReference.deleteDocument(id, rev);


    this.getAllItems();
  }

  public toggleConfirmDelete(i: number) {
    this.toggleDeleteArray[i] = !this.toggleDeleteArray[i];
  }

  public toggleConfirmDeleteAll() {
    this.toggleDeleteAll = !this.toggleDeleteAll;
  }

  public async deleteAllDocuments() {

    this.toggleDeleteAll = false;

    await this._databaseReference.bulkDelete();

    this.getAllItems();
  }
}
