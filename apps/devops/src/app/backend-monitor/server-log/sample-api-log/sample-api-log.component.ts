import {
  Component,
  OnInit
} from '@angular/core';
import { WebsocketClient } from '@gradii/websocket-client';
import { environment } from '../../../../environments/environment';

@Component({
  selector   : 'dt-sample-api-log',
  templateUrl: './sample-api-log.component.html',
  styleUrls  : ['./sample-api-log.component.css']
})
export class SampleApiLogComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    // const socket = new WebSocket('ws://127.0.0.1:8200/ws');
    const ws = new WebsocketClient({ url: `${environment.wsHost}/ws/gateway` });

    ws.send('events', 'test').subscribe();
  }

}
