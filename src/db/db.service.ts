import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as postgres from 'postgres';

/* schemas */
import * as customers from './schema/customers';
import * as launches from './schema/launches';
import * as launchesToCustomers from './schema/launchesToCustomers';
import * as planets from './schema/planets';

type schema = typeof customers &
  typeof launches &
  typeof launchesToCustomers &
  typeof planets;

@Injectable()
export class DbService implements OnModuleInit {
  public db: PostgresJsDatabase<schema>;
  private dbUrl: string | undefined;

  constructor(private configService: ConfigService) {
    this.dbUrl = configService.get<string>('DB_CONNECTION_URL');
  }

  async onModuleInit() {
    // this.runMigrations();
    this.connect();
  }

  private async runMigrations() {
    if (this.dbUrl) {
      const migrationClient = postgres(this.dbUrl, { max: 1 });
      await migrate(drizzle(migrationClient), {
        migrationsFolder: 'migrations',
      });
      await migrationClient.end();
    }
  }

  private async connect() {
    if (this.dbUrl) {
      const queryClient = postgres(this.dbUrl);

      this.db = drizzle(queryClient, {
        schema: {
          ...customers,
          ...launches,
          ...launchesToCustomers,
          ...planets,
        },
      });

      console.log('db connection successful ...');
    } else {
      console.log('db connection failed ...');
    }
  }
}
