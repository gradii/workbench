import { animate, sequence, style, transition, trigger } from '@angular/animations';

export const appearAnimation = trigger('appearAnimation', [
  transition('* => animate', [
    sequence([
      style({ boxShadow: '0 0 0 0 rgba(197, 203, 214, 0.5)' }),
      animate(350, style({ boxShadow: '0 0 0 7px rgba(197, 203, 214, 0.5)' })),
      animate(150, style({ boxShadow: '0 0 0 10px rgba(197, 203, 214, 0)' }))
    ])
  ])
]);
