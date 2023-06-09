import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseHttpService } from '@app/core/services/base-http.service';
import { ListResponseData, SearchParam } from '@app/models';
import { BWICBidItem, BWICItem, BwicCancelParams, BwicSubmitParams } from '@app/models/bwic/bwic';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalesPortalService {
  constructor(
    public http: BaseHttpService,
    public httpClient: HttpClient
  ) {}

  public getAllBwicsBids(params: SearchParam): Observable<ListResponseData<BWICBidItem>> {
    return this.http.get<ListResponseData<BWICBidItem>>('/api/v1/bwic/bwic-bid-details', params);
  }
  public submitBwic(params: BwicSubmitParams): Observable<BWICItem> {
    return this.http.post('/api/v1/bwic/create', params);
  }
  public cancleBwic(params: BwicCancelParams): Observable<BWICItem> {
    return this.http.post('/api/v1/bwic/delete', params);
  }


}
