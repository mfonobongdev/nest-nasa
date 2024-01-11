import type { Config } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const connectionString = configService.get<string>('DB_CONNECTION_URL');

export default {
  schema: './src/db/schema/*.ts',
  out: './src/db/migrations',
  dbCredentials: {
    connectionString: connectionString ?? '',
  },
  driver: 'pg',
} satisfies Config;
