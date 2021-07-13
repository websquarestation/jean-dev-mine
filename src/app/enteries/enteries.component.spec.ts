import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteriesComponent } from './enteries.component';

describe('EnteriesComponent', () => {
  let component: EnteriesComponent;
  let fixture: ComponentFixture<EnteriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnteriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnteriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
