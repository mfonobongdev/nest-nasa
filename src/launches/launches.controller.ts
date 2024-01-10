import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LaunchesService } from './launches.service';
import { addNewLaunchDto } from './launches.dto';
import { ZodValidationPipe } from '@src/utils/zod/zod-validation.pipe';
import { z } from 'zod';

@Controller('launches')
export class LaunchesController {
  constructor(private readonly launchesService: LaunchesService) {}

  @Post()
  httpAddNewLaunch(
    @Body(new ZodValidationPipe(addNewLaunchDto))
    launch: z.infer<typeof addNewLaunchDto>,
  ) {
    return this.launchesService.addNewLaunch(launch);
  }

  @Get()
  httpGetAllLaunches() {
    return this.launchesService.getAllLaunches();
  }

  @Delete(':id')
  httpAbortLaunch(@Param('id', ParseIntPipe) id: number) {
    if (!this.launchesService.launchWithIdExists(id)) {
      return { error: 'Launch not found' };
    }
    return this.launchesService.abortLaunchById(id);
  }
}
