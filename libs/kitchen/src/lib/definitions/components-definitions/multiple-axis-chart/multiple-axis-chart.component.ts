import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ɵmarkDirty } from '@angular/core';
// import { NbJSThemeOptions, NbThemeService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import SeriesLine = echarts.EChartOption.SeriesLine;

@Component({
  selector       : 'kitchen-multiple-axis-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host           : { class: 'chart' },
  template       : `
    <div *ngIf="hasData; else showState" echarts [options]="options"></div>

    <ng-template #showState>
      <div class="no-data-found">
        <span>
          <tri-icon svgIcon="workbench:bar-chart-outline"></tri-icon>
          No data to display
        </span>
      </div>
    </ng-template>
  `
})
export class BkMultipleAxisChartComponent implements OnInit, OnDestroy {
  @Input() set data(data: SeriesLine[]) {
    this._data = data ? [...data] : [];
    this.updateOptions();
  }

  options: any = {};

  get hasData(): boolean {
    return this._data && this._data[0] && this._data[0].data && this._data[0].data.length > 0;
  }

  private _data: SeriesLine[]       = [];
  private colorConfig: any          = {};
  private destroyed$: Subject<void> = new Subject();

  constructor(/*private theme: NbThemeService*/) {
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
      color          : [this.colorConfig.danger, this.colorConfig.primary, this.colorConfig.info],
      tooltip        : {
        trigger    : 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend         : {
        textStyle: {
          color: this.colorConfig.textColor
        }
      },
      grid           : {
        left        : 10,
        right       : 10,
        bottom      : '4%',
        containLabel: true
      },
      xAxis          : [
        {
          type     : 'category',
          axisTick : {
            alignWithLabel: true
          },
          axisLine : {
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
      yAxis          : [
        {
          axisLine : {
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
      series         : this.chartDataMapper(this._data)
    };

    ɵmarkDirty(this);
  }

  private chartDataMapper(data: SeriesLine[]): SeriesLine[] {
    return data.map(item => ({
      type  : 'line',
      smooth: true,
      ...item
    }));
  }
}
