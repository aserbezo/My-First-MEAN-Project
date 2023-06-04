import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  // main. ts is the entry point of your application ,
  //compiles the application with just-in-time and bootstraps the application .
  //Angular can be bootstrapped in multiple environments we need to import a module specific to the environment.
  //in which angular looks for which module would run first.
