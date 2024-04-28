import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { SolveRiddleDto } from 'src/validators/waterJugSolver.validator';
import { Steps } from 'src/services/waterJugSolver.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  solveRiddle(@Body() solveRiddleDto: SolveRiddleDto): Steps | Error {
    return this.appService.solveRiddle(solveRiddleDto);
  }
}
