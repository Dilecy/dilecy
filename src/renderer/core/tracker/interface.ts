export type TrackingIdResolver = () => string | undefined;

export interface Tracker {
  setIdResolver: (tir: TrackingIdResolver) => void;
  pageVisit: (url: string, action: string) => void;
  event: (
    category: string,
    action: string,
    name?: string,
    value?: number
  ) => void;
}
