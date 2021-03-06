import { API } from 'aws-amplify';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import React from 'react';

const Tournament = ({ tournament, handleDelete }) => {
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);

  const [canDelete, setCanDelete] = useState(false);

  const getTournamentDetails = async (sk) => {
    API.get('apiDirector', `/director/${sk}`)
      .then(res => {
        setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0));
        // setRounds(res.Items.filter(_ => _.sk.indexOf('ROUN') === 0));
        setRounds(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') < 0)).sort((a, b) => a.name > b.name ? 1 : -1));
        setCanDelete(players.length + rounds.length === 0);
      });
  }

  useEffect(() => {
    const getData = async () => {
      await getTournamentDetails(tournament.sk);
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <td>
        {rounds.length}
        <Button 
          size='sm'
          className='float-end me-2'
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