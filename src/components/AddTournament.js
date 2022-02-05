import { API } from 'aws-amplify';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';

export default function AddTournament({ handleAdd }) {
  const [tourneyName, setTourneyName] = useState([]);
  const [tourneyRounds, setTourneyRounds] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    API.post('apiTournaments', '/tournaments', {
      body: {
        name: tourneyName,
        rounds: tourneyRounds,
      }
    }).then(res => handleAdd());

    setTourneyName('');
    setTourneyRounds('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Card.Body>
          <Card.Title>Add New Tournament</Card.Title>
            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter name...'
              value={tourneyName}
              autoComplete='off'
              onChange={(e) => setTourneyName(e.target.value)}
            />

            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter number of rounds...'
              value={tourneyRounds}
              autoComplete='off'
              onChange={(e) => setTourneyRounds(e.target.value)}
            />

            <div className="d-grid gap-2">
              <Button
                size='sm'
                type='submit'
                variant='primary'
              >
                Add Tournament
              </Button>
            </div>
        </Card.Body>
      </Card>
    </Form>
  );
};