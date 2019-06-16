function logMessage(message: string, isDebug?: boolean) {
  if (isDebug) {
    console.log(`Debugging: ${message}`)
  } else {
    console.log(`Not debugging: ${message}`)
  }
}

logMessage("hi")
logMessage("test", true)
logMessage("Something", false)
