import { Button, Form, Row } from 'react-bootstrap';
import { Error } from '../styled/Error';
import { getItem, putItem } from '../../dynamo/ApiCalls';
import { useEffect, useState } from 'react';
import Match from './Match';
import React from 'react';

const newMatch = (scenarioList, round) => {
  return {
    p1: {},
    p2: {},
    scenario: {},
    p1Winner: false,
    p1Side: '', // axis or allied
    p2Side: '', // axis or allied
    scenarioList,
    round,
  };
}

const Matches = ({ round, scenarios, roundUpdate }) => {
  const [activePlayers, setActivePlayers] = useState([]);
  const [complete, setComplete] = useState(round.matchesComplete || false);
  const [matches, setMatches] = useState([]);
  const [scenarioList, setScenarioList] = useState([]);

  useEffect(() => {
    if (round.hasOwnProperty('activePlayers')) {
      setActivePlayers(round['activePlayers']);
    } else {
      setActivePlayers([]);
    }
    if (round.hasOwnProperty('matches')) {
      setMatches(round['matches']);
    } else {
      setMatches([]);
    }
  }, [round]);

  useEffect(() => {
    setScenarioList(scenarios.filter(s => s.sk.indexOf(round.sk) === 0));
  }, [scenarios, round.sk]);

  function getPlayers() {
    const getData = async () => {
      getItem(round.pk, round.sk, updatePlayers);
    };

    getData();
  }

  function updatePlayers(res) {
    console.log('updatePlayers');
    if (res.activePlayers.length > 0) {
      setActivePlayers(res.activePlayers);
    }
  }

  function generate() {
    if (activePlayers.length === 0) {
      showError(`Updating players for matches`);
      getPlayers();
      if (activePlayers.length === 0) return;
    }

    showError(`Generate matches for ${activePlayers.length} players`);
    let matches = [];
    let match = {};
    
    // console.log(scenarios.filter(s => s.sk.indexOf(round.sk) === 0))

    activePlayers.forEach((p, n) => {
      if (n === 0 || !!(n && !(n%2))) {
        match = newMatch(scenarioList, round.round);
        match['p1'] = p;
        matches.push(match);
      } else {
        match['p2'] = p;
      }
    })

    setMatches(matches);
  }

  function reset() {
    showError('reset matches');
    setMatches([]);
  }

  function completeMatches(checked) {
    setComplete(checked);
    const rnd = { 
      ...round,
      matches,
      matchesComplete: checked,
    }
    putItem(rnd);
  }

  function saveMatch(form) {
    matches[form.index] = form;
    const rnd = { 
      ...round,
      matches,
    }
    setMatches(matches);
    putItem(rnd);
    roundUpdate();
  }

  const [error, setError] = useState('');
  function showError(error) {
    setError(error);
    setTimeout(() => {setError('')}, 3000);
  }

  return (
    <Row>
      <Form>
        <Form.Group className='mt-1 float-end' controlId={`completeMatches${round.round}`}>
          <Form.Check
            type='switch' 
            label='Complete'
            checked={complete}
            onChange={(e) => completeMatches(e.currentTarget.checked)}
          />
        </Form.Group>
        <h4>Matches</h4>
      </Form>
      <div>
        {matches.map((m, index) => {
          return <Match match={m} key={index + round.round * 10} matchKey={index + round.round * 10} index={index} handleSave={saveMatch} />;
        })}
        {matches.length === 0 && (
          <p>Matches have not been<br/> set for {round.name}.</p>
        )}
      </div>
      <div className='d-flex'>
        <Button
          id='reset-matches'
          size='sm'
          className='flex-grow-1 me-1 mb-2'
          variant='outline-secondary'
          onClick={reset}
          disabled={complete}
        >
          Reset Matches
        </Button>
        <Button
          id='generate-matches'
          size='sm'
          className='flex-grow-1 ms-1 mb-2'
          variant='outline-success'
          onClick={generate}
          disabled={complete}
        >
          Generate Matches
        </Button>
      </div>
      <Error>
        {error}
      </Error>
    </Row>
  );
}

export default Matches;