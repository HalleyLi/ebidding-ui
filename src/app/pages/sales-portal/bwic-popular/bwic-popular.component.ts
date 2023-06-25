import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { SalesPortalService } from '@app/core/services/sales-portal.service';
import { BwicPopularItem } from '@app/models/bwic/bwic-popular';
import { EChartsOption } from 'echarts';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  template: `
  <div echarts style="height: 600px;" [options]="options" ></div>
`,
providers: [
  {
    provide: NGX_ECHARTS_CONFIG,
    useFactory: () => ({ echarts: () => import('echarts') })
  }
]
})
export class BwicPopularComponent implements OnInit {
  constructor(private salesService: SalesPortalService) {}
  options!: EChartsOption;
  ngOnInit(): void {
    this.salesService.getAllBwicPopularList().subscribe((data: BwicPopularItem[]) => {
      if (data) {
        this.options = this.getOption({ bwicPopularList: data });
      }
    });
  }

  getOption({ bwicPopularList }: { bwicPopularList: BwicPopularItem[]; }): EChartsOption {
    return {
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
        data: bwicPopularList.map((item: BwicPopularItem) => item.cusip),
      },
      series: [
        {
          name: 'bidding numbers',
          type: 'bar',
          data: bwicPopularList.map((item: BwicPopularItem) => item.numberOfBids).sort(),
        },
      ],
    };
  }
}
