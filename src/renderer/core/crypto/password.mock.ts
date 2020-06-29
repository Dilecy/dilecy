import { PasswordSealer, RandomGenerator } from './interface';

export const sealPassword: PasswordSealer = password => ({
  encrypt: async (str: string) => str,
  decrypt: async (encryptedKey: string) => encryptedKey,
  hashPassword: async () => password,
  matchesHash: (hash: string) => password === hash
});

export const rng: RandomGenerator = {
  generateKey: async () => {
    return 'ENCRYPTION_KEY';
  },
  generateVisitorId: async () => {
    return '1234123412341234';
  }
};
