class Foo {
  constructor(
    public foo: number,
    public baz?: Baz,
    public asdf?: string,
    protected qwer?: boolean,
    private wert?: string,
  ) {}
}

class Bar {
  bar: string

  constructor(bar: string) {
    this.bar = bar
  }
}

class Baz {
  foo: Foo
  bar: Bar
  name?: string

  constructor(foo: Foo, bar: Bar, name?: string) {
    this.foo = foo
    this.bar = bar
    this.name = name

    console.log("Foo", foo)
    console.log("Bar", bar)
  }
}

const foo = new Foo(123)
const bar = new Bar("bar")

const name = "blah"
const baz = new Baz(foo, bar, name)
console.log("Baz", JSON.stringify(baz, null, 4))

const fooWithBaz = new Foo(2345, baz)
console.log("Foo", JSON.stringify(fooWithBaz, null, 4))

export {}
