import { Injectable } from '@nestjs/common';
import { Launch } from './launches.types';
import { addNewLaunchDto } from './launches.dto';
import { z } from 'zod';

@Injectable()
export class LaunchesService {
  private launches = new Map<number, Launch>();
  private latestFlightNumber = 100;

  constructor() {
    const launch: Launch = {
      flightNumber: 100,
      mission: 'Kepler Exploration X',
      rocket: 'Explorer 1',
      launchDate: new Date('December 27, 2030'),
      destination: 'Kepler-442 b',
      customer: ['NASA', 'ZTM'],
      upcoming: true,
      success: true,
    };

    this.launches.set(launch.flightNumber, launch);
  }

  getAllLaunches() {
    const allLaunches = this.launches.values();
    return Array.from(allLaunches);
  }

  addNewLaunch(launch: z.infer<typeof addNewLaunchDto>) {
    this.latestFlightNumber++;

    //add server genetared values
    const newLaunch: Launch = Object.assign(launch, {
      flightNumber: this.latestFlightNumber,
      customer: ['NASA', 'ZTM'],
      upcoming: true,
      success: true,
    });

    this.launches.set(this.latestFlightNumber, newLaunch);

    return newLaunch;
  }

  launchWithIdExists(launchId: number) {
    return this.launches.has(launchId);
  }

  abortLaunchById(launchId: number) {
    const aborted = this.launches.get(launchId);

    if (aborted) {
      aborted.upcoming = false;
      aborted.success = false;
    }

    return aborted;
  }
}
