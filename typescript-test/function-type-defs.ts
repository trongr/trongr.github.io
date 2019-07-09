type ProductRequestCallback = (
  err: Error | null,
  response: Object | null,
) => void

function sendRequest(done?: ProductRequestCallback): void {
  if (done) {
    done(null, null)
  }
}

sendRequest((err, response) => {
  console.log(response)
})

sendRequest()
