// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase:{
    apiKey: "AIzaSyCGi7KeARHPGafGRF5ykg6r2-Jdr1VLRS0",
    authDomain: "fed-db.firebaseapp.com",
    databaseURL: "https://fed-db.firebaseio.com",
    projectId: "fed-db",
    storageBucket: "fed-db.appspot.com",
    messagingSenderId: "643921447498",
    appId: "1:643921447498:web:326fc3c397a193de1734b3"
  },
  roles:["student","teacher"]
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
