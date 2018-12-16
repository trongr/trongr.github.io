const test = async () => {
  try {
    const collections = [1, 2, 3, 4]
    await collections
      .map((collection) => () =>
        new Promise(async (resolve, reject) => {
          setTimeout(() => {
            console.log("resolving", collection)
            reject(new Error(`Testing error ${collection}`))
          }, 2000)
        }),
      )
      .reduce((acc, fn) => acc.then(fn), Promise.resolve())
  } catch (e) {
    console.log("it's an error")
  }
}

test()
