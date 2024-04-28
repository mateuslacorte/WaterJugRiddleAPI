import { NotFoundException } from '@nestjs/common';

export class WaterJugSolver {
  x: number;
  y: number;
  z: number;
  allStates: number[][];
  allSteps: (string | number)[][][];

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.allStates = [];
    this.allSteps = [];
  }

  fillX(currentState: number[], currentSteps: number[][]) {
    const newState = currentState.slice();
    newState[0] = this.x;
    this.search(newState.slice(), [
      ...currentSteps,
      [newState[0], newState[1], 'Fill bucket X'],
    ]);
  }

  fillY(currentState: number[], currentSteps: number[][]) {
    const newState = currentState.slice();
    newState[1] = this.y;
    this.search(newState.slice(), [
      ...currentSteps,
      [newState[0], newState[1], 'Fill bucket Y'],
    ]);
  }

  emptyX(currentState: number[], currentSteps: number[][]) {
    const newState = currentState.slice();
    newState[0] = 0;
    this.search(newState.slice(), [
      ...currentSteps,
      [newState[0], newState[1], 'Empty bucket X'],
    ]);
  }

  emptyY(currentState: number[], currentSteps: number[][]) {
    const newState = currentState.slice();
    newState[1] = 0;
    this.search(newState.slice(), [
      ...currentSteps,
      [newState[0], newState[1], 'Empty bucket Y'],
    ]);
  }

  transferXtoY(currentState: number[], currentSteps: number[][]) {
    const newState = currentState.slice();
    newState[1] += newState[0];

    if (newState[1] > this.y) {
      newState[0] = newState[1] - this.y;
      newState[1] = this.y;
    } else {
      newState[0] = 0;
    }

    this.search(newState.slice(), [
      ...currentSteps,
      [newState[0], newState[1], 'Transfer from bucket X to Y'],
    ]);
  }

  transferYtoX(currentState: number[], currentSteps: number[][]) {
    const newState = currentState.slice();
    newState[0] += newState[1];

    if (newState[0] > this.x) {
      newState[1] = newState[0] - this.x;
      newState[0] = this.x;
    } else {
      newState[1] = 0;
    }

    this.search(newState.slice(), [
      ...currentSteps,
      [newState[0], newState[1], 'Transfer from bucket Y to X'],
    ]);
  }

  solved(currentState: number[], currentSteps: (number | string)[][]): boolean {
    if (currentState[0] == this.z || currentState[1] == this.z) {
      this.allSteps.push(currentSteps);
      return true;
    } else if (
      this.allStates.some(
        (state) => state[0] === currentState[0] && state[1] === currentState[1],
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  solution(): (string | number)[][] {
    if (!this.allSteps.length) {
      return [];
    } else {
      let shortest = this.allSteps[0];

      for (let i = 1; i < this.allSteps.length; i++) {
        if (this.allSteps[i].length < shortest.length) {
          shortest = this.allSteps[i];
        }
      }

      return shortest;
    }
  }

  search(currentState: number[], currentSteps: (number | string)[][]) {
    if (this.solved(currentState, currentSteps)) return;

    this.allStates.push(currentState.slice());

    this.fillX(currentState, currentSteps as number[][]);
    this.fillY(currentState, currentSteps as number[][]);
    this.emptyX(currentState, currentSteps as number[][]);
    this.emptyY(currentState, currentSteps as number[][]);
    this.transferXtoY(currentState, currentSteps as number[][]);
    this.transferYtoX(currentState, currentSteps as number[][]);
  }

  translate(steps: (number | string)[][]): Steps | Error {
    let finalResult: Steps | Error;
    if (!steps.length) {
      return new NotFoundException('No solution found');
    } else {
      finalResult = steps.map((step, i) => ({
        step: i + 1,
        bucketX: step[0] as number,
        bucketY: step[1] as number,
        action: step[2] as string,
        status: i == steps.length - 1 ? 'Solved' : 'Unsolved',
      }));
    }

    return finalResult;
  }

  solve(
    currentState: number[] = [0, 0],
    currentSteps: (number | string)[][] = [],
  ) {
    this.search(currentState, currentSteps as number[][]);
    return this.translate(this.solution());
  }
}

export type Steps = {
  step: number;
  bucketX: number;
  bucketY: number;
  action: string;
  status: string;
}[];

const exemplo = new WaterJugSolver(4, 4, 2);
console.log(exemplo.solve());
