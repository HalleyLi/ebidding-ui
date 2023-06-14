import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntTableComponent, AntTableConfig, SortFile } from '@app/shared/components/ant-table/ant-table.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { finalize } from 'rxjs';
import { SalesPortalService } from '@app/core/services/sales-portal.service';
import { ListResponseData } from '@app/models';
import { BWICBidItem, BWICItem, BwicSubmitParams } from '@app/models/bwic/bwic';
import { BwicModalService } from './bwic-modal/bwic-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalBtnStatus } from '@app/widget/base-modal';

export interface SearchParam {
  offset: number;
  limit: number;
  startDate: Date;
  endDate: Date;
  date: any;
}

@Component({
  standalone: true,
  imports: [
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NgIf,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    AntTableComponent,
    NzBadgeModule,
    NzDatePickerModule,
  ],
  templateUrl: './bwic-admin.component.html',
})
export class BwicAdminComponent implements OnInit {
  @ViewChild('highLightTpl', { static: true }) highLightTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  searchParam: Partial<SearchParam> = {};
  dataList: NzSafeAny[] = [];
  destroyRef = inject(DestroyRef);

  constructor(
    private modalSrv: NzModalService,
    private modalService: BwicModalService,
    public message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private salesService: SalesPortalService
  ) {}

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;

    this.tableConfig.loading = true;
    let params: SearchParam = {} as SearchParam;
    if (this.searchParam?.date) {
      params = {
        startDate: this.searchParam.date[0],
        endDate: this.searchParam.date[1],
      } as SearchParam;
    }
    this.salesService
      .getAllBwicsBids(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((data: ListResponseData<BWICBidItem>) => {
        if (data) {
          const { rows, totalElements, totalPages } = data;
          if (rows) {
            // format BWIC List
            let bwicList: BWICItem[] = [];
            rows.forEach((bwicBid) => {
              if (bwicBid) {
                const bwicItem: BWICItem = {
                  ...bwicBid.bwicDto,
                  top1:
                    bwicBid.bids && bwicBid.bids[0]
                      ? { price: bwicBid.bids[0].price, clientId: bwicBid.bids[0].clientId }
                      : { price: null, clientId: null },
                  top2:
                    bwicBid.bids && bwicBid.bids[1]
                      ? { price: bwicBid.bids[1].price, clientId: bwicBid.bids[0].clientId }
                      : { price: null, clientId: null },
                };
                bwicList.push(bwicItem);
              }
            });
            this.dataList = [...bwicList];
            this.tableConfig.total = totalElements!;
            this.tableConfig.pageIndex = totalPages!; // TODO check
          }
        }

        this.tableLoading(false);
      });
  }

  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(): void {
    this.modalService
      .show({ nzTitle: 'Add' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        res => {
          if (!res || res.status === ModalBtnStatus.Cancel) {
            return;
          }
          this.tableLoading(true);
          this.addData(res.modalValue);
        },
        error => this.tableLoading(false)
      );
  }

  addData(param:BwicSubmitParams): void {
    this.salesService.submitBwic(param)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.getDataList();
      });
  }

  // 修改
  edit(id: number): void {
    // this.dataService.getFireSysDetail(id).subscribe(res => {
    //   this.modalService.show({nzTitle: '编辑'}, res).subscribe(({modalValue, status}) => {
    //     if (status === ModalBtnStatus.Cancel) {
    //       return;
    //     }
    //     modalValue.id = id;
    //     this.tableLoading(true);
    //     this.addEditData(modalValue, 'editFireSys');
    //   }, error => this.tableLoading(false));
    // });
  }


  del(id: number): void {
    this.modalSrv.confirm({
      nzTitle: 'Are you sure to cancel',
      nzContent: 'It can not be recovered after cancel',
      nzOnOk: () => {
        this.tableLoading(true);
        /*注释的是模拟接口调用*/
        // this.dataService.delFireSys([id]).subscribe(() => {
        //   if (this.dataList.length === 1) {
        //     this.tableConfig.pageIndex--;
        //   }
        //   this.getDataList();
        //   this.checkedCashArray.splice(this.checkedCashArray.findIndex(item => item.id === id), 1);
        // }, error => this.tableLoading(false));

        setTimeout(() => {
          this.getDataList();
          this.tableLoading(false);
        }, 3000);
      },
    });
  }

  changeSort(e: SortFile): void {
    this.message.info(`排序字段：${e.fileName},排序为:${e.sortDir}`);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Bond Cusip',
          width: 100,
          field: 'cusip',
        },
        {
          title: 'Issuer',
          width: 130,
          field: 'issuer',
          showSort: true,
        },
        {
          title: 'Bond Owner',
          width: 100,
          field: 'clientId',
          notNeedEllipsis: true,
          showSort: true,
        },
        {
          title: 'Due Date',
          width: 100,
          field: 'dueDate',
        },
        {
          title: 'Size',
          field: 'size',
          width: 100,
        },
        {
          title: 'Top 1 Price',
          width: 50,
          field: 'top1.price',
        },
        {
          title: 'Top 1 Client',
          width: 50,
          field: 'top1.client',
        },
        {
          title: 'Top 2 Price',
          width: 50,
          field: 'top2.price',
        },
        {
          title: 'Top 2 Client',
          width: 50,
          field: 'top2.client',
        },
        {
          title: 'Operate',
          tdTemplate: this.operationTpl,
          width: 120,
          fixed: true,
          fixedDir: 'right',
        },
      ],
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }

  ngOnInit(): void {
    this.initTable();
  }
}
