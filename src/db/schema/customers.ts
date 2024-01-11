import { serial, text, pgTable } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
