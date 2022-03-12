import { API } from 'aws-amplify';
import { Button } from 'react-bootstrap';
import { GetItems } from '../dynamo/ApiCalls';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import scenarios from '../data/scenarios'

export default function AddScenariosFromFile() {
  const [existingScenarios, setScenarios] = useState([]);

  const refresh = async () => {
    GetItems('SCENARIOS', 'name', setScenarios);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = async (id, name) => {
    const sk = uuidv4();
    API.post('apiDirector', '/director', {
      body: {
        pk: 'SCENARIOS',
        sk: `SCEN_${sk}`,
        id,
        name,
      }
    });
  };

  return (
    <>
      { scenarios.map((s, index) => {
        if(!existingScenarios.find(_ => _.name === s.name)) {
          return (
            <Button
              className='me-2 mb-2'
              key={index}
              onClick={() => add(s.id, s.name)}
            >
              {s.id}: {s.name}
            </Button>
          )
        } else {
          return (
            <span key={index}></span>
          )
        }
      })}
    </>
  )
};
