export const nextPageId = () => nextId();

export const nextComponentId = () => nextId();

export const nextSlotId = () => nextId();

export const nextId = () => new Date().getTime() + '' + Math.random();
