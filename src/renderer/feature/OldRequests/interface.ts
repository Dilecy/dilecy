import { RequestGroupState } from '@dilecy/model';

export interface OldRequest {
  id: number;
  brandName: string;
  dateTimeCreated: JSX.Element;
  dateTimeCreatedMoment: moment.Moment;
  requestGroupType: string;
  dueDate: string;
  progressValue: number;
  daysSinceRequest: number;
  snoozeCount: number;
  progress: JSX.Element;
  requestGroupState: RequestGroupState;
  visibleState: string;
  isDue: boolean;
}
