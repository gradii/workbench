import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import 'style-loader!./styles/my-styles.scss';

import { LoaderService } from '@core/loader.service';

@Component({
  template: `<router-outlet></router-outlet>`
})
export class AccountThemeComponent implements OnInit, AfterViewInit {
  constructor(private themeService: NbThemeService, private loader: LoaderService) {
  }

  ngOnInit(): void {
    this.themeService.changeTheme('light');
  }

  ngAfterViewInit(): void {
    this.loader.hide();
  }
}
