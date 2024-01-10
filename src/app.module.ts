import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LaunchesModule } from './launches/launches.module';
import { PlanetsModule } from './planets/planets.module';
import { RouteLogger } from './utils/route-logger.middleware';

@Module({
  imports: [LaunchesModule, PlanetsModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RouteLogger).forRoutes('*');
  }
}
