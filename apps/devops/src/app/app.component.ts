import { Component, OnInit } from '@angular/core';

@Component({
  selector   : 'pf-app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  mobileMenuActive: boolean;

  constructor(/*private themeService: ThemeService*/) {

  }

  ngOnInit() {
    // this.themeService.changeTheme('devops');
  }
}
