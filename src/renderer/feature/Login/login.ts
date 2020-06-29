import { SealedPassword } from '../../core/crypto/interface';

export class LoginSystem {
  private _sealedPassword?: SealedPassword;

  get sealedPassword(): SealedPassword {
    if (!this._sealedPassword)
      throw new Error('SealedPassword requested while not logged in');
    return this._sealedPassword;
  }

  set sealedPassword(sp: SealedPassword) {
    this._sealedPassword = sp;
  }

  logout() {
    this._sealedPassword = undefined;
  }
}
