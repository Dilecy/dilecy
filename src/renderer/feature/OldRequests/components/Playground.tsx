import React from 'react';
import { RequestGroup } from '@dilecy/model/clientModel';
import { useDispatch } from 'react-redux';
import { testActionToUpdateRequestGroup } from '../actions';

// Component for testing purposes only

interface PlaygroundProps {
  requestGroups: RequestGroup[];
}

const logToConsole = (data: RequestGroup[]) => {
  console.table(data);
};

const Playground: React.FC<PlaygroundProps> = ({ requestGroups }) => {
  const dispatch = useDispatch();
  const [error, setError] = React.useState('');
  const [state, setState] = React.useState({
    id: 0,
    dateTime: '',
    snoozeCount: 0
  });
  const handleFormSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const dateTimeFormatted = new Date(state.dateTime).toISOString();
    dispatch(
      testActionToUpdateRequestGroup({
        id: state.id,
        dateTimeCreated: dateTimeFormatted,
        snoozeCount: +state.snoozeCount
      })
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name, value, 'name and value');
    if (state.id < 0) {
      setError('Please enter correct id value.');
    } else if (state.snoozeCount < 0) {
      setError('Invalid snooze count');
    } else {
      setState({ ...state, [name]: value });
    }
  };

  return (
    <>
      <p>Test Playground (Will show up only in development environment)</p>
      <button
        onClick={() => logToConsole(requestGroups)}
        style={{ cursor: 'pointer', padding: '1rem', background: '#bada55' }}
      >
        Click here to see old requests data in console
      </button>

      <form>
        <input
          type="text"
          placeholder="Enter id of request group"
          name="id"
          onChange={handleChange}
        />
        <input
          type="date"
          placeholder="select a date"
          name="dateTime"
          onChange={handleChange}
        />
        <input
          type="phone"
          placeholder="enter snooze count"
          name="snoozeCount"
          onChange={handleChange}
        />
        <input type="submit" onClick={handleFormSubmit} value="submit" />
      </form>

      <p style={{ color: 'red' }}>{error}</p>
    </>
  );
};

export default Playground;
