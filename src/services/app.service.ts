import { Injectable } from '@nestjs/common';
import { SolveRiddleDto } from 'src/validators/waterJugSolver.validator';
import { Steps, WaterJugSolver } from './waterJugSolver.service';

@Injectable()
export class AppService {
  solveRiddle(solveRiddleDto: SolveRiddleDto): Steps | Error {
    const { x, y, z } = solveRiddleDto;
    const waterJugSolver = new WaterJugSolver(x, y, z);
    const result = waterJugSolver.solve();
    if (result instanceof Error) throw result;
    return result;
  }
}
