import { API } from 'aws-amplify';
import { Button, Card, Form } from 'react-bootstrap';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddScenario({ handleAdd }) {
  const [scenarioId, setScenarioId] = useState('');
  const [scenarioName, setScenarioName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = uuidv4();
    API.post('apiDirector', '/director', {
      body: {
        pk: 'SCENARIOS',
        sk: `SCEN_${id}`,
        id: scenarioId,
        name: scenarioName,
        entityType: 'scenario',
      }
    }).then(res => handleAdd());

    setScenarioName('');
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
              placeholder='Enter Name...'
              value={scenarioName}
              autoComplete='off'
              onChange={(e) => setScenarioName(e.target.value)}
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