import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { WaterJugSolver, Steps } from '../../services/waterJugSolver.service';

describe('WaterJugSolver', () => {
  test('Should find a solution for the given capacities and target amount', () => {
    const waterJugSolver = new WaterJugSolver(2, 10, 4);
    const solution = waterJugSolver.solve();
    const solution_steps = solution as Steps;
    if (solution_steps.length > 0) {
      expect(solution_steps.length).toStrictEqual(4);
      expect(solution_steps[0]).toStrictEqual({
        step: 1,
        bucketX: 2,
        bucketY: 0,
        action: 'Fill bucket X',
        status: 'Unsolved',
      });
      expect(solution_steps[1]).toStrictEqual({
        step: 2,
        bucketX: 0,
        bucketY: 2,
        action: 'Transfer from bucket X to Y',
        status: 'Unsolved',
      });
      expect(solution_steps[2]).toStrictEqual({
        step: 3,
        bucketX: 2,
        bucketY: 2,
        action: 'Fill bucket X',
        status: 'Unsolved',
      });
      expect(solution_steps[3]).toStrictEqual({
        step: 4,
        bucketX: 0,
        bucketY: 4,
        action: 'Transfer from bucket X to Y',
        status: 'Solved',
      });
    } else {
      throw Error('No solution found'); // Fail the test if solution is null
    }
  });

  test('Should return an error if no solution is found', () => {
    const waterJugSolver = new WaterJugSolver(1, 3, 4);
    try {
      waterJugSolver.solve();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe('No solution found');
    }
  });
});
