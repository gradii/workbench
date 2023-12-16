import { IterableChangeRecord, IterableChanges } from '@angular/core';

import { VirtualComponent } from '../model';

export class DevUIIterableChanges implements IterableChanges<VirtualComponent> {
  forEachAddedItem(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
  }

  forEachIdentityChange(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
  }

  forEachItem(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
  }

  forEachMovedItem(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
  }

  forEachOperation(
    fn: (
      record: IterableChangeRecord<VirtualComponent>,
      previousIndex: number | null,
      currentIndex: number | null
    ) => void
  ): void {
  }

  forEachPreviousItem(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
  }

  forEachRemovedItem(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
  }
}

export class CreateIterableChanges extends DevUIIterableChanges {
  constructor(private items: VirtualComponent[]) {
    super();
  }

  forEachAddedItem(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
    this.items.forEach((item: VirtualComponent) => fn(createRecord(item)));
  }
}

export class UpdateIterableChanges extends DevUIIterableChanges {
  constructor(protected items: VirtualComponent[]) {
    super();
  }

  forEachIdentityChange(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
    this.items.forEach((item: VirtualComponent) => fn(createRecord(item)));
  }
}

export class DeleteIterableChanges extends DevUIIterableChanges {
  constructor(private items: VirtualComponent[]) {
    super();
  }

  forEachRemovedItem(fn: (record: IterableChangeRecord<VirtualComponent>) => void): void {
    this.items.forEach((item: VirtualComponent) => fn(createRecord(item)));
  }
}

function createRecord(item: VirtualComponent): IterableChangeRecord<VirtualComponent> {
  return { item, trackById: null, currentIndex: null, previousIndex: null };
}
