import { Settings } from '@devops-tools/utils';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { TerminalFactory } from './terminal.factory';
import * as FontFaceObserver from 'fontfaceobserver';

const fitAddon = new FitAddon();

const TERMINAL_CONFIG = {
  disableStdin: true,
  fontSize    : 14,
  enableBold  : true,
  cursorBlink : false,
  theme       : {
    cursor: 'rgb(0, 0, 0)'
  }
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector       : 'ui-terminal',
  templateUrl    : './terminal.component.html',
  encapsulation  : ViewEncapsulation.None,
  exportAs       : 'uiTerminal',
  styleUrls      : [
    'terminal.component.scss',
    '../../../../../node_modules/xterm/css/xterm.css'
  ]
})
export class TerminalComponent implements AfterViewInit, OnDestroy {
  private output = '';
  private readonly term = new ReplaySubject<Terminal>();
  private resizeObserver?: ResizeObserver;

  @ViewChild('code', { read: ElementRef, static: true })
  private readonly code: ElementRef;

  currentCols = new BehaviorSubject<number>(80);

  @Input() command: string;

  @Input()
  set outChunk(s: string) {
    if (!s) {
      return;
    }
    this.output += s;
    this.writeOutput(s);
  }

  @Input()
  set out(s: string) {
    this.output = s;
    this.writeOutput(s);
  }

  constructor(
    private readonly terminalFactory: TerminalFactory,
    private readonly settings: Settings,
    private readonly ngZone: NgZone
  ) {
    ngZone.runOutsideAngular(() => {
      // this.term.next(this.terminalFactory.new(TERMINAL_CONFIG));
      const robotoMono = new FontFaceObserver('Roboto Mono');
      robotoMono
        .load(undefined, 500)
        .then(() => {
          this.term.next(
            this.terminalFactory.new({
              ...TERMINAL_CONFIG,
              fontFamily : 'Roboto Mono',
              windowsMode: Boolean(
                this.settings.isWindows() && !this.settings.isWsl()
              )
            })
          );
        })
        .catch(() => {
          this.term.next(this.terminalFactory.new(TERMINAL_CONFIG));
        });
    });
  }

  resizeTerminalSubject = new Subject<void>();

  parentElement: HTMLElement;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.term.pipe(first()).subscribe(term => {
        term.loadAddon(fitAddon);
        term.open(this.code.nativeElement);

        this.resizeObserver = new ResizeObserver(() => {
          fitAddon.fit();
        });

        this.resizeObserver.observe(this.code.nativeElement);
      });
    });
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private writeOutput(output: string) {
    this.ngZone.runOutsideAngular(() => {
      if (!this.output || !this.code) {
        return;
      }

      this.term.pipe(first()).subscribe(term => {
        term.write(output.replace(/([^\r])\n/g, '$1\r\n'));
      });
    });
  }

  reset() {
    this.output = '';
    this.term.pipe(first()).subscribe(term => {
      term.reset();
    });
  }
}
