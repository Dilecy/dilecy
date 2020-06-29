export const profileDetailsSchema = {
  type: 'object',
  required: ['profileName', 'emailAccounts'],

  properties: {
    id: { type: 'integer' },
    profileName: { type: 'string' },
    firstName: { type: ['string', 'null'] },
    lastName: { type: ['string', 'null'] },
    dateOfBirth: { type: ['string', 'null'] },
    streetName: { type: ['string', 'null'] },
    houseNumber: { type: ['string', 'null'] },
    zipCode: { type: ['string', 'null'] },
    city: { type: ['string', 'null'] },
    state: { type: ['string', 'null'] },
    country: { type: ['string', 'null'] },
    lastLogin: { type: ['string', 'null'] },
    rating: { type: ['integer', 'null'] },
    ratingId: { type: ['integer', 'null'] },
    ratingPassword: { type: ['string', 'null'] },
    emailAccounts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['emailAddress', 'isPrimary', 'smtp', 'encyptedPassword'],
        properties: {
          emailAddress: { type: 'string' },
          isPrimary: { type: 'boolean' },
          smtp: { type: 'string' },
          smtpUser: { type: 'string' },
          smtpPort: { type: 'integer' },
          encyptedPassword: { type: 'string' }
        }
      }
    }
  }
};
