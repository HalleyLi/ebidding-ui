import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { SalesPortalService } from '@app/core/services/sales-portal.service';
import { BwicPopularItem } from '@app/models/bwic/bwic-popular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EChartsOption } from 'echarts';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  template: `
  <div echarts style="height: 600px;" [options]="options | async"></div>
`,
changeDetection: ChangeDetectionStrategy.OnPush,
providers: [
  {
    provide: NGX_ECHARTS_CONFIG,
    useFactory: () => ({ echarts: () => import('echarts') })
  }
]
})
export class BwicPopularComponent implements OnInit {
  constructor(private salesService: SalesPortalService) {}
  options!: Observable<EChartsOption>;
  destroyRef = inject(DestroyRef);
  
  ngOnInit(): void {
    this.options = this.salesService.getAllBwicPopularList()
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      map(data =>({
        title: {
          text: 'Bidding Popular Rank',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: data.map((item: BwicPopularItem) => item.cusip),
        },
        series: [
          {
            name: 'bidding numbers',
            type: 'bar',
            data: data.map((item: BwicPopularItem) => item.numberOfBids).sort(),
          },
        ],
      }))
    );
  }

}
