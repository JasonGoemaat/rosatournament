# Testing

* NGXS Recipes: https://www.ngxs.io/recipes/unit-testing

## Tips

### Handling child components in component tests

This is especially useful because we don't want to have to mock all the Angular Material components.
You can use the NO_ERRORS_SCHEMA in your testbed.  You can also mock individual components:

```ts
import { NO_ERRORS_SCHEMA } from '@angular/core';

...

    TestBed.configureTestingModule({
      declarations: [ MyComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [AppComponent, AboutClientServiceService]
    }).compileComponents();
...

