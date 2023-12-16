import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

const DEFAULT_PALETTES = [
  '#FF7D71',
  '#FF4141',
  '#DB303F',
  '#B7213B',
  '#FF915E',
  '#FF5E28',
  '#DB3F1D',
  '#B72514',
  '#FFAE4B',
  '#FF870F',
  '#DB680A',
  '#B74D07',
  '#FFC53F',
  '#FFAA00',
  '#DB8A00',
  '#B76D00',
  '#FFE23F',
  '#FFD500',
  '#DBB300',
  '#B79300',
  '#F3F34E',
  '#EBEB17',
  '#CACA10',
  '#A9A90B',
  '#CFE93A',
  '#B7DB00',
  '#9ABC00',
  '#7E9D00',
  '#AAE95D',
  '#84DB2B',
  '#66BC20',
  '#4C9D16',
  '#8CE96F',
  '#5BDB42',
  '#3CBC30',
  '#229D21',
  '#79E97A',
  '#4FDB5D',
  '#39BC52',
  '#279D49',
  '#3BECA0',
  '#00E096',
  '#00C093',
  '#00A18B',
  '#3AE9D4',
  '#00DBD3',
  '#00B1BC',
  '#00869D',
  '#3FDFFF',
  '#00C3FF',
  '#0097DB',
  '#0072B7',
  '#3FBAFF',
  '#0094FF',
  '#0073DB',
  '#0056B7',
  '#6690FF',
  '#3265FF',
  '#254EDB',
  '#1939B7',
  '#7D7DFF',
  '#5151FF',
  '#3B3BDB',
  '#2929B7',
  '#947DFF',
  '#6D51FF',
  '#533BDB',
  '#3B29B7',
  '#AA78FF',
  '#874CFF',
  '#6837DB',
  '#4D26B7',
  '#D871FF',
  '#C041FF',
  '#9730DB',
  '#7221B7',
  '#F975ED',
  '#F549F5',
  '#C535D2',
  '#9824B0',
  '#F96FBC',
  '#F540B7',
  '#D22EAB',
  '#B0209C',
  '#FF6D86',
  '#FF3D71',
  '#DB2C6C',
  '#B71E65'
];

@Component({
  selector: 'ub-color-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./color-palette.component.scss'],
  template: `
    <ub-color-preview
      *ngFor="let paletteColor of palette"
      size="small"
      [color]="paletteColor"
      [active]="color === paletteColor"
      [editable]="true"
      (click)="colorChange.emit(paletteColor)"
    ></ub-color-preview>
  `
})
export class ColorPaletteComponent {
  @Input() color: string;

  @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();

  palette: string[] = DEFAULT_PALETTES;
}
