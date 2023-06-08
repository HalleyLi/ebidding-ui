import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { localUrl } from '@env/environment.prod';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as qs from 'qs';


export interface ActionResult<T> {
  code: number | string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  uri: string;

  protected constructor(public http: HttpClient, public message: NzMessageService) {
    this.uri = environment.production ? localUrl : '';
  }

  get<T>(path: string, param?: NzSafeAny): Observable<T> {
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http.get<ActionResult<T>>(path, { params }).pipe(this.resultHandle<T>());
  }

  delete<T>(path: string, param?: NzSafeAny): Observable<T> {
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http.delete<ActionResult<T>>(path, { params }).pipe(this.resultHandle<T>());
  }

  post<T>(path: string, param?: NzSafeAny): Observable<T> {
    return this.http.post<ActionResult<T>>(path, param).pipe(this.resultHandle<T>());
  }

  put<T>(path: string, param?: NzSafeAny): Observable<T> {
    return this.http.put<ActionResult<T>>(path, param).pipe(this.resultHandle<T>());
  }

  downLoadWithBlob(path: string, param?: NzSafeAny): Observable<NzSafeAny> {
    return this.http.post(path, param, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }


  resultHandle<T>(): (observable: Observable<ActionResult<T>>) => Observable<T> {
    return (observable: Observable<ActionResult<T>>) => {
      return observable.pipe(
        filter(item => {
          return this.handleFilter(item);
        }),
        map(item => {
          // if (item.code !== 0) {
          //   throw new Error(item.msg);
          // }
          return item.data;
        })
      );
    };
  }

  handleFilter<T>(item: ActionResult<T>): boolean {
    if (item?.code !== "SUCCESS") {
      this.message.error(item.message);
    } 
    return true;
  }
}
