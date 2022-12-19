import { animate, sequence, style, transition, trigger } from '@angular/animations';

export const stickAnimation = trigger('stickAnimation', [
  transition('* => animate', [
    sequence([
      style({ boxShadow: '0 0 0 0 rgba(30, 137, 239, 0.3)' }),
      animate(350, style({ boxShadow: '0 0 0 6px rgba(30, 137, 239, 0.3)' })),
      animate(150, style({ boxShadow: '0 0 0 8px rgba(30, 137, 239, 0)' }))
    ])
  ])
]);
