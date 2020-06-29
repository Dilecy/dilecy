import { app } from 'electron';
import { DBClientBackend } from '../../src/renderer/model/db/clientBackend';
import { sealPassword } from '../../src/renderer/core/crypto/password';
import { sealPassword as sealPasswordMock } from '../../src/renderer/core/crypto/password.mock';
import { join } from 'path';
import * as fs from 'fs-extra';
import * as assert from 'assert';

const defaultEmail = {
  emailAddress: 'max@example.com',
  isPrimary: true,
  smtp: 'smtp.example.com',
  smtpUser: 'max',
  smtpPort: 587
};

const defaultProfileDetails = {
  profileName: 'Test',
  firstName: 'Max',
  lastName: 'Mustermann',
  dateOfBirth: '2000-12-24',
  streetName: 'Milchstrasse',
  houseNumber: '1',
  zipCode: '22123',
  city: 'Hamburg',
  state: 'Hamburg',
  country: 'Deutschland'
};

const password = 'password';
const emailPassword = 'secret';

async function runTest() {
  const dbFolder = join(__dirname, 'dbfolder');
  if (fs.existsSync(dbFolder)) {
    fs.removeSync(dbFolder);
  }
  fs.emptyDirSync(dbFolder);
  const clientBackend = new DBClientBackend(dbFolder);

  const profiles = await clientBackend.getProfiles();
  assert.ok(profiles.length === 0);

  const sealedProfilePassword = sealPassword(password);
  const sealedProfilePasswordB = sealPasswordMock(password + 'B');
  const { profile, profileDetails } = await clientBackend.createProfile(
    sealedProfilePassword,
    {
      ...defaultProfileDetails,
      emailAccounts: [
        {
          ...defaultEmail,
          encyptedPassword: await sealedProfilePassword.encrypt(emailPassword)
        }
      ]
    }
  );
  assert.ok(profile.profileName === 'Test');
  const details = await clientBackend.getProfileDetails(
    profile,
    sealedProfilePassword
  );
  assert.deepEqual(details, profileDetails);

  const changed = await clientBackend.changeProfilePassword(
    profile,
    sealedProfilePassword,
    sealedProfilePasswordB
  );
  assert.notDeepEqual(changed.profile, profile);
  assert.equal(
    await sealedProfilePasswordB.decrypt(changed.profile.encryptionKey),
    await sealedProfilePassword.decrypt(profile.encryptionKey)
  );
  assert.equal(
    await sealedProfilePasswordB.decrypt(
      changed.profileDetails.emailAccounts[0].encyptedPassword
    ),
    emailPassword
  );
  const changedBack = await clientBackend.changeProfilePassword(
    changed.profile,
    sealedProfilePasswordB,
    sealedProfilePassword
  );
  assert.equal(
    await sealedProfilePassword.decrypt(changedBack.profile.encryptionKey),
    await sealedProfilePassword.decrypt(profile.encryptionKey)
  );
  assert.equal(
    await sealedProfilePassword.decrypt(
      changedBack.profileDetails.emailAccounts[0].encyptedPassword
    ),
    await sealedProfilePassword.decrypt(
      profileDetails.emailAccounts[0].encyptedPassword
    )
  );
  delete profile.encryptionKey;
  delete changedBack.profile.encryptionKey;
  delete profileDetails.emailAccounts[0].encyptedPassword;
  delete changedBack.profileDetails.emailAccounts[0].encyptedPassword;
  assert.deepEqual(changedBack.profileDetails, profileDetails);
}

runTest()
  .then(() => console.log('Test passed.'))
  .catch(e => console.log('Test failed: ', e))
  .finally(() => {
    app.quit();
  });
