import { API } from 'aws-amplify';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import React from 'react';

const TournamentList = ({ tournament }) => {
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);

  const getTournamentDetails = async (sk) => {
    API.get('apiDirector', `/director/${sk}`)
      .then(res => {
        setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0));
        // setRounds(res.Items.filter(_ => _.sk.indexOf('ROUN') === 0));
        setRounds(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') < 0)).sort((a, b) => a.name > b.name ? 1 : -1));
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
          to={`/tournament/${tournament.sk}`}
          key={tournament.sk}
        >
          {tournament.name}
        </Link>        
      </td>
      <td>{players.length}</td>
      <td>{rounds.length}</td>
    </tr>
  );
};

export default TournamentList;