import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

import { Rgba, Hsva } from './formats';
import { SliderPosition, SliderDimension } from './color-slider.directive';
import { ColorPickerService } from './color-picker.service';

@Component({
  selector: 'ub-color-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Input() set color(color: string) {
    if (color !== this.hexText) {
      this.setColorFromString(color, false);
    }
  }

  @Output() colorChange = new EventEmitter();

  slider: SliderPosition;
  hexText: string;
  hText: number;
  sText: number;
  vText: number;
  rgbaText: Rgba;
  selectedColor: string;
  hueSliderColor: string;

  @Input() hueWidth = 224;
  @Input() areaWidth = 296;
  @Input() areaHeight = 232;

  @Input() @HostBinding('class.disabled') loading = false;

  hueCursorWidth = 8;
  slCursorWidth = 12;

  private hsva: Hsva;
  private sliderDimMax: SliderDimension;

  constructor(private service: ColorPickerService) {
  }

  ngOnInit() {
    this.slider = new SliderPosition(0, 0, 0);
    this.sliderDimMax = new SliderDimension(this.hueWidth - this.hueCursorWidth, this.areaWidth, this.areaHeight);
    this.setColorFromString(this.service.outputFormat(this.hsva, 'hex'), false);
  }

  public setColorFromString(value: string, emit: boolean = true) {
    let hsva: Hsva | null;
    hsva = this.service.stringToHsva(value, false);
    if (hsva) {
      this.hsva = hsva;
      this.updateColorPicker(emit);
    }
  }

  public onSaturationChange(value: { s: number; v: number; rgX: number; rgY: number }) {
    this.hsva.s = value.s / value.rgX;
    this.hsva.v = value.v / value.rgY;
    this.updateColorPicker();
  }

  public onHueChange(value: { v: number; rgX: number }) {
    this.hsva.h = value.v / value.rgX;
    this.updateColorPicker();
  }

  private updateColorPicker(emit: boolean = true) {
    if (this.loading) {
      return;
    }
    if (this.sliderDimMax) {
      const rgba = ColorPickerService.denormalizeRGBA(this.service.hsvaToRgba(this.hsva));
      const selectedRGB = this.service.outputFormat(this.hsva, 'rgb');
      const hueRGB = this.service.outputFormat(new Hsva(this.hsva.h, 1, 1, 1), 'rgb');

      this.rgbaText = new Rgba(rgba.r, rgba.g, rgba.b);
      this.hexText = this.service.rgbaToHex(rgba);
      this.hText = Math.round(this.hsva.h * 360);
      this.sText = Math.round(this.hsva.s * 100);
      this.vText = Math.round(this.hsva.v * 100);

      this.hueSliderColor = hueRGB;
      this.selectedColor = selectedRGB;

      if (emit) {
        this.colorChange.emit(this.hexText);
      }
      this.slider = new SliderPosition(
        this.hsva.h * this.sliderDimMax.h,
        this.hsva.s * this.sliderDimMax.s - this.slCursorWidth / 2,
        (1 - this.hsva.v) * this.sliderDimMax.v - this.slCursorWidth / 2
      );
    }
  }
}
