import { NgIf, NgFor, NgClass, NgTemplateOutlet } from '@angular/common';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { MapPipe } from '@app/shared/map.pipe';
import { TableFiledPipe } from '@app/shared/table-filed.pipe';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzResizeEvent, NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTableQueryParams, NzTableSize, NzTableModule } from 'ng-zorro-antd/table';

export interface TableHeader {
  title: string; 
  field?: string; 
  pipe?: string; 
  showSort?: boolean; 
  sortDir?: undefined | 'asc' | 'desc'; 
  width?: number; 
  thTemplate?: TemplateRef<NzSafeAny>; 
  tdTemplate?: TemplateRef<NzSafeAny>; 
  fixed?: boolean; 
  fixedDir?: 'left' | 'right'; 
  notNeedEllipsis?: boolean; 
  tdClassList?: string[]; 
  thClassList?: string[]; 
  show?: boolean; 
  tdClassFn?: (data: any, index: number) => string[];
  thClassFn?: (data: any) => string[];
}

export interface AntTableConfig {
  needNoScroll?: boolean; 
  xScroll?: number; 
  yScroll?: number; 
  virtualItemSize?: number; 
  showCheckbox?: boolean; 
  pageIndex: number; 
  pageSize: number; 
  total: number; 
  loading: boolean; 
  headers: TableHeader[]; 
}

export abstract class AntTableComponentToken {
  tableSize!: NzTableSize;
  tableConfig!: AntTableConfig;

  abstract tableChangeDectction(): void;
}

export interface SortFile {
  fileName: string;
  sortDir: undefined | 'desc' | 'asc';
}

@Component({
  selector: 'app-ant-table',
  templateUrl: './ant-table.component.html',
  styleUrls: ['./ant-table.component.less'],
  providers: [{ provide: AntTableComponentToken, useExisting: AntTableComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzTableModule, NgIf, NgFor, NzResizableModule, NgClass, NgTemplateOutlet, MapPipe, TableFiledPipe]
})
export class AntTableComponent implements OnInit, OnChanges {
  _dataList!: NzSafeAny[];
  _tableConfig!: AntTableConfig;
  _scrollConfig: { x: string; y: string } | {} = {};

  @Input()
  set tableData(value: NzSafeAny[]) {
    this._dataList = value;
    if (this.tableConfig.showCheckbox) {
      this._dataList.forEach(item => {
        item['_checked'] = false;
      });
    }
  }

  get tableData(): NzSafeAny[] {
    return this._dataList;
  }

  _tableSize: NzTableSize = 'default';
  set tableSize(value: NzTableSize) {
    this._tableSize = value;
    this.tableChangeDectction();
  }

  get tableSize(): NzTableSize {
    return this._tableSize;
  }

  @Input()
  set tableConfig(value: AntTableConfig) {
    this._tableConfig = value;
    this.setScrollConfig(value);
  }

  get tableConfig(): AntTableConfig {
    return this._tableConfig;
  }

  @Output() readonly changePageNum = new EventEmitter<NzTableQueryParams>();
  @Output() readonly changePageSize = new EventEmitter<number>();
  @Output() readonly sortFn: EventEmitter<SortFile> = new EventEmitter<SortFile>();
  indeterminate: boolean = false;
  allChecked: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  setScrollConfig(value: AntTableConfig): void {
    if (value && !value.needNoScroll) {
      // 默认x：100
      this._scrollConfig = { x: '100px' };
      let tempX = {};
      if (value.xScroll !== undefined) {
        tempX = { x: `${value.xScroll}px` };
      }
      let tempY = {};
      if (value.yScroll !== undefined) {
        tempY = { y: `${value.yScroll}px` };
      }
      this._scrollConfig = { ...this._scrollConfig, ...tempX, ...tempY };
    } else {
      this._scrollConfig = {};
    }
  }

  changeSort(tableHeader: TableHeader): void {
    this.tableConfig.headers.forEach(item => {
      if (item.field !== tableHeader.field) {
        item.sortDir = undefined;
      }
    });
    const sortDicArray: [undefined, 'asc', 'desc'] = [undefined, 'asc', 'desc'];
    const index = sortDicArray.findIndex(item => item === tableHeader.sortDir);
    tableHeader.sortDir = index === sortDicArray.length - 1 ? sortDicArray[0] : sortDicArray[index + 1];
    this.sortFn.emit({ fileName: tableHeader.field!, sortDir: tableHeader.sortDir });
  }

  tableChangeDectction(): void {
    // 改变引用触发变更检测。
    this._dataList = [...this._dataList];
    this.cdr.markForCheck();
  }

  trackById(_: number, data: { id: number }): number {
    return data.id;
  }

  public trackByTableHead(index: number, item: NzSafeAny): NzSafeAny {
    return item;
  }

  public trackByTableBody(index: number, item: NzSafeAny): NzSafeAny {
    return item;
  }

  onQueryParamsChange(tableQueryParams: NzTableQueryParams): void {
    this.changePageNum.emit(tableQueryParams);
  }

  onPageSizeChange($event: NzSafeAny): void {
    this.changePageSize.emit($event);
  }

  onResize({ width }: NzResizeEvent, col: string): void {
    this.tableConfig.headers = this.tableConfig.headers.map(e =>
      e.title === col
        ? {
            ...e,
            width: +`${width}`
          }
        : e
    ) as TableHeader[];
  }

  refreshStatus(): void {
    const allChecked =
      this._dataList.length > 0 &&
      this._dataList.every(item => {
        return item['_checked'] === true;
      });
    const allUnChecked = this._dataList.every(item => item['_checked'] !== true);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkedCashArrayFromComment']) {
      this.refreshStatus();
    }
  }
}
