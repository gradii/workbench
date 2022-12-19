import { nanoid } from 'nanoid';

export const nextPageId = () => nextId();

export const nextComponentId = () => nextId();

export const nextSlotId = () => nextId();

export const nextId = () => nanoid();
