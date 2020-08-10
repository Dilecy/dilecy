import { Message } from '../mailer/interface';
import { defer } from 'rxjs';
import { TaskQueue } from '../google/callQueue';
import { ProfileDetails } from '../../model/clientModel';
import { ForwarderMessage } from '../api/forwarder-interface';
import { createForwarderService } from '../api/forwarder-service';
import { getForwarderServerUrl } from '../../shared/utils/environment';

export const forwarderMailer = {
  async sendMail(
    m: Message,
    queue: TaskQueue,
    profile: ProfileDetails,
    brandIds: string[]
  ) {
    const payload: ForwarderMessage = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_email: profile.emailAccounts[0]!.emailAddress,
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_data: {
        firstname: profile.firstName,
        lastname: profile.lastName,
        street: profile.streetName,
        // eslint-disable-next-line @typescript-eslint/camelcase
        house_number: profile.houseNumber,
        zip: profile.zipCode,
        country: profile.country,
        // eslint-disable-next-line @typescript-eslint/camelcase
        date_of_birth: profile.dateOfBirth
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      brand_ids: brandIds,
      subject: m.subject,
      text: m.text
    };
    const forwarder = createForwarderService(getForwarderServerUrl());

    const operation = defer(() => forwarder.forwardEmail(payload));

    return await queue
      .push({
        id: `${m.from}-${m.to}-${new Date().getTime()}`,
        operation
      })
      .toPromise();
  }
};
