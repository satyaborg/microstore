/**
 * User Auth Table
 */
import { pgSchema, uuid } from 'drizzle-orm/pg-core';

// NOTE: Users table are in the auth schema, not the public schema
// WARNING: never include this with others or run migrations on
export const users = pgSchema('auth').table('users', {
  id: uuid('id').primaryKey(),
});
