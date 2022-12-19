import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IconRegistry } from '@gradii/triangle/icon';
import { Subject } from 'rxjs';

@Component({
  selector       : 'pf-icon-editor-field-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./field.scss'],
  template       : `
    <label class="settings-field-label">Icon</label>
    <tri-combobox
      [ngModel]="icon"
      [showSearch]="true"
      (ngModelChange)="select($event)"
    >
      <tri-combobox-option
        *ngFor="let option of searchOptions"
        [value]="option.resultValue">
        {{option.displayValue}}
      </tri-combobox-option>
    </tri-combobox>
    <!--    <bc-input-icon [icon]="icon" [showIcon]="true" [disabled]="disabled">-->
    <!--      <input-->
    <!--        triInput-->
    <!--        fullWidth-->
    <!--        bcInputSearch-->
    <!--        #searchInstance="bcInputSearch"-->
    <!--        [ubOverlayRegister]="searchInstance"-->
    <!--        [disabled]="disabled"-->
    <!--        (selectValue)="select($event)"-->
    <!--        [searchOptions]="searchOptions"-->
    <!--        [ngModel]="icon"-->
    <!--        (ngModelChange)="update($event)"-->
    <!--      />-->
    <!--    </bc-input-icon>-->
  `
})
export class IconSettingsFieldComponent implements OnInit, OnDestroy {
  @Input() disabled                          = false;
  @Input() icon: string;
  @Output() iconChange: EventEmitter<string> = new EventEmitter<string>();

  searchOptions: any[] = [];

  private destroyed$ = new Subject<void>();

  private icons: string[] = [];

  constructor(iconRegistry: IconRegistry) {
    // @ts-ignore
    iconRegistry._iconSetConfigs.forEach((val, key) => {
      for (const it of val) {
        if (it.svgElement) {
          this._handleSvgConfig(key, it);
        }
      }
    });

    // @ts-ignore
    iconRegistry._svgIconConfigs.forEach((val, key) => {
      if (val.svgElement) {
        this._handleSvgConfig(key, val);
      }
    });
  }

  _handleSvgConfig(key: string, config: any) {
    const list = config.svgElement.querySelectorAll('[id]');
    list.forEach((it: HTMLElement) => {
      const name = it.getAttribute('id');
      if (name) {
        this.icons.push(`${key}:${name}`);
      }
    });
  }

  ngOnInit() {
    this.icons.forEach((iconName: string) => {
      this.searchOptions.push({
        displayValue: iconName,
        resultValue: iconName,
        filterValues: [iconName],
        icon        : iconName
      });
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  update(icon: string) {
    if (this.icons.includes(icon)) {
      this.iconChange.emit(icon);
    }
  }

  select(option: string) {
    this.iconChange.emit(option);
  }
}

export const evaIconsTags = {
  activity                   : ['pulse', 'health', 'action', 'motion'],
  'alert-circle'             : ['warning'],
  'alert-triangle'           : ['warning'],
  archive                    : ['document', 'file'],
  'arrow-circle-down'        : [],
  'arrow-circle-up'          : [],
  'arrow-circle-left'        : [],
  'arrow-circle-right'       : [],
  'arrow-down'               : [],
  'arrow-up'                 : [],
  'arrow-left'               : [],
  'arrow-right'              : [],
  'arrow-downward'           : [],
  'arrow-upward'             : [],
  'arrow-back'               : [],
  'arrow-forward'            : [],
  'arrow-ios-downward'       : [],
  'arrow-ios-upward'         : [],
  'arrow-ios-back'           : [],
  'arrow-ios-forward'        : [],
  'arrowhead-down'           : [],
  'arrowhead-up'             : [],
  'arrowhead-left'           : [],
  'arrowhead-right'          : [],
  at                         : ['mention'],
  'attach-2'                 : ['paperclip, attachment'],
  attach                     : ['paperclip, attachment'],
  award                      : ['achievement', 'badge'],
  backspace                  : ['cross'],
  'bar-chart-2'              : [],
  'bar-chart'                : [],
  battery                    : [],
  'bell-off'                 : ['alarm', 'notification', 'silent'],
  bell                       : ['alarm', 'notification'],
  bluetooth                  : ['wireless'],
  'book-open'                : ['read'],
  book                       : ['read', 'dictionary', 'booklet', 'magazine'],
  bookmark                   : ['read', 'clip', 'marker', 'tag'],
  briefcase                  : ['work', 'bag', 'baggage', 'folder'],
  browser                    : ['web'],
  brush                      : ['art'],
  bulb                       : ['lamp', 'light'],
  calendar                   : [],
  camera                     : ['photo'],
  car                        : ['machine', 'truck', 'auto'],
  cast                       : [],
  charging                   : [],
  'checkmark-circle-2'       : [],
  'checkmark-circle'         : [],
  'checkmark-square-2'       : [],
  'checkmark-square'         : [],
  checkmark                  : [],
  'chevron-down'             : ['arrow'],
  'chevron-left'             : ['arrow'],
  'chevron-right'            : ['arrow'],
  'chevron-up'               : ['arrow'],
  clipboard                  : ['copy'],
  clock                      : ['time', 'watch', 'alarm'],
  'close-circle'             : ['cross'],
  'close-square'             : ['cross'],
  close                      : ['cross'],
  'cloud-download'           : ['arrow'],
  'cloud-upload'             : ['arrow'],
  'code-download'            : ['chevron', 'arrow'],
  code                       : ['chevron', 'arrow'],
  collapse                   : ['arrow'],
  'color-palette'            : ['art'],
  'color-picker'             : ['art'],
  compass                    : ['navigation', 'safari', 'travel'],
  copy                       : ['clone', 'duplicate'],
  'corner-down-left'         : ['arrow'],
  'corner-down-right'        : ['arrow'],
  'corner-left-down'         : ['arrow'],
  'corner-left-up'           : ['arrow'],
  'corner-right-down'        : ['arrow'],
  'corner-right-up'          : ['arrow'],
  'corner-up-left'           : ['arrow'],
  'corner-up-right'          : ['arrow'],
  'credit-card'              : ['purchase', 'payment', 'cc'],
  crop                       : ['photo', 'image'],
  cube                       : ['figure'],
  'diagonal-arrow-left-down' : [],
  'diagonal-arrow-left-up'   : [],
  'diagonal-arrow-right-down': [],
  'diagonal-arrow-right-up'  : [],
  'done-all'                 : ['checkmark'],
  download                   : ['arrow'],
  'droplet-off'              : ['water'],
  droplet                    : ['water'],
  'edit-2'                   : ['pencil', 'change'],
  edit                       : ['pencil', 'change'],
  email                      : ['letter'],
  expand                     : ['arrows'],
  'external-link'            : ['arrow'],
  'eye-off-2'                : ['view', 'watch'],
  'eye-off'                  : ['view', 'watch'],
  eye                        : ['view', 'watch'],
  facebook                   : ['logo'],
  'file-add'                 : [],
  'file-remove'              : [],
  'file-text'                : [],
  file                       : [],
  film                       : ['movie', 'video'],
  flag                       : [],
  'flash-off'                : [],
  flash                      : ['electricity'],
  'folder-add'               : ['directory'],
  'folder-remove'            : ['directory'],
  folder                     : ['directory'],
  funnel                     : ['filter'],
  gift                       : ['present', 'box', 'birthday', 'party'],
  github                     : ['logo'],
  'globe-2'                  : ['world', 'browser', 'language', 'translate'],
  'globe-3'                  : ['world', 'browser', 'language', 'translate'],
  globe                      : ['world', 'browser', 'language', 'translate'],
  google                     : ['world', 'browser', 'language', 'translate', 'logo'],
  grid                       : [],
  'hard-drive'               : ['computer', 'server'],
  hash                       : ['hashtag', 'number', 'pound'],
  headphones                 : ['music', 'audio'],
  heart                      : ['like', 'love'],
  home                       : ['house'],
  'image-2'                  : ['picture'],
  image                      : ['picture'],
  inbox                      : ['email', 'letter'],
  info                       : [],
  keypad                     : [],
  layers                     : [],
  layout                     : [],
  'link-2'                   : [],
  link                       : [],
  linkedin                   : ['logo', 'social'],
  list                       : [],
  lock                       : [],
  'log-in'                   : ['sign in', 'arrow'],
  'log-out'                  : ['sign out', 'arrow'],
  loader                     : [],
  map                        : ['location', 'navigation', 'travel'],
  maximize                   : ['fullscreen'],
  'menu-2'                   : ['bars', 'navigation', 'hamburger'],
  'menu-arrow'               : ['bars', 'navigation', 'hamburger'],
  menu                       : ['bars', 'navigation', 'hamburger'],
  'message-circle'           : ['comment', 'chat'],
  'message-square'           : ['comment', 'chat'],
  'mic-off'                  : ['record'],
  mic                        : ['record'],
  minimize                   : ['exit fullscreen'],
  'minus-circle'             : [],
  'minus-square'             : [],
  minus                      : [],
  monitor                    : ['tv'],
  moon                       : ['dark', 'night'],
  'more-horizontal'          : ['ellipsis'],
  'more-vertical'            : ['ellipsis'],
  move                       : ['arrows'],
  music                      : ['melody', 'song'],
  'navigation-2'             : ['location', 'travel'],
  navigation                 : ['location', 'travel'],
  npm                        : ['logo'],
  'options-2'                : [],
  options                    : [],
  pantone                    : ['color'],
  'paper-plane'              : ['flight'],
  'pause-circle'             : ['music', 'stop'],
  people                     : ['person', 'user'],
  percent                    : [],
  'person-add'               : ['user'],
  'person-delete'            : ['user'],
  'person-done'              : ['user'],
  'person-remove'            : ['user'],
  person                     : ['user'],
  'phone-call'               : [],
  'phone-missed'             : [],
  'phone-off'                : [],
  phone                      : [],
  'pie-chart-2'              : [],
  'pie-chart'                : [],
  pin                        : ['mark'],
  'play-circle'              : ['music', 'start'],
  'plus-circle'              : ['add', 'new'],
  'plus-square'              : ['add', 'new'],
  plus                       : ['add', 'new'],
  power                      : ['on', 'off'],
  pricetags                  : ['commerce'],
  printer                    : [],
  'question-mark-circle'     : ['help'],
  'question-mark'            : ['help'],
  'radio-button-off'         : ['signal'],
  'radio-button-on'          : ['signal'],
  radio                      : ['signal'],
  recording                  : [],
  refresh                    : [],
  repeat                     : ['music'],
  'rewind-left'              : ['music'],
  'rewind-right'             : ['music'],
  save                       : ['floppy disk'],
  scissors                   : ['tool'],
  search                     : ['magnifier'],
  'settings-2'               : ['cog', 'edit', 'gear', 'preferences'],
  settings                   : ['cog', 'edit', 'gear', 'preferences'],
  share                      : [],
  'shield-off'               : ['security'],
  shield                     : ['security'],
  'shopping-bag'             : ['ecommerce', 'cart', 'purchase', 'store'],
  'shopping-cart'            : ['ecommerce', 'cart', 'purchase', 'store'],
  'shuffle-2'                : ['music'],
  shuffle                    : ['music'],
  'skip-back'                : ['music'],
  'skip-forward'             : ['music'],
  slash                      : ['ban', 'no'],
  smartphone                 : ['mobile'],
  'smiling-face'             : ['smiling', 'face', 'stickers', 'memes'],
  speaker                    : ['music'],
  square                     : ['figure'],
  star                       : ['bookmark', 'favorite', 'like'],
  'stop-circle'              : [],
  sun                        : ['brightness', 'weather', 'light'],
  swap                       : ['arrow'],
  sync                       : ['arrow'],
  text                       : [],
  'thermometer-minus'        : ['temperature'],
  'thermometer-plus'         : ['temperature'],
  thermometer                : ['temperature'],
  'toggle-left'              : ['on', 'off', 'switch'],
  'toggle-right'             : ['on', 'off', 'switch'],
  'trash-2'                  : ['garbage', 'delete', 'remove'],
  trash                      : ['garbage', 'delete', 'remove'],
  'trending-down'            : ['arrow'],
  'trending-up'              : ['arrow'],
  tv                         : ['monitor'],
  twitter                    : ['logo'],
  umbrella                   : ['rain', 'weather'],
  undo                       : ['arrow'],
  unlock                     : [],
  upload                     : ['arrow'],
  'video-off'                : ['camera', 'movie', 'film'],
  video                      : ['camera', 'movie', 'film'],
  'volume-down'              : ['music', 'sound', 'mute'],
  'volume-mute'              : ['music', 'sound', 'mute'],
  'volume-off'               : ['music', 'sound', 'mute'],
  'volume-up'                : ['music', 'sound', 'mute'],
  'wifi-off'                 : ['internet', 'connection'],
  wifi                       : ['internet', 'connection']
};