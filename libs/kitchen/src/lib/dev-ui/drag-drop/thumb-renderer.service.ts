export class ThumbRenderer {
  private thumb: HTMLElement;

  private thumbWidth: number;
  private thumbHeight: number;

  constructor(private target: HTMLElement) {
    this.createThumb();
    this.copyCanvasesIfExist();
    this.position();

    const scale = this.calcScale();

    this.style(scale);

    // calculate size
    if (this.needScale()) {
      this.scale(scale);
    }
  }

  update(e: MouseEvent) {
    this.thumb.style.left = e.pageX - this.thumbWidth / 2 + 'px';
    this.thumb.style.top = e.pageY - this.thumbHeight / 2 + 'px';
  }

  clear() {
    this.getContainer().removeChild(this.thumb);
    this.thumb = null;
  }

  getThumbRect(): ClientRect {
    return this.thumb.getBoundingClientRect();
  }

  private createThumb() {
    this.thumb = this.target.cloneNode(true) as HTMLElement;

    // Persist thumb size to prevent relayout each time we need to update position of the thumb
    this.thumbWidth = this.target.offsetWidth + 1;
    this.thumbHeight = this.target.offsetHeight;

    this.thumb.style.height = `${this.thumbHeight}px`;
    this.thumb.style.width = `${this.thumbWidth + 1}px`;
  }

  private copyCanvasesIfExist() {
    const oldCanvasList: HTMLCanvasElement[] = Array.from(this.target.querySelectorAll('canvas'));
    const newCanvasList: HTMLCanvasElement[] = Array.from(this.thumb.querySelectorAll('canvas'));

    for (let i = 0; i < newCanvasList.length; i++) {
      const ctx = newCanvasList[i].getContext('2d');
      ctx.drawImage(oldCanvasList[i], 0, 0);
    }
  }

  private position() {
    this.thumb.style.position = 'absolute';
    this.getContainer().appendChild(this.thumb);
    this.thumb.style.zIndex = '10000';
    this.thumb.style.pointerEvents = 'none';
  }

  private calcScale() {
    const maxWidth = 150;
    const maxHeight = 150;

    const widthScale = this.thumb.offsetWidth / maxWidth;
    const heightScale = this.thumb.offsetHeight / maxHeight;

    return Math.max(widthScale, heightScale);
  }

  private scale(scale: number) {
    this.thumb.style.transform = `scale(${1 / scale})`;
  }

  private style(scale: number) {
    this.thumb.style.boxShadow = `0 ${2 * scale}px ${10 * scale}px 0 rgba(0,0,0,0.3)`;
  }

  private needScale() {
    return this.thumb.offsetWidth > 150 || this.thumb.offsetHeight > 150;
  }

  private getContainer(): HTMLElement {
    return document.querySelector('kitchen-layout > tri-layout');
  }
}
