import moment from 'moment';

/**
 * Returns difference between two dates in days
 * @param startDate
 * @param endDate
 */
export const differenceInDays = (
  startDate: moment.Moment,
  endDate: moment.Moment
): number => {
  return Math.floor(moment.duration(endDate.diff(startDate)).asDays());
};

/**
 *
 * @param createdDate
 * @param dueDate
 */
export const dueDateProgress = (
  createdDate: moment.Moment,
  dueDate: moment.Moment
): number => {
  const currentDate = moment().startOf('day');
  if (differenceInDays(currentDate, dueDate) < 1) return 100;
  const daysPast = Math.abs(differenceInDays(createdDate, currentDate)) + 1; //including current date
  const duration = differenceInDays(createdDate, dueDate);
  const progress = (daysPast / duration) * 100;
  return Math.floor(progress);
};

/**
 *
 * @param date
 * @param durationInDays
 */
export const useDueDateStatus = (
  createdDate: moment.Moment,
  durationInDays: number
) => {
  const dueDate = moment(createdDate).add(durationInDays, 'days');
  return {
    createdTime: moment(createdDate).format('HH:MM'),
    createdDate: moment(createdDate).format('DD.MM.YYYY'),
    dueDate: dueDate.format('DD.MM.YYYY'),
    progress: dueDateProgress(moment(createdDate), dueDate)
  };
};
