import { API } from 'aws-amplify';
import { Button, Card, Form } from 'react-bootstrap';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddTournament({ handleAdd }) {
  const [tourneyName, setTourneyName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = uuidv4();
    API.post('apiDirector', '/director', {
      body: {
        pk: `TOURNAMENTS`,
        sk: `TOUR_${id}`,
        name: tourneyName,
      }
    }).then(res => handleAdd());

    setTourneyName('');
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