function Override(label: string) {
  return function(target: any, key: string) {
    Object.defineProperty(target, key, {
      configurable: false,
      get: () => label,
    })
  }
}

class Test {
  @Override("test") // invokes Override, which returns the decorator
  name: string = "pat"
}

let t = new Test()
console.log(t.name) // 'test'
