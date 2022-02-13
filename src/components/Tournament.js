import { API } from 'aws-amplify';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import React from 'react';

const Tournament = ({ tournament, handleDelete }) => {
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [scenarios, setScenarios] = useState([]);

  const [canDelete, setCanDelete] = useState(false);

  const getTournamentDetails = async (sk) => {
    API.get('apiDirector', `/director/${sk}`)
      .then(res => {
        setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0));
        setRounds(res.Items.filter(_ => _.sk.indexOf('ROUN') === 0));
        setScenarios(res.Items.filter(_ => _.sk.indexOf('SCEN') === 0));
        setCanDelete(players.length + scenarios.length + rounds.length === 0);
      });
  }

  useEffect(() => {
    const getData = async () => {
      await getTournamentDetails(tournament.sk);
    };

    getData();
  }, []);

  return (
    <tr className='tournament'>
      <td>
        <Link
          style={{ textDecoration: 'none' }}
          to={`/setup/${tournament.sk}`}
          key={tournament.sk}
        >
          {tournament.name}
        </Link>        
      </td>
      <td>{players.length}</td>
      <td>{scenarios.length}</td>
      <td>{rounds.length}</td>
      <td className=''>
        <Button 
          size='sm'
          variant='outline-secondary'
          onClick={() => handleDelete(tournament.pk,tournament.sk)}
          disabled={!canDelete}
        >
          X
        </Button>
      </td>
    </tr>
  );
};

export default Tournament;