import Knex from 'knex';
import path from 'path';
import fs from 'fs';
import * as CM from '../clientModel';
import { migrate } from './migrations';

const metaDbPath = (dbFolder: string) => path.join(dbFolder, 'metadb.sqlite');
const profileDbPath = (dbFolder: string, profile: CM.Profile) =>
  path.join(dbFolder, `profile_${profile.id}.sqlite`);

export class DatabaseFactory {
  dbFolder: string;

  constructor(dbFolder: string) {
    this.dbFolder = dbFolder;
  }

  async connectToMetaDb() {
    const metaDb = Knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: metaDbPath(this.dbFolder)
      }
    });
    await migrate(metaDb, 'metaDb');
    return metaDb;
  }

  async connectToProfileDb(profile: CM.Profile, key: string) {
    const profileDb = Knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: profileDbPath(this.dbFolder, profile)
      },
      pool: {
        afterCreate: (
          conn: {
            run: Function;
          },
          done: Function
        ) => {
          conn.run(`PRAGMA KEY = '${key}'`);
          done();
        }
      }
    });
    await migrate(profileDb, 'profileDb');
    return profileDb;
  }

  async deleteProfileDb(profile: CM.Profile) {
    const fileName = profileDbPath(this.dbFolder, profile);
    fs.unlink(fileName, function(err) {
      if (err && err.code == 'ENOENT') {
        // file doesn't exist
        console.info("File doesn't exist");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error(`${err} occurred while trying to delete`);
      } else {
        console.info(`removed ${fileName}`);
      }
    });
  }
}
