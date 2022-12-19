import {
  Component, Input, ElementRef, Output, EventEmitter,
  ChangeDetectionStrategy, SimpleChanges, OnChanges, OnDestroy, AfterViewInit, HostBinding
} from '@angular/core';

import * as echarts from 'echarts';
import {  fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'd-echarts',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'echarts'
})
export class EchartsComponent implements AfterViewInit, OnChanges, OnDestroy {
  echart: any;
  /**
   * 参考 http://echarts.baidu.com/option.html
   */
  @Input() options: any;
  /**
   * 参考 http://echarts.baidu.com/api.html#echartsInstance.setOption
   */
  @Input() notMerge: boolean;
  /**
   * 参考 http://echarts.baidu.com/api.html#echartsInstance.setOption
   */
  @Input() lazyUpdate: boolean;
  /**
   * echarts 主题
   */
  @Input() theme: string | Object = {
    color: ['#6A81ED', '#6CBFFF', '#50D4AB', '#A6DD82', '#A97AF8', '#EB77E4',
            '#8BA0FF', '#85CAFF', '#6DDEBB', '#B3E890', '#BC94FF', '#FC86B0',
            '#4861D3', '#3590CC', '#27B080', '#78B749', '#6F42C9', '#C045B9',
            '#E0E6FF', '#D1EBFF', '#CFFCEE', '#E5FFD4', '#E7D9FF', '#FBDBF9'
    ],
    textStyle: {
      color: '#5E6678'
    }
  };
  /**
   * 当Echart初始化完成后，会返回echarts实例
   */
  @Output() chartReady: EventEmitter<any> = new EventEmitter();
  @Input() width = '100%';
  @Input() height = '400px';
  @Input() autoResize = true;
  @HostBinding('style.display') display = 'inline-block';
  @HostBinding('style.width') get hostWidth() {
    return this.width;
  }
  @HostBinding('style.height') get hostHeight() {
    return this.height;
  }
  resizeSub: any;
  constructor(private elementRef: ElementRef) {
  }


  ngAfterViewInit(): void {
    this.echart = (<any>echarts).init(this.elementRef.nativeElement, this.theme);
    this.updateChartData(this.options);
    this.chartReady.emit(this.echart);
    // 根据浏览器大小变化自动调整echarts
    if (this.autoResize) {
      this.resizeSub = fromEvent(window, 'resize').pipe(
        debounceTime(100)
      ).subscribe(() => {
        this.echart.resize();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.echart && changes['options']) {
      const currentValue = changes['options'].currentValue;
      this.updateChartData(currentValue);
    }
  }

  ngOnDestroy(): void {
    if (this.echart) {
      this.echart.clear();
      this.echart.dispose();
    }

    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  updateChartData(options: any) {
    if (options) {
      this.echart.setOption(options, this.notMerge || false, this.lazyUpdate || false);
    }
  }

}
