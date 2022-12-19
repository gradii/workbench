import { animate, query, style, transition, trigger } from '@angular/animations';

const animationDuration = 160;
const formOffset = '5rem';

export const enterLeaveFadeTrigger = trigger('enterLeaveFadeTrigger', [
  transition(':enter', [style({ opacity: 0 }), animate(animationDuration, style({ opacity: 1 }))]),
  transition(':leave', [animate(animationDuration, style({ opacity: 0 }))])
]);

export function notFromVoid(from: string): boolean {
  return from !== 'void';
}

export const enterLeaveSlideInOutTrigger = trigger('enterLeaveSlideInOutTrigger', [
  transition(notFromVoid, [
    style({ position: 'relative' }),

    query(
      ':enter, :leave',
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }),
      { optional: true }
    ),

    query(':enter', [style({ transform: `translate3d(${formOffset}, 0, 0)`, opacity: 0 })], { optional: true }),

    query(
      ':leave',
      [
        style({ transform: 'translate3d(0, 0, 0)', opacity: 1 }),
        animate(animationDuration, style({ transform: `translate3d(${formOffset}, 0, 0)`, opacity: 0 }))
      ],
      { optional: true }
    ),

    query(':enter', [animate(animationDuration, style({ transform: 'translate3d(0, 0, 0)', opacity: 1 }))], {
      optional: true
    })
  ]),
  transition(':enter', [
    style({ position: 'relative' }),

    query(
      ':enter',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate3d(${formOffset}, 0, 0)`,
          opacity: 0
        }),
        animate(animationDuration, style({ transform: 'translate3d(0, 0, 0)', opacity: 1 }))
      ],
      { optional: true }
    )
  ])
]);
