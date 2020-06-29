import { useDueDateStatus } from './useDueDateStatus';
import { dueDateProgress, differenceInDays } from './useDueDateStatus';
import moment from 'moment';

describe('useDueDateStatus hook', () => {
  describe('differenceInDays', () => {
    it('should return correct difference between two date strings', () => {
      const mockStartDate = moment();
      const mockEndDate = moment().add(10, 'days');
      const expected = 10;
      return differenceInDays(mockStartDate, mockEndDate).should.equal(
        expected
      );
    });
    it('should return correct difference between two date strings', () => {
      const mockStartDate = moment();
      const mockEndDate = moment().subtract(10, 'days');
      const expected = -10;
      return differenceInDays(mockStartDate, mockEndDate).should.equal(
        expected
      );
    });
  });

  describe('due date progress', () => {
    it('should show correct progress percentage', () => {
      const mockStartDate = moment().subtract(5, 'days');
      const mockEndDate = moment().add(5, 'days');
      const expected = 50;
      return dueDateProgress(mockStartDate, mockEndDate).should.equal(expected);
    });
  });

  describe('useDueDateStatus', () => {
    it('should return an object with correct due date and progress percentage', () => {
      const mockDueDateDays = 30;
      const mockCreatedDate = moment().subtract(10, 'days');

      const mockDueDate = moment(mockCreatedDate)
        .add(mockDueDateDays, 'days')
        .format('DD.MM.YYYY');

      return useDueDateStatus(
        mockCreatedDate,
        mockDueDateDays
      ).should.deep.equal({
        createdTime: mockCreatedDate.format('HH:MM'),
        createdDate: mockCreatedDate.format('DD.MM.YYYY'),
        dueDate: mockDueDate,
        progress: 33
      });
    });
  });
});
