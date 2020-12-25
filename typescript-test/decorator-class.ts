function log(prefix?: string) {
  return (target) => {
    // save a reference to the original constructor
    var original = target

    // a utility function to generate instances of a class
    function construct(constructor, args) {
      var c: any = function() {
        return constructor.apply(this, args)
      }
      c.prototype = constructor.prototype
      return new c()
    }

    // the new constructor behavior
    var f: any = function(...args) {
      console.log(prefix + original.name)
      return construct(original, args)
    }

    // copy prototype so instanceof operator still works
    f.prototype = original.prototype

    // return new constructor (will override original)
    return f
  }
}

@log("hello")
class World {}

const w = new World() // outputs "helloWorld"
console.log(w)
