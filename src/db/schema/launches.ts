import {
  serial,
  text,
  pgTable,
  date,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';
import { planets } from './planets';

export const launches = pgTable('launches', {
  id: serial('id').primaryKey(),
  flightNumber: integer('flight_number').notNull(),
  mission: text('mission').notNull(),
  rocket: text('rocket').notNull(),
  launchDate: date('launch_date', { mode: 'date' }),
  destination: integer('destination')
    .notNull()
    .references(() => planets.id),
  upcoming: boolean('upcoming').default(true),
  success: boolean('success').default(true),
});
