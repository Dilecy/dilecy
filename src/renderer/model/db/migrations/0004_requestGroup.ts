import { MigrationSuite } from './types';

const migrations: MigrationSuite = {
  profileDb: {
    up: async db => {
      await db.schema.table('request_groups', table => {
        table.string('brandName');
        table.string('companyName');
      });
    },
    down: async db => {
      await db.schema.table('request_groups', table => {
        table.dropColumn('brandName');
        table.dropColumn('companyName');
      });
    }
  }
};

export default migrations;
