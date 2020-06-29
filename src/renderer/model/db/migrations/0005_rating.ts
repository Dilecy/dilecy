import { MigrationSuite } from './types';

const migrations: MigrationSuite = {
  profileDb: {
    up: async db => {
      await db.schema.table('profile_details', table => {
        table.integer('rating');
        table.integer('ratingId');
        table.string('ratingPassword');
      });
    },
    down: async db => {
      await db.schema.table('profile_details', table => {
        table.dropColumn('rating');
        table.dropColumn('ratingId');
        table.dropColumn('ratingPassword');
      });
    }
  }
};

export default migrations;
