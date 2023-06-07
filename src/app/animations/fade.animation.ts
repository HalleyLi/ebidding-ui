import { animate, AnimationQueryOptions, style, transition, trigger } from '@angular/animations';

const options: AnimationQueryOptions = {
  optional: true
};

/** fade-in fade-out */
export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({
      transform: 'scale3d(1.075, 1.075, 1)',
      opacity: 0
    }),
    animate(
      '250ms ease-out',
      style({
        transform: 'scale3d(1, 1, 1)',
        opacity: 1
      })
    )
  ]),
  transition(':leave', [
    animate(
      '250ms ease-out',
      style({
        transform: 'scale3d(0.95, 0.95, 1)',
        opacity: 0
      })
    )
  ])
]);


export const fadeRouteAnimation = trigger('fadeRouteAnimation', [
  transition('*<=>*', [
    // css styles at start of transition
    style({ opacity: 0, 'will-change': 'transform' }),

    // animation and styles at end of transition
    animate('0.3s ease-in', style({ opacity: 1, 'will-change': 'transform' }))
  ])
]);
