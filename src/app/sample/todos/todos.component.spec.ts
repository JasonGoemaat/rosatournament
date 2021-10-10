import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosComponent } from './todos.component';
import { Store } from "@ngxs/store";
import { NGXS_MODULE } from "../../app.module";
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NGXS_MODULE ],
      providers: [ Store ],
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ TodosComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
