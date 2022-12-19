
import { fromTools } from '@tools-state/tools.reducer';
import { PuffComponent } from '@tools-state/component/component.model';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
//
// export function validateAppropriateIndexOrder(reducer: ActionReducer<fromTools.State>): ActionReducer<fromTools.State> {
//   return (state: fromTools.State, action: Action): fromTools.State => {
//     const newState = reducer(state, action);
//
//     if (state) {
//       validateOrder(state, action);
//     }
//
//     return newState;
//   };
// }
//
// function validateOrder(state: fromTools.State, action: Action): void {
//   const components: BakeryComponent[] = getComponents(state);
//   const slots: Slot[] = getSlots(state);
//
//   for (const slot of slots) {
//     const children: BakeryComponent[] = getChildren(slot, components);
//     const sortedChildren: BakeryComponent[] = sort(children);
//
//     validate(sortedChildren, action);
//   }
// }
//
// function getComponents(state: fromTools.State): BakeryComponent[] {
//   const { ids, entities } = state.components;
//   const components: BakeryComponent[] = [];
//
//   for (const id of ids) {
//     components.push(entities[id]);
//   }
//
//   return components;
// }
//
// function getSlots(state: fromTools.State): Slot[] {
//   const { ids, entities } = state.slots;
//   const components: Slot[] = [];
//
//   for (const id of ids) {
//     components.push(entities[id]);
//   }
//
//   return components;
// }
//
// function getChildren(slot: Slot, components: BakeryComponent[]): BakeryComponent[] {
//   const children: BakeryComponent[] = [];
//
//   for (const component of components) {
//     if (component.parentSlotId === slot.id) {
//       children.push(component);
//     }
//   }
//
//   return children;
// }
//
// function sort(components: BakeryComponent[]): BakeryComponent[] {
//   return components.sort((a: BakeryComponent, b: BakeryComponent) => {
//     return a.index - b.index;
//   });
// }
//
// function validate(components: BakeryComponent[], action: Action): void {
//   for (let i = 0; i < components.length; i++) {
//     const component: BakeryComponent = components[i];
//
//     if (component.index !== i) {
//       if (action instanceof WorkingAreaActions.SyncState) {
//         console.info(components.map(c => c.index));
//         // tslint:disable-next-line:no-debugger
//         debugger;
//       }
//     }
//   }
// }
