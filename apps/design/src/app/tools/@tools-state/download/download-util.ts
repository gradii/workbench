import { OvenApp } from '@common';

export function calcPagesNumber(app: OvenApp): number {
  const pagesToCount = [...app.pageList];
  let pagesNumber = 0;

  while (pagesToCount.length > 0) {
    const page = pagesToCount.pop();
    pagesNumber += 1;
    pagesToCount.push(...page.pageList);
  }

  return pagesNumber;
}
