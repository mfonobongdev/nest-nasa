import { Module } from '@nestjs/common';
import { LaunchesModule } from './launches/launches.module';

@Module({
  imports: [LaunchesModule],
})
export class AppModule {}
