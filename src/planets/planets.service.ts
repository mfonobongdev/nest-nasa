import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { RawPlanet } from './planets.types';
import { DbService } from '@src/db/db.service';
import { NewPlanet, planets } from '@src/db/schema/planets';

@Injectable()
export class PlanetsService {
  private habitablePlanets: NewPlanet[] = [];

  constructor(private readonly dbService: DbService) {
    this.loadPlanetsData();
  }

  getAllPlanets() {
    return this.habitablePlanets;
  }

  isHabitablePlanet(planet: NewPlanet) {
    const isNotTooCold = Number(planet.koiInsol) > 0.36;
    const isNotTooHot = Number(planet.koiInsol) < 1.11;
    const isNotTooBig = Number(planet.koiPrad) < 1.6;
    const isConfirmed = planet.koiDisposition === 'CONFIRMED';

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
        .on('data', async (data: RawPlanet) => {
          const newPlanet: NewPlanet = {
            keplerName: data.kepler_name,
            koiInsol: Number(data.koi_insol),
            koiPrad: Number(data.koi_prad),
            koiDisposition: data.koi_disposition,
          };

          if (this.isHabitablePlanet(newPlanet)) {
            this.habitablePlanets.push(newPlanet);
            await this.insertPlanet(newPlanet);
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

  async insertPlanet(newPlanet: NewPlanet) {
    return await this.dbService.db
      .insert(planets)
      .values(newPlanet)
      .onConflictDoNothing({ target: planets.keplerName });
  }
}
