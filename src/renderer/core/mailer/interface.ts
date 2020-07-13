import { TaskQueue } from '../google/callQueue';
import { ProfileDetails } from '../../model/clientModel';

export interface Message {
  from: string;
  to: string;
  subject: string;
  text: string;
  cc?: string;
  bcc?: string;
}

export interface Verification {
  verified: boolean;
  error?: 'host' | 'auth';
}

export interface MessageTransport {
  sendMessage: (m: Message, brands?: string[]) => Promise<string>;
  verify: () => Promise<Verification>;
}

export interface Mailer {
  getSmtpTransport: (
    host: string,
    port: number,
    username: string,
    password: string,
    taskQueue?: TaskQueue
  ) => MessageTransport;

  getGoogleTransport: (
    taskQueue: TaskQueue,
    apiClient: any
  ) => MessageTransport;

  getForwarderTransport: (
    taskQueue: TaskQueue,
    profile: ProfileDetails
  ) => MessageTransport;
}
