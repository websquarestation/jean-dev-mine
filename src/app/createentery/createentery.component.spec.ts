import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateenteryComponent } from './createentery.component';

describe('CreateenteryComponent', () => {
  let component: CreateenteryComponent;
  let fixture: ComponentFixture<CreateenteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateenteryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateenteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
