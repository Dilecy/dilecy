import { ForwarderService, ForwarderMessage } from './forwarder-interface';
import { postJSON } from './http-service';

export const createForwarderService = (
  apiBaseUrl: string
): ForwarderService => ({
  forwardEmail: async (message: ForwarderMessage) => {
    const response = await postJSON(`${apiBaseUrl}/forwardings`, message);
    return response.id;
  }
});
