import { integer, pgTable } from 'drizzle-orm/pg-core';
import { launches } from './launches';
import { customers } from './customers';

export const launchesToCustomers = pgTable('launches_to_customers', {
  launchId: integer('launch_id')
    .notNull()
    .references(() => launches.id),
  customerId: integer('customer_id')
    .notNull()
    .references(() => customers.id),
});
