export interface Callback {
  (error: Error, data): void
}

function callServer(callback: Callback): void {
  callback(null, "hi")
}

callServer((error: Error, data): void => console.log(data))

callServer((): void => {})

callServer("hi") // tsc error

export type Action = {
  type: string
}

const a: Action = {
  type: "literal",
}

console.log(a)
