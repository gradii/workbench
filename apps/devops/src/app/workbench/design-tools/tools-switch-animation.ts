import {
  animate,
  animation,
  group,
  query,
  sequence,
  style,
  transition,
  trigger,
  useAnimation
} from '@angular/animations';

const animationDuration = 160;
const formOffset = '36px';

const settingsSidebarBounce = animation([
  // Make previous and next components absolute
  // We need to make sure that they do not interfere with each other
  query(
    ':enter nb-layout, :leave nb-layout',
    [
      style({
        position: 'absolute',
        // we need to add header-height gap
        top: '2.5rem',
        right: 0
      })
    ],
    { optional: true }
  ),

  group([
    // Animate right sidebar
    sequence([
      // Move next component to the right and hide it
      query(
        ':enter nb-sidebar[right] .main-container',
        [
          style({
            transform: `translateX(${formOffset})`,
            opacity: 0
          })
        ],
        { optional: true }
      ),

      // Animate previous component
      query(
        ':leave nb-sidebar[right] .main-container',
        [
          style({
            transform: 'translateX(0)',
            opacity: 1
          }),
          animate(
            animationDuration,
            style({
              transform: `translateX(${formOffset})`,
              opacity: 0
            })
          )
        ],
        { optional: true }
      ),

      // Animate next component
      query(
        ':enter nb-sidebar[right] .main-container',
        [
          animate(
            animationDuration,
            style({
              transform: 'translateX(0)',
              opacity: 1
            })
          )
        ],
        { optional: true }
      )
    ]),

    // Animate left sidebar
    sequence([
      // fix main container height
      query(
        ':enter nb-sidebar[left] .main-container, :leave nb-sidebar[left] .main-container',
        [
          style({
            top: 0
          })
        ],
        { optional: true }
      ),

      // Move next component to the left and hide it
      query(
        ':enter nb-sidebar[left]',
        [
          style({
            transform: `translateX(-${formOffset})`,
            opacity: 0
          })
        ],
        { optional: true }
      ),

      // Animate previous component
      query(
        ':leave nb-sidebar[left]',
        [
          style({
            transform: 'translateX(0)',
            opacity: 1
          }),
          animate(
            animationDuration,
            style({
              transform: `translateX(-${formOffset})`,
              opacity: 0
            })
          )
        ],
        { optional: true }
      ),

      // Animate next component
      query(
        ':enter nb-sidebar[left]',
        [
          animate(
            animationDuration,
            style({
              transform: 'translateX(0)',
              opacity: 1
            })
          )
        ],
        { optional: true }
      )
    ])
  ])
]);

/**
 * Generates animation transitions from any state to any tools only.
 * We need this to prevent animations from tools and allow animations inside tools only.
 * Was introduced to avoid animations when leaving tools since it caused a bug with header icons.
 */
export const toolsSwitchAnimation = (tools: string[]) =>
  trigger(
    'toolsSwitchAnimation',
    tools.map((tool: string) => transition(`* => ${tool}`, [useAnimation(settingsSidebarBounce)]))
  );
