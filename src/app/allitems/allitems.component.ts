import { Component, OnInit } from '@angular/core';
import { DbserviceService } from '../dbservice.service';

@Component({
  selector: 'app-allitems',
  templateUrl: './allitems.component.html',
  styleUrls: ['./allitems.component.scss']
})
export class AllitemsComponent implements OnInit {

  // array which holds all db objects
  allItems: Array<any> = [];

  toggleDeleteArray: Array<boolean> = [];

  constructor(private _databaseReference: DbserviceService) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  // getAllItems gets all items from the database
  private async getAllItems() {
    // get all items
    this.allItems = await this._databaseReference.getAllDocuments();
    // initialize toggleDelete
    var i: number = 0;
    for (i = 0; i < this.allItems.length; i++) {
      this.toggleDeleteArray.push(false);
    }
  }

  // deleteItem will prompt the database to delete the specified item
  async deleteItem(i: number, id: string, rev: string) {
    // close confirm delete dialog
    this.toggleDeleteArray[i] = false;
    // delete item
    this._databaseReference.deleteItem(id, rev);
    this.getAllItems();
  }

  toggleConfirmDelete(i: number) {
    this.toggleDeleteArray[i] = !this.toggleDeleteArray[i];
  }
}
