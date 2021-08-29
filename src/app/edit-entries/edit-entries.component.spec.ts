import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntriesComponent } from './edit-entries.component';

describe('EditEntriesComponent', () => {
  let component: EditEntriesComponent;
  let fixture: ComponentFixture<EditEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEntriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
