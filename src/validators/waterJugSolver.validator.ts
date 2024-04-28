import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class SolveRiddleDto {
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @ApiProperty({
    description: 'The capacity of the first jug',
    minimum: 0,
    type: 'integer',
    example: 10,
  })
  x: number;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @ApiProperty({
    description: 'The capacity of the second jug',
    minimum: 0,
    type: 'integer',
    example: 2,
  })
  y: number;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @ApiProperty({
    description: 'The amount to measure',
    minimum: 1,
    type: 'integer',
    example: 4,
  })
  z: number;
}
