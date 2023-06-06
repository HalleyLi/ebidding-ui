import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BwicPopularComponent } from './bwic-popular.component';

describe('BwicPopularComponent', () => {
  let component: BwicPopularComponent;
  let fixture: ComponentFixture<BwicPopularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BwicPopularComponent]
    });
    fixture = TestBed.createComponent(BwicPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
