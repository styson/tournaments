import { Button, Form, Row } from 'react-bootstrap';
import { Error } from '../styled/Error';
import { getItem, putItem } from '../../dynamo/ApiCalls';
import { Problem } from '../styled/Problem';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Match from './Match';
import React from 'react';

const newMatch = (scenarioList, round) => {
  return {
    p1: {},
    p2: {},
    scenario: {},
    p1Winner: false,
    p2Winner: false,
    noWinner: true,
    p1Allied: false,
    p2Allied: false,
    noSide: true,
    scenarioList,
    round,
    issues: '',
  };
}

const Matches = ({ round, scenarios, roundUpdate }) => {
  const [activePlayers, setActivePlayers] = useState([]);
  const [complete, setComplete] = useState(round.matchesComplete || false);
  const [error, setError] = useState('');
  const [problems, setProblems] = useState([]);
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
      setProblems(['Preview the matches.']);
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

    showError(`Generated matches for ${activePlayers.length} players`);
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
    const rnd = { 
      ...round,
      matches,
    }
    putItem(rnd);
  }

  function addMissingMatches() {
    const players = [...activePlayers];

    matches.forEach((m, n) => {
      const p1 = players.findIndex(p => p.sk === m.p1.sk);
      if (p1 > -1) players.splice(p1, 1);
      const p2 = players.findIndex(p => p.sk === m.p2.sk);
      if (p2 > -1) players.splice(p2, 1);
    });

    if (players.length % 2 === 0 && players.length > 1) {
      showError(`Generated matches for ${players.length} players`);
      let match = {};
      players.forEach((p, n) => {
        if (n === 0 || !!(n && !(n%2))) {
          match = newMatch(scenarioList, round.round);
          match['p1'] = p;
          matches.push(match);
        } else {
          match['p2'] = p;
        }
      })

      setMatches(matches);
      const rnd = {
        ...round,
        matches,
      }
      putItem(rnd);
    } else {
      showError(`No matches to add.`);
    }
  }

  function reset() {
    showError('reset matches');
    setMatches([]);
    setProblems([]);
    const rnd = { 
      ...round,
      matches: [],
    }
    // console.log(rnd.matches);
    putItem(rnd);
  }

  function completeMatches(checked) {
    setComplete(checked);
    const rnd = { 
      ...round,
      matches,
      matchesComplete: checked,
    }
    putItem(rnd);
    roundUpdate(rnd);
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

  function showError(error) {
    setError(error);
    setTimeout(() => {setError('')}, 3000);
  }

  const matchReport = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'letter',
    });

    const headers = ['Player', '', 'Player', '', 'Scenario'];
    const rows = [];

    if (Array.from(matches).length > 0) {

      matches.map(m => {
        const match = [];
        const sides = [];

        if(m.noWinner) {
          match.push(m.p1.name);
          match.push('vs.');
          match.push(m.p2.name);
        } else if (m.p1Winner) {
          match.push(m.p1.name);
          match.push('def.');
          match.push(m.p2.name);
        } else {
          match.push(m.p2.name);
          match.push('def.');
          match.push(m.p1.name);
        }

        if (m.scenario && m.scenario.name > '') {
          match.push('in');
          match.push(`${m.scenario.id}: ${m.scenario.name}`);
        }

        if ((m.p1Winner && m.p1Allied) || (m.p2Winner && m.p2Allied)) {
          sides.push('  as Allied');
          sides.push('');
          sides.push('  as Axis');
        } else if ((m.p1Winner && !m.p1Allied) || (m.p2Winner && !m.p2Allied)) {
          sides.push('  as Axis');
          sides.push('');
          sides.push('  as Allied');
        }

        rows.push(match);
        rows.push(sides);

        return 0;
      });

      doc.autoTable({
        head: [headers],
        body: rows,
      })
    } else {
      doc.text(20, 20, 'No matches yet.');
    }
    doc.save(`Round ${round.round} Matches.pdf`);
  }

  const matchSlips = () => {
    const options = {
      orientation: 'l',
      unit: 'pt',
      format: [400, 300],
    };

    const doc = new jsPDF(options);

    const square = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfBAMAAADtgAsKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURYCAgOnp6e7u7v///9VMnYMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAhSURBVCjPYyACCCkhAQGggLIxElAYFRi0Ahgxhx8wMAAA1nBFxO9N3QoAAAAASUVORK5CYII=";

    if (Array.from(matches).length > 0) {
      matches.map(m => {
        const match = [];

        const headers = [`Round ${round.round}`, 'Winner', 'Allied', 'Axis'];
        match.push([m.p1.name, '', '', '']);
        match.push([m.p2.name, '', '', '']);

        doc.autoTable({
          theme: 'grid',
          headStyles: { fillColor: 220, textColor: 0 },
          head: [headers],
          body: match,
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index > 0) {
              doc.addImage(square, 'JPEG', data.cell.x + 10, data.cell.y + 5, 9, 10)
            }
          },
        })

        const scenarios = [];
        m.scenarioList.forEach((s) => {
          scenarios.push([s.id, s.name, '']);
        });
        if (scenarios.length > 0) {
          scenarios.push(['', '', '']);
          doc.autoTable({
            theme: 'grid',
            body: scenarios,
            didDrawCell: (data) => {
              if (data.section === 'body' && data.column.index === 2) {
                doc.addImage(square, 'JPEG', data.cell.x + 4, data.cell.y + 5, 9, 10)
              }
            },
          });
        }

        doc.addPage(options);
        return 0;
      });

      doc.save(`Round ${round.round} Match Slips.pdf`);
    }
  }

  const previewMatches = () => {
    if (activePlayers.length === 0) {
      showError(`Players are not set for matches.`);
      return;
    }

    let problems = [];
    let matches = [];
    let match = {};

    activePlayers.forEach((p, n) => {
      if (n === 0 || !!(n && !(n%2))) {
        match = newMatch([], round.round);
        match['p1'] = p;
        matches.push(match);
      } else {
        match['p2'] = p;
      }
    });

    matches.forEach((m, n) => {
      // problems.push(`${m.p1.name} vs. ${m.p2.name}`);
      // have they played each other?
      const rounds = Object.keys(m.p1.rounds);

      rounds.forEach((r, n) => {
        const rd = m.p1.rounds[r];
        if (rd.opponent.sk === m.p1.sk || rd.opponent.sk === m.p2.sk) {
          const issue = `${m.p1.name} played ${rd.opponent.name} in Round ${n+1}.`;
          problems.push(issue);
        }
      });
    });

    showError(`Preview for ${activePlayers.length} players found ${problems.length} problems.`);
    setProblems(problems);
  }

  return (
    <Row>
      <Form>
        <Form.Group className='mt-1 float-end' controlId={`completeMatches${round.round}`}>
          <Form.Check
            className={`${matches.length === 0 ? 'd-none' : ''}`}
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
          const matchKey = `${index}${round.round * 10}`;
          return <Match match={m} key={`m${matchKey}`} matchKey={matchKey} index={index} handleSave={saveMatch} />;
        })}
        {matches.length === 0 && (
          <p>Matches have not been<br/> set for {round.name}.</p>
        )}
      </div>
      <div className='d-flex'>
        <Button
          id='reset-matches'
          size='sm'
          className={`flex-grow-1 me-1 mb-2 ${complete || problems.length > 0 ? 'd-none' : ''}`}
          variant='outline-secondary'
          onClick={reset}
          disabled={complete}
        >
          Reset Matches
        </Button>
        <Button
          id='generate-matches'
          size='sm'
          className={`flex-grow-1 me-1 mb-2 ${complete || problems.length > 0 ? 'd-none' : ''}`}
          variant='outline-success'
          onClick={generate}
          disabled={complete}
        >
          Generate Matches
        </Button>
        <Button
          className={`flex-grow-1 me-1 mb-2 ${complete ? 'd-none' : ''}`}
          size='sm'
          variant='outline-primary'
          onClick={previewMatches}
        >
          Preview Matches
        </Button>
        <Button
          className={`flex-grow-2 me-1 mb-2 ${matches.length === 0 ? 'd-none' : ''}`}
          size='sm'
          variant='outline-primary'
          onClick={matchReport}
        >
          Match Summary
        </Button>
        <Button
          className={`flex-grow-2 me-1 mb-2 ${matches.length === 0 ? 'd-none' : ''}`}
          size='sm'
          variant='outline-primary'
          onClick={addMissingMatches}
        >
          Add Missing Matches
        </Button>
        <Button
          className={`flex-grow-2 me-1 mb-2 ${matches.length === 0 ? 'd-none' : ''}`}
          size='sm'
          variant='outline-primary'
          onClick={matchSlips}
        >
          Match Slips
        </Button>
      </div>
      <Error>
        {error}
      </Error>
      <Problem
        className={`${problems.length === 0 ? 'd-none' : ''}`}
      >
        {problems && Object.keys(problems).map(k => {
          console.log(`${problems[k]}`)
          return <li>{problems[k]}</li>
        })}
      </Problem>
    </Row>
  );
}

export default Matches;