import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../controllers/app.controller';
import { AppService } from '../../services/app.service';
import { SolveRiddleDto } from '../../validators/waterJugSolver.validator';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('Test the controller', () => {
    it('should return steps for (100, 2, 96)', () => {
      const solveRiddleDto = new SolveRiddleDto();
      (solveRiddleDto.x = 100), (solveRiddleDto.y = 2), (solveRiddleDto.z = 96);
      expect(appController.solveRiddle(solveRiddleDto)).toStrictEqual([
        {
          action: 'Fill bucket X',
          bucketX: 100,
          bucketY: 0,
          status: 'Unsolved',
          step: 1,
        },
        {
          action: 'Transfer from bucket X to Y',
          bucketX: 98,
          bucketY: 2,
          status: 'Unsolved',
          step: 2,
        },
        {
          action: 'Empty bucket Y',
          bucketX: 98,
          bucketY: 0,
          status: 'Unsolved',
          step: 3,
        },
        {
          action: 'Transfer from bucket X to Y',
          bucketX: 96,
          bucketY: 2,
          status: 'Solved',
          step: 4,
        },
      ]);
    });
  });
});
