import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { ipcRenderer } from 'electron';
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

  showUpdater: boolean = false;
  showRestartButton: boolean = false;

  message: string = "";

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

    ipcRenderer.on("update_available", () => {
      ipcRenderer.removeAllListeners("update_available");
      this.message = "An update is available. Downloading now...";
      this.showUpdater = true;
    });

    ipcRenderer.on('update_downloaded', () => {
      ipcRenderer.removeAllListeners('update_downloaded');
      this.message = 'Update Downloaded. It will be installed on restart. Restart now?';
      this.showRestartButton = true;
      this.showUpdater = true;
    });

    ipcRenderer.send("app-ready");
    console.log("app  ready sent");
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


  public closeNotification() {
    this.showUpdater = false;
  }

  public restartApp() {
    ipcRenderer.send('restart_app');
  }


}
