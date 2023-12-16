export interface Point {
  x: number;
  y: number;
}

export function distanceBetweenPoints(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function rectanglePeakPoints(rect: ClientRect): Point[] {
  return [
    { x: rect.right, y: rect.top },
    { x: rect.left, y: rect.top },
    { x: rect.right, y: rect.bottom },
    { x: rect.left, y: rect.bottom }
  ];
}
