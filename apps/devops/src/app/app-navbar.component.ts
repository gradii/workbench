import { Component } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  selector   : 'app-navbar',
  templateUrl: './app-navbar.component.html'
})
export class AppNavbarComponent {

  constructor(public app: AppComponent) {

  }

}

