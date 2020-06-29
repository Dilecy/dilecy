import { MigrationSuite } from './types';

const migrations: MigrationSuite = {
  profileDb: {
    up: async db => {
      await db.schema.createTable('consent', table => {
        table.increments('id').primary();
        table.dateTime('dateTime').defaultTo(db.fn.now());
        table.string('purpose');
        table.string('action');
        table.string('data');
      });
    },
    down: async db => {
      db.schema.dropTableIfExists('consent');
    }
  }
};

export default migrations;
