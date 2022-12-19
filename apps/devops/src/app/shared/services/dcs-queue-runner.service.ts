import { tap } from 'rxjs/operators';
import PQueue from 'p-queue';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DcsQueueRunner {
  status = 'idle';
  private queue = new PQueue({ concurrency: 5, autoStart: false });

  constructor(private http: HttpClient) {

  }

  get pending() {
    return this.queue.pending;
  }

  async updateValue(dataSources, type = 'video') {
    this.queue.clear();

    this.queue.start();
    this.status = 'running';

    await this.queue.addAll(dataSources.reduce((prev, curr) => {
      if (curr['集群名'] && curr.DCSkey) {
        prev.push(() => {
          const url = type === 'video' ? '/api/proxy-s1/queryStr' : '/api/proxy-s3/queryStr';

          return this.http.post(url, {
            clusterName: curr['集群名'],
            key        : curr.DCSkey
          }).pipe(
            tap((data: any) => {
              curr.value = data.msg || null;
            })
          ).toPromise();
        });
      }

      return prev;
    }, []));


    await this.queue.onIdle();
    this.queue.pause();
    this.status = 'completed';
    this.queue.clear();
  }


  getQueueSize() {
    return this.queue.size;
  }
}
