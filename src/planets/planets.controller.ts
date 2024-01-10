import { Controller, Get } from '@nestjs/common';
import { PlanetsService } from './planets.service';

@Controller('planets')
export class PlaentsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  httpGetAllPlanets() {
    return this.planetsService.getAllPlanets();
  }
}
