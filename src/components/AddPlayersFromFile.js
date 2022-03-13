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

  const add = async (p) => {
    const id = uuidv4();
    const name = p.name ? p.name : `${p.first_name} ${p.last_name}`;

    API.post('apiDirector', '/director', {
      body: {
        pk: 'PLAYERS',
        sk: `PLAY_${id}`,
        name,
        first: p.first_name || '',
        last: p.last_name || '',
        email: p.email || '',
        phone: p.phone || '',
        user: p.user_name || '',
        location: p.location || '',
      }
    });
  };

  return (
    <>
      { players.map((p, index) => {
        const name = p.name ? p.name : `${p.first_name} ${p.last_name}`;
        if(!existingPlayers.find(_ => _.name === `${p.first_name} ${p.last_name}` || _.name === p.name)) {
          return (
            <Button
              className='me-2 mb-2'
              key={index}
              onClick={() => add(p)}
            >
              {name}
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
