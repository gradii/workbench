import { ChangeDetectionStrategy, ɵmarkDirty, Component, Input, OnDestroy, OnInit } from '@angular/core';
// import { NbThemeService, NbJSThemeOptions } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SeriesBar = echarts.EChartOption.SeriesBar;

@Component({
  selector: 'kitchen-multiple-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'chart' },
  template: `
    <div *ngIf="hasData; else showState" echarts [options]="options"></div>

    <ng-template #showState>
      <div class="no-data-found">
        <span>
          <tri-icon svgIcon="eva-outline:bar-chart-outline"></tri-icon> No data to display
        </span>
      </div>
    </ng-template>
  `
})
export class BkMultipleBarChartComponent implements OnInit, OnDestroy {
  @Input() set data(data: SeriesBar[]) {
    this._data = data ? [...data] : [];
    this.updateOptions();
  }

  options: any = {};

  get hasData(): boolean {
    return this._data && this._data[0] && this._data[0].data && this._data[0].data.length > 0;
  }

  private _data: SeriesBar[] = [];
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
      color: [this.colorConfig.danger, this.colorConfig.primary, this.colorConfig.info],
      legend: {
        textStyle: {
          color: this.colorConfig.textColor
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '20%',
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

    ɵmarkDirty(this);
  }

  private chartDataMapper(data: SeriesBar[]): SeriesBar[] {
    return data.map(item => ({
      type: 'bar',
      ...item
    }));
  }
}
