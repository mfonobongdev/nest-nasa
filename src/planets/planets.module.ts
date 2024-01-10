import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlaentsController } from './planets.controller';

@Module({
  controllers: [PlaentsController],
  providers: [PlanetsService],
})
export class PlanetsModule {}
