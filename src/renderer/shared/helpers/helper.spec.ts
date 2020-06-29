import { getTranslatedRequestGroupType } from './helper';

describe('helper', () => {
  it('should provide correct german translation for request group type', () => {
    const mockRequestGroupType = 'access';
    const expected = 'Datenauskunft';
    return getTranslatedRequestGroupType(mockRequestGroupType).should.equal(
      expected
    );
  });
});
