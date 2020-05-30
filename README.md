# Train Your Brain
With Train-Your-Brain you can easily train yourself on knowledge and facts you really want to remember. Add some questions and the correct answers and try to remember those facts. If you remembered the answer, validate your solution with what you initially set as the answer.
This is an ideal companion for every student who is trying to get the hang on their subject.

# Download the App
See the download links about for your platform below. Before installing the app you have to extract the .zip file:
- [Windows](https://drive.google.com/file/d/1YdVVTFpZFF77a-z3V0KY8Pftze5FK6qh/view?usp=sharing) Please note, that since I'm not a certified Windows developer, Windows will warn you to not execute the app. If you don't trust me and don't want to use this version you can build the app from source. To do this, please see the instructions below.
- [Linux (AppImage)](https://drive.google.com/file/d/1Ph3pm7N4obf_3mlM0tZ907jmR9c4i3Yq/view?usp=sharing)
- Mac: Unfortunately, at the moment you have to build from source, if you are on a Mac

# Clone and build from source
If you want to build this app from source follow these steps:

Make sure, you have npm installed


Clone this repository locally
``` bash
git clone https://github.com/maximegris/angular-electron.git
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
