class Pizza {
  toppings: string[]

  constructor(toppings: string[]) {
    this.toppings = toppings
  }
}

const toppings = ["lasagna", "tomato", "123"]
const pizza = new Pizza(toppings)
