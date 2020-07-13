import { AjaxResponse } from 'rxjs/ajax';

export interface ForwarderMessage {
  user_email: string;
  user_data: {
    firstname: string;
    lastname: string;
    street: string;
    house_number: string;
    zip: string;
    country: string;
    date_of_birth: string;
  };
  brand_ids: string[];
  subject: string;
  text: string;
}

export interface ForwarderService {
  forwardEmail: (email: ForwarderMessage) => Promise<string>;
}
