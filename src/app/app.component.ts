import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { slider } from './route-animations';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slider,
  ]
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
  ) {
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  public prepareRoute (outlet: RouterOutlet) {
    if (outlet.activatedRouteData['animation'] == undefined) {
      // home route returns undefined
      // therefore setting values manually
      return outlet && {animation: 'home'} && 'home';
    } else {
      return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
  }
}
