import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbJSThemeOptions, NbThemeService } from '@nebular/theme';
import { registerMap } from 'echarts';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface MapData {
  name: string;
  color?: string;
  value: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'oven-bubble-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'chart' },
  template: ` <div echarts [options]="options"></div> `
})
export class BkBubbleMapComponent implements OnInit, OnDestroy {
  @Input() set data(data: MapData[]) {
    this._data = data ? [...data] : [];

    // avoid showing map without colors
    if (this.initialized) {
      this.updateOptions();
    }
  }

  options: any = {};

  private _data: MapData[] = [];

  private colorConfig: any = {};
  private geoColors: any[] = [];
  private max = -Infinity;
  private initialized: boolean;
  private currentTheme: NbJSThemeOptions;

  private destroyed$: Subject<void> = new Subject();

  constructor(private theme: NbThemeService, private http: HttpClient, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    combineLatest([this.http.get('assets/map/world.json'), this.theme.getJsTheme()])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([map, config]: [any, NbJSThemeOptions]) => {
        registerMap('world', map);
        this.initColors(config);
        this.updateOptions();

        this.initialized = true;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  private initColors(config: NbJSThemeOptions) {
    this.currentTheme = config;
    this.colorConfig = config.variables.bubbleMap;

    this.geoColors = [
      this.colorConfig.primary,
      this.colorConfig.info,
      this.colorConfig.success,
      this.colorConfig.warning,
      this.colorConfig.danger
    ];
  }

  private updateOptions() {
    this.max = -Infinity;
    this._data.forEach(item => {
      if (item.value > this.max) {
        this.max = item.value;
      }
    });

    this.options = {
      title: {
        text: 'World Population (2011)',
        left: 'center',
        top: 'top',
        textStyle: {
          color: this.colorConfig.titleColor
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: params => {
          return params.name + ': ' + params.value[2];
        }
      },
      visualMap: {
        show: false,
        min: 0,
        max: this.max,
        inRange: {
          symbolSize: [6, 60]
        }
      },
      geo: {
        name: 'World Population (2010)',
        type: 'map',
        map: 'world',
        roam: true,
        label: {
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            areaColor: this.colorConfig.areaColor,
            borderColor: this.colorConfig.areaBorderColor
          },
          emphasis: {
            areaColor: this.colorConfig.areaHoverColor
          }
        },
        zoom: 1.1
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: this.mapDataMapper(this._data)
        }
      ]
    };

    this.cd.markForCheck();
  }

  private mapDataMapper(data: MapData[]): any[] {
    return data.map(item => {
      return {
        name: item.name,
        value: [item.longitude, item.latitude, item.value],
        itemStyle: {
          normal: {
            color: item.color || this.getRandomGeoColor()
          }
        }
      };
    });
  }

  private getRandomGeoColor() {
    const index = Math.round(Math.random() * this.geoColors.length);
    return this.geoColors[index];
  }
}
