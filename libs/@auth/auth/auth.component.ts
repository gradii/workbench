import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { enterLeaveFadeTrigger, enterLeaveSlideInOutTrigger } from './route-animation';

@Component({
  selector: 'tri-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [enterLeaveFadeTrigger, enterLeaveSlideInOutTrigger]
})
export class AuthComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
