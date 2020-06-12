import { randomInteger } from './utils';
import { Chromosome } from './Chromosome';

export class Gene {
  constructor(populationSize, y, coefficients) {
    this.y = y;
    this.chromosomSize = coefficients.length; // довжина хромосоми = кількість коефіцієнтів
    this.coefficients = coefficients; // коефіцінєнти
    this.mutationProb = 0; // початкова вирогідність мутації
    
    // Створити початкову популяцію
    this.chromosoms = Array.from({ length: populationSize }, () => new Chromosome(this.chromosomSize, 0, 10));
  }

  // Main function to find population
  findPopulation(steps, delta){
    const mutationStep = 0.01;
    let res;
    while (this.mutationProb < 1){
      res = this.calculate(steps, delta);
      if (res.message !== 'Need More Steps'){
        res.message += `\nThe optimal probability of a mutation: ${this.mutationProb}.`
        return res;
      }
      this.mutationProb += mutationStep; // з кожною новою популяцією шанс мутації збільшується
    }
    return res;
  }

  // Find Deltas - find expression result with chromosome values like x-values
  // Знаходимо коефіціенти виживання:
  // - підставляємо кожне отримане рішення (x1, x2, x3, x4) у вираз.
  // - відстань від отриманного значення до значення this.y буде шуканим значенням
  findDeltas(chromosomes) {
    return chromosomes.map(chromosome => {
      const chromosomeValue = chromosome.array.reduce((acc, curValue, curIndex) =>
        acc + curValue * this.coefficients[curIndex],
      0);
      return Math.abs(this.y - chromosomeValue); // коефіціент виживання
    });
  };

  // Find fit probability
  // - знайти сума всіх зворотніх коефіціентів
  // - обчислити відсотки (зворотній коефіціент / суму зворотніх коефіціентів)
  fit(deltas) {
    const sum = deltas.reduce((acc, curValue) =>
      curValue ? acc + 1 / curValue : acc,
    0);
    return deltas.map(delta => (1 / delta) / sum);
  };

  // Find new population 
  calculate(steps, delta) {    
    let deltas = this.findDeltas(this.chromosoms); // знайти нову різницю

    for (let step = 0; step < steps; step++) {
      const fitedValues = this.fit(deltas);      
      const firstChrIndex = fitedValues.indexOf(Math.max(...fitedValues)); // обираємо найживучу хромасому
      const secondChrIndex = fitedValues.indexOf(Math.max(...fitedValues.filter((_, i) => i !== firstChrIndex))); // обираємо другу найживучу хромасому

      this.chromosoms[firstChrIndex].crossing(this.chromosoms[secondChrIndex]); // обнмінюємося даними між хромасомами (крос-овер)
      this.makeMutation(); // зробити мутацію

      deltas = this.findDeltas(this.chromosoms); // знайти нову різницю після крос-оверу
      const winnerIndex = deltas.findIndex(curDelta => curDelta <= delta); // знайти переможну хромосому

      if (winnerIndex !== -1) {
        const message = `Success on ${step} step!`
        const x = this.chromosoms[winnerIndex].array;
        return { message, x };
      }
    }
  
    const message = 'Need More Steps'
    const x = this.chromosoms[this.bestChromosome(deltas)].array;
    return { message, x };
  }

  // Make random mutation of random chromosom
  makeMutation() {
    if (this.mutationProb > Math.random()) { // мутація відбудеться якщо поточне mutationProb > за рандомне число
      const index = randomInteger(0, this.chromosomSize); // взяти рандомну хромосому та мутувати її
      this.chromosoms[index].makeMutation();
    }
  }

  bestChromosome(deltas) {
    return deltas.findIndex(() => Math.min(...deltas));
  }

}