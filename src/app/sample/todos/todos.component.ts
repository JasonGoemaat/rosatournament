import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Todos } from 'src/app/shared/todos.actions';
import { Todo, TodosState, TodosStateModel } from 'src/app/shared/todos.state';
import { map } from "rxjs/operators";
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  providers: [{provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' }}]
})
export class TodosComponent implements OnInit {
  todosState$: Observable<TodosStateModel>;
  newTodoTitle: string = "";

  constructor(public store: Store) {
    (window as any).ctodos = this;
    (window as any).AddTodo = Todos.Add;
    
    // NOTE: this property name on 'state' ('todos') must match the string property name on the TodosState class
    this.todosState$ = this.store.select(state => state.todos);
  }

  ngOnInit(): void {
  }

  get todoItems(): Observable<Todo[]> {
    return this.todosState$.pipe(map(x => x.todosList));
  }

  onAddTodo(title: string) {
    this.store.dispatch(new Todos.Add(title)).subscribe(x => { this.newTodoTitle = ""; });
  }

  toggleTodo(id: string) {
    this.store.dispatch(new Todos.Toggle(id));
  }

  deleteTodo(id: string) {
    this.store.dispatch(new Todos.Delete(id));
  }
}
