// Returns unique`{oldName}{counter}`
export function getUniqueName(taken: string[], name: string): string {
  let potentialName: string = name;

  for (let i = 1; ; i++) {
    if (!taken.includes(potentialName)) {
      return potentialName;
    }

    potentialName = `${name}${i}`;
  }
}
