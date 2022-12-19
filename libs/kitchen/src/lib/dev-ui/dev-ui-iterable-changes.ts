import { IterableChangeRecord, IterableChanges } from '@angular/core';

import { FlourComponent } from '../model';

export class DevUIIterableChanges implements IterableChanges<FlourComponent | FlourComponent> {
  forEachAddedItem(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
  }

  forEachIdentityChange(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
  }

  forEachItem(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
  }

  forEachMovedItem(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
  }

  forEachOperation(
    fn: (
      record: IterableChangeRecord<FlourComponent | FlourComponent>,
      previousIndex: number | null,
      currentIndex: number | null
    ) => void
  ): void {
  }

  forEachPreviousItem(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
  }

  forEachRemovedItem(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
  }
}

export class CreateIterableChanges extends DevUIIterableChanges {
  constructor(private items: (FlourComponent | FlourComponent)[]) {
    super();
  }

  forEachAddedItem(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
    this.items.forEach((item: FlourComponent | FlourComponent) => fn(createRecord(item)));
  }
}

export class UpdateIterableChanges extends DevUIIterableChanges {
  constructor(protected items: (FlourComponent | FlourComponent)[]) {
    super();
  }

  forEachIdentityChange(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
    this.items.forEach((item: FlourComponent | FlourComponent) => fn(createRecord(item)));
  }
}

export class DeleteIterableChanges extends DevUIIterableChanges {
  constructor(private items: (FlourComponent | FlourComponent)[]) {
    super();
  }

  forEachRemovedItem(fn: (record: IterableChangeRecord<FlourComponent | FlourComponent>) => void): void {
    this.items.forEach((item: FlourComponent | FlourComponent) => fn(createRecord(item)));
  }
}

function createRecord(item: FlourComponent | FlourComponent): IterableChangeRecord<FlourComponent | FlourComponent> {
  return { item, trackById: null, currentIndex: null, previousIndex: null };
}
