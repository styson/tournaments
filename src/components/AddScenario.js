import { API } from 'aws-amplify';
import { Button, Card, Form } from 'react-bootstrap';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddScenario({ handleAdd }) {
  const [scenarioId, setScenarioId] = useState('');
  const [scenarioTitle, setScenarioTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = uuidv4();
    API.post('apiTournaments', '/director', {
      body: {
        pk: `s#${id}`,
        sk: `s#${id}`,
        id: scenarioId,
        title: scenarioTitle,
      }
    }).then(res => handleAdd());

    setScenarioTitle('');
    setScenarioId('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Card.Body>
          <Card.Title>Add New Scenario</Card.Title>
            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter Id...'
              value={scenarioId}
              autoComplete='off'
              onChange={(e) => setScenarioId(e.target.value)}
            />

            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter Title...'
              value={scenarioTitle}
              autoComplete='off'
              onChange={(e) => setScenarioTitle(e.target.value)}
            />

            <div className="d-grid gap-2">
              <Button
                size='sm'
                type='submit'
                variant='primary'
              >
                Add Scenario
              </Button>
            </div>
        </Card.Body>
      </Card>
    </Form>
  );
};