import { API } from 'aws-amplify';
import { Button } from 'react-bootstrap';
import { GetItems } from '../dynamo/ApiCalls';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import players from '../data/players'

export default function AddPlayersFromFile() {
  const [existingPlayers, setPlayers] = useState([]);

  const refresh = async () => {
    GetItems('PLAYERS', 'name', setPlayers);
  }

  useEffect(() => {
    refresh();
  }, []);

  const add = async (name) => {
    const id = uuidv4();
    API.post('apiDirector', '/director', {
      body: {
        pk: 'PLAYERS',
        sk: `PLAY_${id}`,
        name,
      }
    });
  };

  return (
    <>
      { players.map((p, index) => {
        if(!existingPlayers.find(_ => _.name === p.name)) {
          return (
            <Button
              className='me-2 mb-2'
              key={index}
              onClick={() => add(p.name)}
            >
              {p.name}
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
