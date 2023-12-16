import { animate, style, transition, trigger } from '@angular/animations';

export const dialogEnterLeaveAnimation = trigger('dialogEnterLeave', [
  transition('* => enter', [
    style({
      opacity: 0,
      transform: 'translateY(-36px)'
    }),
    animate(
      200,
      style({
        opacity: 1,
        transform: 'translateY(0)'
      })
    )
  ]),

  transition('* => leave', [
    style({
      opacity: 1,
      transform: 'translateY(0)'
    }),
    animate(
      200,
      style({
        opacity: 0,
        transform: 'translateY(-36px)'
      })
    )
  ])
]);
