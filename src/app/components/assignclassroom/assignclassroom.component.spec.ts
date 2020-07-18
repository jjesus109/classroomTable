import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignclassroomComponent } from './assignclassroom.component';

describe('AssignclassroomComponent', () => {
  let component: AssignclassroomComponent;
  let fixture: ComponentFixture<AssignclassroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignclassroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignclassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
