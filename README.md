# Train Your Brain
With Train-Your-Brain you can easily train yourself on knowledge and facts you really want to remember. Add some questions and the correct answers and try to remember those facts. If you remembered the answer, validate your solution with what you initially set as the answer.
This is an ideal companion for every student who is trying to get the hang on their subject.

# Download the App
To download the app for your platform head over to [Releases](https://github.com/jon-ryan/trainYourBrain/releases) and choose the according files from the latest release.

Files to download per platform:
- Windows: You need the files `latest.yml`, `Train-Your-Brain-Setup-x.x.x.exe.blockmap` and `Train-Your-Brain-Setup-x.x.x.exe`. Download those files and launch the file `Train-Your-Brain-Setup-x.x.x.exe`. Please note, that since I'm not a certified Windows developer, Windows will warn you to not execute the app. If you don't trust me and don't want to use this version you can build the app from source. To do this, please see the instructions below.
- Linux (AppImage): You need the files `latest-linux.yml` and `Train-Your-Brain-1.1.0.AppImage`. Launch the AppImage and integrate it. Also copy the .yml file into your Applications folder next to the integrated AppImage. Please note, that auto-updater is not working at the moment.
- Mac: Unfortunately, at the moment you have to build from source, if you are on a Mac


# Clone and build from source
If you want to build this app from source follow these steps:

Make sure, you have npm installed


Clone this repository locally
``` bash
git clone https://github.com/jon-ryan/trainYourBrain.git
```


Install dependencies with npm
``` bash
npm install
```


Build for your platform
|Command|Description|
|--|--|
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system (AppImage) |
|`npm run electron:windows`| Builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  Builds your application and generates a `.app` file of your application that can be run on Mac |
|`npm start`| Build a development version of the app |

The compiled app is in the `release` folder.


## Copyright notice
This project uses
- [angular-electron](https://github.com/maximegris/angular-electron)
- [pouchdb](https://github.com/pouchdb/pouchdb)
