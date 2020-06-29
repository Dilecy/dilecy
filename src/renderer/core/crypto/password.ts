import * as openpgp from 'openpgp';
import bcrypt from 'bcrypt';
import { PasswordSealer, RandomGenerator } from './interface';

const HASH_ROUNDS = 10;

async function encrypt(str: string, password: string) {
  const options = {
    message: openpgp.message.fromText(str),
    passwords: [password],
    armor: true
  };
  const encrypted = await openpgp.encrypt(options);
  return encrypted.data.toString();
}

async function decrypt(encryptedString: string, password: string) {
  const decrypted = await openpgp.decrypt({
    message: await openpgp.message.readArmored(encryptedString),
    passwords: [password],
    format: 'utf8',
    streaming: false
  });
  return decrypted.data as string;
}

export const rng: RandomGenerator = {
  generateKey: async () => {
    const key = await openpgp.crypto.random.getRandomBytes(32);
    return key.join('');
  },
  generateVisitorId: async () => {
    const id = await openpgp.crypto.random.getRandomBytes(8);
    return openpgp.util.Uint8Array_to_hex(id);
  }
};

export const sealPassword: PasswordSealer = password => ({
  encrypt: (str: string) => encrypt(str, password),
  decrypt: (encryptedKey: string) => decrypt(encryptedKey, password),
  hashPassword: () => bcrypt.hash(password, HASH_ROUNDS),
  matchesHash: (hash: string) => bcrypt.compareSync(password, hash)
});
