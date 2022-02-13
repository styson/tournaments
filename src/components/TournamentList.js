import { API } from 'aws-amplify';
import { useState, useEffect } from 'react';
import React from 'react';

const TournamentList = ({ tournament }) => {
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [scenarios, setScenarios] = useState([]);

  const getTournamentDetails = async (sk) => {
    API.get('apiDirector', `/director/${sk}`)
      .then(res => {
        setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0));
        setRounds(res.Items.filter(_ => _.sk.indexOf('ROUN') === 0));
        setScenarios(res.Items.filter(_ => _.sk.indexOf('SCEN') === 0));
      });
  }

  useEffect(() => {
    const getData = async () => {
      await getTournamentDetails(tournament.sk);
    };

    getData();
  });

  return (
    <tr className='tournament'>
      <td>{tournament.name}</td>
      <td>{players.length}</td>
      <td>{scenarios.length}</td>
      <td>{rounds.length}</td>
    </tr>
  );
};

export default TournamentList;