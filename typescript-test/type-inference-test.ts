let numbers = [2, 3, 5, 7, 11]
numbers = ["this will generate a type error"]

console.log(numbers)

interface FakeEvent {
  type: string
}

interface FakeEventHandler {
  (e: FakeEvent): void
}

class FakeWindow {
  onMouseDown: FakeEventHandler
}
const fakeWindow = new FakeWindow()

fakeWindow.onMouseDown = (a: number) => {
  console.log(a)
}
