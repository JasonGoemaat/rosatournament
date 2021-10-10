import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { Todos } from './todos.actions';
import { TodosState, TodosStateModel } from './todos.state';

describe('Todos', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TodosState])]
    });

    store = TestBed.inject(Store);
  });

  it('it toggles', () => {

    const initial = { 
      todosList: [
        { id: '1', title: 'First', done: false },
        { id: '2', title: 'Second', done: true },
      ]
    };

    const expected = { 
      todosList: [
        { id: '1', title: 'First', done: true },
        { id: '2', title: 'Second', done: false },
      ]
    };

    const initialState = {
      ...store.snapshot(),
      todos: initial,
    }

    store.reset(initialState);
    store.dispatch(new Todos.Toggle('1'));
    store.dispatch(new Todos.Toggle('2'));
    const finalState = store.selectSnapshot(state => state);
    expect(finalState.todos).toEqual(expected);
  });
});