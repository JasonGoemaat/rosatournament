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