import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/components/home/home.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  bootstrapApplication(HomeComponent)
  .catch(err => console.error(err));
