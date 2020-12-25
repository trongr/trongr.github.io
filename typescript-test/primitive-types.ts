let isDone: boolean = false
let height: number = 6
let myName: string = "bob"

let list: number[] = [1, 2, 3]
let list2: Array<number> = [1, 2, 3]

enum Color {
  Red = "Red",
  Green = "Green",
  Blue = "Blue",
}

let c: Color = Color.Red
console.log(c)

let notSure: any = 4
notSure = "maybe a string instead"
notSure = false

function showMessage(data: string): void {
  console.log(data)
}

showMessage("hello")
