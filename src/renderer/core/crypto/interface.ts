export interface SealedPassword {
  encrypt: (str: string) => Promise<string>;
  decrypt: (encryptedKey: string) => Promise<string>;
  hashPassword: () => Promise<string>;
  matchesHash: (hash: string) => boolean;
}

export type PasswordSealer = (password: string) => SealedPassword;

export interface RandomGenerator {
  generateKey(): Promise<string>;
  generateVisitorId(): Promise<string>;
}
