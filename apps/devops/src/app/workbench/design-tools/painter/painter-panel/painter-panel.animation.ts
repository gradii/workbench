import { animate, style, transition, trigger } from '@angular/animations';

export const themeSettingsAnimation = trigger('themeSettingsAnimation', [
  transition(':enter', [
    style({ transform: `translateX(-19rem)`, opacity: 0.7 }),
    animate('0.3s ease-out', style({ transform: `translateX(0)` }))
  ]),
  transition(':leave', [
    style({ transform: `translateX(0)`, opacity: 1 }),
    animate('0.3s ease-out', style({ transform: `translateX(-19rem)`, opacity: 0.7 }))
  ])
]);

export const themeListAnimation = trigger('themeListAnimation', [
  transition(':enter', [
    style({ transform: `translateX(19rem)`, opacity: 0.7 }),
    animate('0.3s ease-out', style({ transform: `translateX(0)` }))
  ]),
  transition(':leave', [
    style({ transform: `translateX(0)`, opacity: 1 }),
    animate('0.3s ease-out', style({ transform: `translateX(19rem)`, opacity: 0.7 }))
  ])
]);
