import { MigrationSuite } from './types';

const migrations: MigrationSuite = {
  profileDb: {
    up: async db => {
      await db.schema.table('request_groups', table => {
        table.integer('snoozeCount').defaultTo(0);
        table.string('tempState').defaultTo('inProgress');
      });

      await db('request_groups').update({ tempState: db.ref('state') });
      await db.schema.table('request_groups', table => {
        table.dropColumn('state');
        table.renameColumn('tempState', 'state');
      });
    },
    down: async db => {
      await db.schema.createTable('request_groups', table => {
        table.dropColumn('snoozeCount');
        table.string('tempState');
      });

      await db('request_groups').update({ tempState: db.ref('state') });
      await db.schema.table('request_groups', table => {
        table.dropColumn('state');
        table.renameColumn('tempState', 'state');
      });
    }
  }
};

export default migrations;
