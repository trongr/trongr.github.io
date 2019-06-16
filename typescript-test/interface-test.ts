interface Callback {
    (error: Error, data: any): void;
}

function callServer(callback: Callback) {
    callback(null, "hi")
}

callServer((error, data) => console.log(data)) // 'hi'
callServer("hi") // tsc error
