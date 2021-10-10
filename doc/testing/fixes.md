## MockLocationStrategy

```
WARN: 'DEPRECATED: DI is instantiating a token "MockLocationStrategy" that inherits its @Injectable decorator but does not provide one itself.
This will become an error in a future version of Angular. Please add @Injectable() to the "MockLocationStrategy" clasWARN: 'DEPRECATED: DI is instantiating a token "MockLocationStrategy" that inherits its @Injectable decorator but does not provide one itself.
This will become an error in a future version of Angular. Please add @Injectable() to the "MockLocationStrategy" class.'
```

Solution from [stackoverflow](https://stackoverflow.com/questions/67643040/deprecated-di-is-instantiating-a-token-mocklocationstrategy-that-inherits-its):

```ts
import { MockLocationStrategy } from '@angular/common/testing';
{ provide: LocationStrategy, useClass: MockLocationStrategy },
```

## Unknown components

If you want to not have to mock child components, or if you run into errors with library components
such as Material components or `<fa-icon>`

```
ERROR: 'NG0304: 'fa-icon' is not a known element:
1. If 'fa-icon' is an Angular component, then verify that it is part of this module.
2. If 'fa-icon' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.'
```

Solution is to configure your testbed with the NO_ERRORS_SCHEMA:

```ts
import { NO_ERRORS_SCHEMA } from '@angular/core';

...

    TestBed.configureTestingModule({
      declarations: [ MyComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [AppComponent, AboutClientServiceService]
    }).compileComponents();
```

## jasmine.createSpyObject

To inject Auth from angularfire, this worked:

```ts
import { Auth } from '@angular/fire/auth';
...  
const authSpy = jasmine.createSpyObj('Auth', ['notAMethod']);
...
providers: [{ provide: Auth, useValue: authSpy }],
```
