import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  version: any;

  constructor() { }

  ngOnInit(): void {
    // scroll to top
    document.documentElement.scrollTop = 0;

    ipcRenderer.invoke("app_version").then((version) => {
      this.version = version;
    })
  }

}
