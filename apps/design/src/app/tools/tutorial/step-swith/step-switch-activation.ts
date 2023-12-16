import { Observable } from 'rxjs';

// TODO think about name, it's awful
export abstract class StepSwitchActivation {
  // TODO do we really need withPrev? It's always shown
  abstract withPrev$: Observable<boolean>;

  abstract withNext$: Observable<boolean>;
}
