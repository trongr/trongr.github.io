type Age = number | string

function admitAge(age: Age): string {
  return `I am ${age}, alright?!`
}

const myAge: Age = 30
const yourAge: Age = "Forty"

admitAge(myAge) // 'I am 30, alright?!'
admitAge(yourAge) // 'I am Forty, alright?!'
