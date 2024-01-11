import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LaunchesModule } from './launches/launches.module';
import { PlanetsModule } from './planets/planets.module';
import { RouteLogger } from './utils/route-logger.middleware';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    LaunchesModule,
    PlanetsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RouteLogger).forRoutes('*');
  }
}
