import { MigrationSuite } from './types';

const migrations: MigrationSuite = {
  metaDb: {
    up: async db => {
      await db.schema.createTable('profiles', table => {
        table.increments('id').primary();
        table.string('profileName');
        table.string('passwordHash');
        table.string('encryptionKey');
      });
    },
    down: async db => {
      await db.schema.dropTableIfExists('profiles');
    }
  },
  profileDb: {
    up: async db => {
      await db.schema.createTable('profile_details', table => {
        table.increments('id').primary();
        table.string('profileName');
        table.string('firstName');
        table.string('lastName');
        table.string('dateOfBirth');
        table.string('streetName');
        table.string('houseNumber');
        table.string('zipCode');
        table.string('city');
        table.string('state');
        table.string('country');
        table.json('emailAccounts');
      });
      await db.schema.createTable('request_groups', table => {
        table.increments('id').primary();
        table.integer('brandId');
        table.string('requestGroupType');
        table.dateTime('dateTimeCreated');
        table.dateTime('dateTimeRefreshed');
        table.dateTime('dateTimeSnoozed');
        table.string('state');
        table.string('dataStatus');
      });
      await db.schema.createTable('email_requests', table => {
        table.increments('id').primary();
        table.integer('requestGroupId');
        table.string('requestType');
        table.boolean('inCreation');
        table.dateTime('dateTimeSent');
        table.string('messageId');
        table.string('from');
        table.string('to');
        table.string('subject');
        table.string('text');
      });
    },
    down: async db => {
      db.schema.dropTableIfExists('profile_details');
    }
  }
};

export default migrations;
