import { KitchenApp } from '@common/public-api';

export function calcPagesNumber(app: KitchenApp): number {
  const pagesToCount = [...app.pageList];
  let pagesNumber = 0;

  while (pagesToCount.length > 0) {
    const page = pagesToCount.pop();
    pagesNumber += 1;
    pagesToCount.push(...page.pageList);
  }

  return pagesNumber;
}
