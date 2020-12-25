export interface Action {
  type: string
}

let a: Action = {
  type: "literal",
}

class NotAnAction {
  public type: Readonly<string>

  constructor() {
    this.type = "Constructor function (class)"
  }
}

a = new NotAnAction() // valid TypeScript!

console.log(a)
