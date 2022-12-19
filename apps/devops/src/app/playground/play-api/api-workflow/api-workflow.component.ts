import { Component, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'api-workflow',
  template: `
    <div >
        <router-outlet></router-outlet>
    </div>`
})
export class ApiWorkflowComponent implements OnInit, OnDestroy {

  constructor(/*private nbThemeService: NbThemeService*/) {
    // nbThemeService.changeTheme('dark')

  }

  ngOnInit() {
    document.getElementsByTagName('body')[0].classList.add('nb-theme-dark')
  }

  ngOnDestroy(): void {
    document.getElementsByTagName('body')[0].classList.remove('nb-theme-dark')
  }

}
