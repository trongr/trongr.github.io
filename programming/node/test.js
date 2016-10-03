function A(){
    var something = 0

    this.changeSomething = function(s){
        something = s
    }

    this.getSomething = function(){
        return something
    }
}

var a = new A()
var b = new A()

a.changeSomething(10)
console.log(a.getSomething())
// a's something is changed to 10

b.changeSomething(100)
console.log(b.getSomething())
// b's something is changed to 100

console.log(a.getSomething())
// a's something is unchanged (from 10)
