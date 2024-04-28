import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../modules/app.module';
import * as request from 'supertest';
import { SolveRiddleDto } from 'src/validators/waterJugSolver.validator';

describe('Integration tests', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Solve riddle that has a solution', async () => {
    const solveRiddleDto = new SolveRiddleDto();
    (solveRiddleDto.x = 100), (solveRiddleDto.y = 2), (solveRiddleDto.z = 96);

    const response = await request(app.getHttpServer())
      .post('/')
      .send(solveRiddleDto)
      .expect(200);

    expect(response.body).toStrictEqual([
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

  it('Return error for riddle that has no solution', async () => {
    const solveRiddleDto = new SolveRiddleDto();
    (solveRiddleDto.x = 4), (solveRiddleDto.y = 4), (solveRiddleDto.z = 2);

    const response = await request(app.getHttpServer())
      .post('/')
      .send(solveRiddleDto)
      .expect(404);

    expect(response.body).toStrictEqual({
      error: 'Not Found',
      message: 'No solution found',
      statusCode: 404,
    });
  });

  it('Return error for riddle that is lacking body parameters', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .send({ x: 5, y: 3 })
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Bad Request',
      message: [
        'z must be an integer number',
        'z must be a positive number',
        'z should not be empty',
      ],
      statusCode: 400,
    });
  });

  it('Return error for riddle that has wrong body parameters', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .send({ x: 99.9, y: 'foo', z: 'bar' })
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Bad Request',
      message: [
        'x must be an integer number',
        'y must be an integer number',
        'y must be a positive number',
        'z must be an integer number',
        'z must be a positive number',
      ],
      statusCode: 400,
    });
  });
});
