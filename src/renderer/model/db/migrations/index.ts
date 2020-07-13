import Knex from 'knex';
import { DBIdentifier, MigrationInfo, MigrationError } from './types';

import m0001 from './0001_initial';
import m0002 from './0002_consent';
import m0003 from './0003_lastLogin';
import m0004 from './0004_requestGroup';
import m0005 from './0005_rating';
import m0006 from './0006_appInfo';
import m0007 from './0007_requestGroup';

const migrations = {
  1: m0001,
  2: m0002,
  3: m0003,
  4: m0004,
  5: m0005,
  6: m0006,
  7: m0007
};
const latest = 7;

type TargetVersion = keyof typeof migrations;
const migrationTableName = 'migration_info';

const customVersion1Detection: Record<DBIdentifier, string> = {
  metaDb: 'profiles',
  profileDb: 'profile_details'
};

const getCurrentVersion = async (db: Knex, dbIdentifier: DBIdentifier) => {
  if (await db.schema.hasTable(migrationTableName)) {
    const info = await db<MigrationInfo>(migrationTableName)
      .orderBy('schemaVersion', 'desc')
      .first();
    if (info) {
      return info.schemaVersion;
    } else {
      return 0;
    }
  } else {
    if (await db.schema.hasTable(customVersion1Detection[dbIdentifier])) {
      return 1;
    } else {
      return 0;
    }
  }
};

const logMigrationInfo = async (db: Knex, schemaVersion: number) => {
  const infoTableExists = await db.schema.hasTable(migrationTableName);
  if (!infoTableExists) {
    console.log('Creating migration_info table');
    await db.schema.createTable(migrationTableName, table => {
      table.increments('id').primary();
      table.dateTime('applied').defaultTo(db.fn.now());
      table.integer('schemaVersion');
    });
  }
  await db<MigrationInfo>(migrationTableName).insert({ schemaVersion });
};

export const migrate = async (
  db: Knex,
  dbIdentifier: DBIdentifier,
  targetVersion: TargetVersion = latest
) => {
  const currentVersion = await getCurrentVersion(db, dbIdentifier);
  if (currentVersion === targetVersion) return;
  if (currentVersion > targetVersion) {
    throw new MigrationError(
      'Downgrading of database schema not supported yet.'
    );
  }

  console.log(
    `Migrating ${dbIdentifier} from version ${currentVersion} to version ${targetVersion}.`
  );
  for (
    let schemaVersion = currentVersion + 1;
    schemaVersion <= targetVersion;
    schemaVersion++
  ) {
    const migration = migrations[schemaVersion as TargetVersion][dbIdentifier];
    console.log(`Applying migration #${schemaVersion}.`);
    if (migration) {
      await migration.up(db);
    }
    await logMigrationInfo(db, schemaVersion);
  }
};

export const getDbCreatedDate = async (db: Knex) => {
  const infoTableExists = await db.schema.hasTable(migrationTableName);
  if (!infoTableExists) {
    return;
  } else {
    const info = await db<MigrationInfo>(migrationTableName)
      .orderBy('id', 'asc')
      .first();

    return info!.applied;
  }
};
