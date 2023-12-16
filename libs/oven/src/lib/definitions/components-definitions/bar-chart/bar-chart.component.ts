import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbJSThemeOptions } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SeriesBar = echarts.EChartOption.SeriesBar;

@Component({
  selector: 'oven-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'chart' },
  template: `
    <div *ngIf="hasData; else showState" echarts [options]="options"></div>

    <ng-template #showState>
      <div class="no-data-found">
        <span><nb-icon icon="bar-chart-outline"></nb-icon> No data to display</span>
      </div>
    </ng-template>
  `
})
export class BkBarChartComponent implements OnInit, OnDestroy {
  @Input() set data(data: SeriesBar) {
    this._data = data || {};
    this.updateOptions();
  }

  options: any = {};

  get hasData(): boolean {
    return this._data && this._data.data && this._data.data.length > 0;
  }

  private _data: SeriesBar = {};
  private colorConfig: any = {};
  private destroyed$: Subject<void> = new Subject();

  constructor(private theme: NbThemeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.theme
      .getJsTheme()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((config: NbJSThemeOptions) => {
        this.colorConfig = config.variables.charts;
        this.updateOptions();
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  private updateOptions() {
    this.options = {
      backgroundColor: this.colorConfig.bg,
      color: [this.colorConfig.primary],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '8%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: this.colorConfig.axisLineColor
            }
          },
          axisLabel: {
            textStyle: {
              color: this.colorConfig.textColor
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: this.colorConfig.axisLineColor
            }
          },
          splitLine: {
            lineStyle: {
              color: this.colorConfig.splitLineColor
            }
          },
          axisLabel: {
            textStyle: {
              color: this.colorConfig.textColor
            }
          }
        }
      ],
      series: this.chartDataMapper(this._data)
    };

    this.cd.markForCheck();
  }

  private chartDataMapper(data): SeriesBar {
    return { ...data, barWidth: '60%', type: 'bar' };
  }
}
