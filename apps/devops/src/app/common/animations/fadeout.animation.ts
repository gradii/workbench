import { animate, state, style, transition, trigger } from '@angular/animations';

export const simpleFadeAnimation = trigger('simpleFadeAnimation', [

  // the "in" style determines the "resting" state of the element when it is visible.
  state('in', style({ transform: 'translateY(0)', backgroundColor: 'none' })),

  // fade in when created. this could also be written as transition('void => *')
  transition(':enter', [
    style({ transform: 'translateY(-10px)', backgroundColor: '#efefef' }),
    animate('600ms cubic-bezier(0.250, 0.460, 0.450, 0.940)'/* 600*/)
  ])

  // fade out when destroyed. this could also be written as transition('void => *')
  // transition(':leave',
  //   animate(600, style({opacity: 0})))
]);
