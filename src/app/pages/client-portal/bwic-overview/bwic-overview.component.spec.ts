import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BwicOverviewComponent } from './bwic-overview.component';

describe('BwicOverviewComponent', () => {
  let component: BwicOverviewComponent;
  let fixture: ComponentFixture<BwicOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BwicOverviewComponent]
    });
    fixture = TestBed.createComponent(BwicOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
