import { NotFoundException } from '@nestjs/common';

export class WaterJugSolver {
  x: number;
  y: number;
  z: number;
  allSteps: (string | number)[][][];

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.allSteps = [];
  }

  fillX(
    currentState: number[],
    currentSteps: (number | string)[][],
    allStates: (number | string)[][],
  ) {
    const newState = currentState.slice();
    newState[0] = this.x;
    this.search(
      newState.slice(),
      currentSteps
        .slice()
        .concat([[newState[0], newState[1], 'Fill bucket X']]),
      allStates.slice(),
    );
  }

  fillY(
    currentState: number[],
    currentSteps: (number | string)[][],
    allStates: (number | string)[][],
  ) {
    const newState = currentState.slice();
    newState[1] = this.y;
    this.search(
      newState.slice(),
      currentSteps
        .slice()
        .concat([[newState[0], newState[1], 'Fill bucket Y']]),
      allStates.slice(),
    );
  }

  emptyX(
    currentState: number[],
    currentSteps: (number | string)[][],
    allStates: (number | string)[][],
  ) {
    const newState = currentState.slice();
    newState[0] = 0;
    this.search(
      newState.slice(),
      currentSteps
        .slice()
        .concat([[newState[0], newState[1], 'Empty bucket X']]),
      allStates.slice(),
    );
  }

  emptyY(
    currentState: number[],
    currentSteps: (number | string)[][],
    allStates: (number | string)[][],
  ) {
    const newState = currentState.slice();
    newState[1] = 0;
    this.search(
      newState.slice(),
      currentSteps
        .slice()
        .concat([[newState[0], newState[1], 'Empty bucket Y']]),
      allStates.slice(),
    );
  }

  transferXtoY(
    currentState: number[],
    currentSteps: (number | string)[][],
    allStates: (number | string)[][],
  ) {
    const newState = currentState.slice();
    newState[1] += newState[0];

    if (newState[1] > this.y) {
      newState[0] = newState[1] - this.y;
      newState[1] = this.y;
    } else {
      newState[0] = 0;
    }

    this.search(
      newState.slice(),
      currentSteps
        .slice()
        .concat([[newState[0], newState[1], 'Transfer from bucket X to Y']]),
      allStates.slice(),
    );
  }

  transferYtoX(
    currentState: number[],
    currentSteps: (number | string)[][],
    allStates: (number | string)[][],
  ) {
    const newState = currentState.slice();
    newState[0] += newState[1];

    if (newState[0] > this.x) {
      newState[1] = newState[0] - this.x;
      newState[0] = this.x;
    } else {
      newState[1] = 0;
    }

    this.search(
      newState.slice(),
      currentSteps
        .slice()
        .concat([[newState[0], newState[1], 'Transfer from bucket Y to X']]),
      allStates.slice(),
    );
  }

  solved(
    currentState: (number | string)[],
    currentSteps: (number | string)[][],
    allStates: (number | string)[][],
  ): boolean {
    if (currentState[0] === this.z || currentState[1] === this.z) {
      this.allSteps.push(currentSteps);
      return true;
    } else if (
      allStates.some(
        (state) => state[0] === currentState[0] && state[1] === currentState[1],
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  solution(): (string | number)[][] {
    if (this.allSteps.length === 0) {
      console.log('Sem solução');
    } else {
      let shortest = this.allSteps[0];

      for (let i = 1; i < this.allSteps.length; i++) {
        const path = this.allSteps[i];
        if (path.length < shortest.length) {
          shortest = path;
        }
      }

      return shortest;
    }
  }

  search(
    currentState: number[],
    currentSteps: (number | string)[][],
    allStates: (number | string)[][],
  ) {
    if (
      this.solved(currentState.slice(), currentSteps.slice(), allStates.slice())
    )
      return;

    allStates.push(currentState.slice());

    this.fillX(currentState.slice(), currentSteps.slice(), allStates.slice());
    this.fillY(currentState.slice(), currentSteps.slice(), allStates.slice());
    this.emptyX(currentState.slice(), currentSteps.slice(), allStates.slice());
    this.emptyY(currentState.slice(), currentSteps.slice(), allStates.slice());
    this.transferXtoY(
      currentState.slice(),
      currentSteps.slice(),
      allStates.slice(),
    );
    this.transferYtoX(
      currentState.slice(),
      currentSteps.slice(),
      allStates.slice(),
    );
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
    this.search(currentState.slice(), currentSteps.slice(), []);
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
