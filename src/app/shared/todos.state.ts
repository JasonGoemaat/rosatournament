import { Injectable } from "@angular/core";
import { Action, State, StateContext, StateToken } from "@ngxs/store";
import { Todos } from "./todos.actions";

export const TODOS_STATE_TOKEN = new StateToken<TodosStateModel>('todos');

export interface Todo {
  id: string,
  title: string,
  done: boolean
}

export interface TodosStateModel {
  todosList: Todo[];
}

let nextId = 10;

@State<TodosStateModel>({
  name: TODOS_STATE_TOKEN,
  defaults: {
    todosList: [
      { id: 'todo1', title: 'My first todo', done: false }
    ]
  }
})
@Injectable()
export class TodosState {
  @Action(Todos.Add)
  addTodo(ctx: StateContext<TodosStateModel>, { title }: Todos.Add)
  {
    const state = ctx.getState();
    
    const newTodo: Todo = {
      id: `${nextId++}`,
      title,
      done: false,
    }

    const newState = {
      todosList: [...state.todosList, newTodo]
    }

    ctx.setState(newState);
  }

  @Action(Todos.Toggle)
  toggleTodo(ctx: StateContext<TodosStateModel>, { id } : Todos.Toggle) {
    const state = ctx.getState();

    const newState = {
      todosList: state.todosList.map(todo => todo.id === id ? { id: todo.id, title: todo.title, done: !todo.done } : todo)
    }

    ctx.setState(newState);
  }

  @Action(Todos.Delete)
  deleteTodo(ctx: StateContext<TodosStateModel>, { id } : Todos.Toggle) {
    const state = ctx.getState();

    const newState = {
      todosList: state.todosList.filter(todo => todo.id !== id)
    }

    ctx.setState(newState);
  }
}
