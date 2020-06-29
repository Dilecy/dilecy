import { MigrationSuite } from './types';

const migrations: MigrationSuite = {
  metaDb: {
    up: async db => {
      await db.schema.createTable('app_info', table => {
        table.increments('id').primary();
        table.dateTime('dateTime').defaultTo(db.fn.now());
        table.string('version');
      });
    },
    down: async db => {
      db.schema.dropTableIfExists('app_info');
    }
  }
};

export default migrations;
