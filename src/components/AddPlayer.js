import { API } from 'aws-amplify';
import { Button, Card, Form } from 'react-bootstrap';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddPlayer({ handleAdd }) {
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = uuidv4();
    API.post('apiDirector', '/director', {
      body: {
        pk: 'PLAYERS',
        sk: `PLAY_${id}`,
        name: playerName,
        email: playerEmail,
        entityType: 'player',
      }
    }).then(res => handleAdd());

    setPlayerName('');
    setPlayerEmail('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Card.Body>
          <Card.Title>Add New Player</Card.Title>
            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter Name...'
              value={playerName}
              autoComplete='off'
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter Email...'
              value={playerEmail}
              autoComplete='off'
              onChange={(e) => setPlayerEmail(e.target.value)}
            />
            <div className="d-grid gap-2">
              <Button
                size='sm'
                type='submit'
                variant='primary'
              >
                Add Player
              </Button>
            </div>
        </Card.Body>
      </Card>
    </Form>
  );
};