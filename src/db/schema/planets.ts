import { serial, text, pgTable, pgEnum, real } from 'drizzle-orm/pg-core';

export const koiDispositionEnum = pgEnum('koi_disposition', [
  'CONFIRMED',
  'CANDITADE',
  'FALSE POSITIVE',
]);

export const planets = pgTable('planets', {
  id: serial('id').primaryKey(),
  keplerName: text('kepler_name').notNull().unique(),
  koiPrad: real('koi_prad').notNull(),
  koiInsol: real('koi_insol').notNull(),
  koiDisposition: koiDispositionEnum('koi_disposition').notNull(),
});

export type Planet = typeof planets.$inferSelect;
export type NewPlanet = typeof planets.$inferInsert;
