import { randomInteger } from './utils';

export class Chromosome {

  constructor(size, min, max) { // min та max значення
    this.size = size;
    this.array = Array.from({ length: size }, () => randomInteger(min, max)); // створити випадковий набір
  }

  // Make some mutation
  // - взяти одне значення з набору
  // - скруглити рандомне delta щоб отримати збільшуючу/зменшуючу delta
  // - збільшити або зменшити значення з набору
  makeMutation() {
    const index = randomInteger(0, this.size);
    const delta = Math.round(Math.random()) ? 1 : -1;
    this.array[index] += delta;
  }

  // Chromosome crossing (child/parent relations) 
  // скопіювати частину (половину) однієї хромосоми в іншу
  crossing(chromosome) {
    const index = Math.ceil(this.size / 2);
    for (let i = 0; i < index; i++) {
      const tmp = this.array[i];
      this.array[i] = chromosome.array[i];
      chromosome.array[i] = tmp;
    }
  }
}