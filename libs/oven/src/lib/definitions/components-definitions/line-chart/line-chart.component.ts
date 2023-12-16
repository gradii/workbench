import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbJSThemeOptions } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SeriesLine = echarts.EChartOption.SeriesLine;

@Component({
  selector: 'oven-line-chart',
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
export class BkLineChartComponent implements OnInit, OnDestroy {
  @Input() set data(data: SeriesLine) {
    this._data = data || {};
    this.updateOptions();
  }

  options: any = {};

  get hasData(): boolean {
    return this._data && this._data.data && this._data.data.length > 0;
  }

  private _data: SeriesLine = {};
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
      color: [this.colorConfig.danger, this.colorConfig.primary, this.colorConfig.info],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
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
      grid: {
        top: '8%',
        left: 10,
        right: 10,
        bottom: '4%',
        containLabel: true
      },
      series: this.chartDataMapper(this._data)
    };

    this.cd.markForCheck();
  }

  private chartDataMapper(data): SeriesLine {
    return { ...data, type: 'line' };
  }
}
