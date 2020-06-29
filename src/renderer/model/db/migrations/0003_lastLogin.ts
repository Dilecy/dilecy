import { MigrationSuite } from './types';

const migrations: MigrationSuite = {
  profileDb: {
    up: async db => {
      await db.schema.table('profile_details', table => {
        table.dateTime('lastLogin');
      });
    },
    down: async db => {
      await db.schema.table('profile_details', table => {
        table.dropColumn('lastLogin');
      });
    }
  }
};

export default migrations;
