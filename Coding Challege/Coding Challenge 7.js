/*
Let's go back to Mark and John comparing their BMIs! This time, let's use objects to implement the calculations! Remember: BMI = mass / height ** 2 = mass / (height * height) (mass in kg and height in meter)
Your tasks:
1. For each of them, create an object with properties for their full name, mass, and height (Mark Miller and John Smith)
2. Create a 'calcBMI' method on each object to calculate the BMI (the same method on both objects). Store the BMI value to a property, and also return it from the method
3. Log to the console who has the higher BMI, together with the full name and the respective BMI. Example: "John's BMI (28.3) is higher than Mark's (23.9)!"
Test data: Marks weights 78 kg and is 1.69 m tall. John weights 92 kg and is 1.95 m tall.
*/

const Mark = {
  fullName: 'Mark Miller',
  mass: 78,
  height: 1.69,

  calcBMI: function() {
    this.BMI = ((this.mass) / ((this.height) * (this.height))).toFixed(2);
    return this.BMI;
  }
}

const John = {
  fullName: 'John Smith',
  mass: 92,
  height: 1.95,

  calcBMI: function() {
    this.BMI = ((this.mass) / ((this.height) * (this.height))).toFixed(2);
    return this.BMI;
  }
}

John.calcBMI();
Mark.calcBMI();

if (Mark.BMI > John.BMI) {
  console.log(`${Mark.fullName}'s BMI (${Mark.BMI}) is higher than ${John.fullName}'s (${John.BMI})!`);
} else {
  console.log(`${John.fullName}'s BMI (${John.BMI}) is higher than ${Mark.fullName}'s (${Mark.BMI})!`);
}