import Knex from 'knex';

type MigrationOp = (db: Knex) => Promise<void>;

interface Migration {
  up: MigrationOp;
  down: MigrationOp;
}

export type DBIdentifier = 'metaDb' | 'profileDb';

export type MigrationSuite = Partial<Record<DBIdentifier, Migration>>;

export interface MigrationInfo {
  id: number;
  applied: string;
  schemaVersion: number;
}

export class MigrationError extends Error {
  // Instanceof is broken when extending Error in TS.
  // See https://github.com/microsoft/TypeScript/issues/13965 for details.
  __proto__: Error;
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);
    this.__proto__ = trueProto;
  }
}
