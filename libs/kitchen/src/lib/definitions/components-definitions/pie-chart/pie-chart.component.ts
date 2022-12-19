import { ChangeDetectionStrategy, ɵmarkDirty, Component, Input, OnDestroy, OnInit } from '@angular/core';
// import { NbThemeService, NbJSThemeOptions } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SeriesPie = echarts.EChartOption.SeriesPie;

// Options to be set on width > `responsiveConfig.[clientWidth]`
const defaultOptions = {
  series: [
    {
      itemStyle: {
        normal: {
          label: { show: true },
          labelLine: { show: true }
        }
      },
      emphasis: {
        label: { show: true },
        labelLine: { show: true }
      },
      center: ['50%', '50%']
    }
  ],
  legend: {
    show: true,
    orient: 'vertical',
    left: 'left'
  }
};

// Options to be set on width < `responsiveConfig.[clientWidth]`
const customOptions = {
  series: [
    {
      itemStyle: {
        normal: {
          label: { show: false },
          labelLine: { show: false }
        }
      },
      emphasis: {
        label: { show: false },
        labelLine: { show: false }
      },
      center: ['50%', '45%']
    }
  ],
  legend: {
    show: true,
    orient: 'horizontal',
    left: 'center',
    bottom: 10
  }
};

@Component({
  selector: 'kitchen-pie-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'chart pie-chart' },
  template: `
    <div *ngIf="hasData; else showState" echarts [options]="options"></div>

    <ng-template #showState>
      <div class="no-data-found">
        <span><tri-icon svgIcon="eva-outline:pie-chart-outline"></tri-icon> No data to display</span>
      </div>
    </ng-template>
  `
})
export class BkPieChartComponent implements OnInit, OnDestroy {
  @Input() set data(data: SeriesPie) {
    this._data = data || {};
    this.updateOptions();
  }

  options: any = {};

  get hasData(): boolean {
    return this._data && this._data.data && this._data.data.length > 0;
  }

  private _data: SeriesPie = {};
  private colorConfig: any = {};
  private destroyed$: Subject<void> = new Subject();

  constructor(/*private theme: NbThemeService,*/ ) {
  }

  ngOnInit() {
    // this.theme
    //   .getJsTheme()
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe((config: NbJSThemeOptions) => {
    //     this.colorConfig = config.variables.charts;
    //     this.updateOptions();
    //   });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  private updateOptions() {
    this.options = {
      backgroundColor: this.colorConfig.bg,
      color: [
        this.colorConfig.warning,
        this.colorConfig.info,
        this.colorConfig.danger,
        this.colorConfig.success,
        this.colorConfig.primary
      ],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        show: false,
        textStyle: {
          color: this.colorConfig.textColor
        }
      },
      series: [this.chartDataMapper(this._data)],
      responsiveConfig: {
        500: customOptions,
        default: defaultOptions
      }
    };

    ɵmarkDirty(this);
  }

  private chartDataMapper(data): SeriesPie {
    return {
      avoidLabelOverlap: true,
      name: this._data.name,
      type: 'pie',
      radius: '80%',
      center: ['50%', '50%'],
      itemStyle: {
        normal: {
          label: { show: false },
          labelLine: { show: false }
        },
        emphasis: {
          label: { show: false },
          labelLine: { show: false },
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: this.colorConfig.itemHoverShadowColor
        }
      },
      label: {
        normal: {
          label: { show: false },
          labelLine: { show: false },
          textStyle: {
            color: this.colorConfig.textColor
          }
        }
      },
      labelLine: {
        normal: {
          label: { show: false },
          labelLine: { show: false },
          lineStyle: {
            color: this.colorConfig.axisLineColor
          }
        }
      },

      ...data
    };
  }
}
