import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BwicAdminComponent } from './bwic-admin.component';

describe('BwicAdminComponent', () => {
  let component: BwicAdminComponent;
  let fixture: ComponentFixture<BwicAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BwicAdminComponent]
    });
    fixture = TestBed.createComponent(BwicAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
