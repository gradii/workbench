import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const projectEnterLeaveAnimation = trigger('projectEnterLeave', [
  transition('* => *', [
    query(
      ':leave',
      [
        style({
          opacity: 1,
          transform: 'translateY(0)'
        }),

        animate(
          300,
          style({
            opacity: 0,
            transform: 'translateY(-50px)'
          })
        ),

        style({ width: '*', height: 0 }),

        animate(200, style({ width: 0 }))
      ],
      { optional: true }
    ),

    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(-50px)'
        }),

        stagger(100, [
          animate(
            300,
            style({
              opacity: 1,
              transform: 'translateY(0)'
            })
          )
        ])
      ],
      { optional: true }
    )
  ])
]);

export const noProjectEnterAnimation = trigger('noProjectEnter', [
  transition(':enter', [
    style({
      opacity: 0
    }),

    animate(
      '200ms 500ms',
      style({
        opacity: 1
      })
    )
  ])
]);
