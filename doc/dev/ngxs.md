Added NGXS with:

    yarn add @ngxs/store @ngxs/router-plugin @ngxs/devtools-plugin

Auth Guide: https://martindzejky.medium.com/ngxs-and-firebase-authentication-2c2a1c1196d6

### Schematics: https://github.com/ngxs/schematics

Added with `ng add @ngxs/schematics`

Commands:

    ng g @ngxs/schematics:store --name todo

Possibly --spec, --sourceRoot

### Not a bad video:

https://www.youtube.com/watch?v=SGj11j4hxmg

## Basics, and caveats

I have a todos sample component (`src/app/sample/todos`) and route (`/samples/todos`).

You create some ngxs modules and import them in the app module.  For each thing you want to have
state for, you create a state class *and specify those classes when importing the ngxs module*.

In the file `src/app/shared/todos.state.ts` you declare an interface for what the state contains:

```ts
export interface TodosStateModel {
  todosList: Todo[];
}
```

And a token to identify the state (could actually be a string):

```ts
export const TODOS_STATE_TOKEN = new StateToken<TodosStateModel>('todos');
```

And a class for your 'state' (actually a state class, it is NOT the actual state, more like a partial
store which caused me some confusion), specifying that token, a default value, and making it
injectable.  The 'name' will be what you select from the entire ngxs state in your components.

```ts
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
```

This 'state' class is also where you put functions that will process the actions you
dispatch that can change the state (more later).

In the component you declare an observable for the model:

```ts
todosState$: Observable<TodosStateModel>;
```

And in the constructor set it by selecting what you want from the store (using the
name specified with the token above which is a property on the state parameter
you get passed to your anonymous function):

```ts
this.todosState$ = this.store.select(state => state.todos);
```

Then you can use it like any other observable in your component.  Since I want to
use async pipe and a list, I have a property to map the TodosStateModel and return
just the list (is there another way?):

```ts
get todoItems(): Observable<Todo[]> {
  return this.todosState$.pipe(map(x => x.todosList));
}
```

And to display:

```html
<div *ngFor="let todo of todoItems | async">
```

The actions are defined in `src/app/shared/todos.actions.ts`.  I think it's
recommended to do it like this with a namespace for your individual state, and
classes for each action.  The action classes must have a type string that is
unique application-wide and this format with the state in braces `[]` is recommended.
The actions can have other properties (title and id here).  The type is what
is used with the 

```ts
export namespace Todos {
  export class Add {
    static readonly type = '[todos] add';
    constructor(public title: string) {};
  }

  export class Toggle {
    static readonly type = '[todos] toggle';
    constructor(public id: string) {};
  }

  export class Delete {
    static readonly type = '[todos] delete';
    constructor(public id: string) {};
  }
}
```

Back to `src/app/shared/todos.state.ts`.  Each action should have a method on the state
class.  The `@Action()` decorator tells it the class of the action, which identifies
what method to call based on the `type` property.  The method takes the state context
tied to your state model (specified in the state class decorator `@State<TodosStateModel>({`).
The context method `getState()` returns the TodosStateModel currently, and you make
changes and call `setState(newState)` to update the state.

```ts
@Action(Todos.Toggle)
toggleTodo(ctx: StateContext<TodosStateModel>, { id } : Todos.Toggle) {
  const state = ctx.getState();

  const newState = {
    todosList: state.todosList.map(todo => todo.id === id ? { id: todo.id, title: todo.title, done: !todo.done } : todo)
  }

  ctx.setState(newState);
}
```

In your component, you use the Store to dispatch an action to alter the state:

```ts
toggleTodo(id: string) {
  this.store.dispatch(new Todos.Toggle(id));
}
```