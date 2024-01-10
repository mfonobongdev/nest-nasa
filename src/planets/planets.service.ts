import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { Planet } from './planets.types';

@Injectable()
export class PlanetsService {
  private habitablePlanets: Planet[] = [];

  constructor() {
    this.loadPlanetsData();
  }

  getAllPlanets() {
    return this.habitablePlanets;
  }

  isHabitablePlanet(planet: Planet) {
    const isNotTooCold = Number(planet.koi_insol) > 0.36;
    const isNotTooHot = Number(planet.koi_insol) < 1.11;
    const isNotTooBig = Number(planet.koi_prad) < 1.6;
    const isConfirmed = planet.koi_disposition === 'CONFIRMED';

    return isNotTooCold && isNotTooHot && isNotTooBig && isConfirmed;
  }

  loadPlanetsData() {
    const pathToFile = path.join(
      process.cwd(),
      'src',
      'data',
      'kepler_data.csv',
    );

    return new Promise((resolve, reject) => {
      fs.createReadStream(pathToFile)
        .pipe(parse({ comment: '#', columns: true }))
        .on('data', (data: Planet) => {
          if (this.isHabitablePlanet(data)) {
            this.habitablePlanets.push(data);
          }
        })
        .on('error', (err) => {
          console.log('err', err);
          reject(err);
        })
        .on('end', () => {
          console.log(
            `${this.habitablePlanets.length} habitable planets found`,
          );
          resolve('done');
        });
    });
  }
}
