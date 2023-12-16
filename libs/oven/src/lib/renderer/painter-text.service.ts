import { Theme, ThemeFont } from '@common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NB_DOCUMENT } from '@nebular/theme';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class PainterTextService {
  private renderer: Renderer2;
  private fontLinkElement: HTMLLinkElement;
  private fontLicenceElement: HTMLElement;

  constructor(
    @Inject(NB_DOCUMENT) protected document,
    private sanitizer: DomSanitizer,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  updateVariable(varName: string, varValue: string) {
    this.document.body.style.setProperty(varName, varValue);
  }

  removeVariable(varName: string) {
    this.document.body.style.removeProperty(varName);
  }

  private setFontLinkElement(font: ThemeFont): void {
    if (this.fontLinkElement) {
      this.fontLinkElement.remove();
    }

    if (font.link) {
      this.fontLinkElement = this.renderer.createElement('link');
      this.fontLinkElement.href = font.link;
      this.fontLinkElement.rel = 'stylesheet';

      this.renderer.appendChild(this.document.head, this.fontLinkElement);
    }
  }

  private setFontLicenceElement(font: ThemeFont): void {
    if (this.fontLicenceElement) {
      this.fontLicenceElement.remove();
    }

    if (font.licence) {
      this.fontLicenceElement = this.renderer.createComment(`\n${font.licence}\n`);
      this.renderer.appendChild(this.document.head, this.fontLicenceElement);
    }
  }

  private setDefaultFont(): void {
    if (this.fontLinkElement) {
      this.fontLinkElement.remove();
    }

    if (this.fontLicenceElement) {
      this.fontLicenceElement.remove();
    }

    this.removeVariable('--font-family-primary');
    this.removeVariable('--font-family-secondary');
  }

  private getCssFontFamily(font: ThemeFont): string {
    const fontName = font.name.includes(' ') ? `"${font.name}"` : font.name;
    const fallback = font.fallback ? `, ${font.fallback}` : '';
    return `${fontName}${fallback}`;
  }

  public updateFont(theme: Theme) {
    const { font } = theme;
    this.setDefaultFont();

    if (!font) {
      return;
    }

    this.setFontLinkElement(font);
    this.setFontLicenceElement(font);

    if (font.name) {
      this.updateVariable('--font-family-primary', this.getCssFontFamily(font));
      this.updateVariable('--font-family-secondary', this.getCssFontFamily(font));
    }
  }
}
