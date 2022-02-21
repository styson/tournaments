import { API } from 'aws-amplify';
import { Button, ButtonGroup, ButtonToolbar, Col, Container, Dropdown, 
  DropdownButton, Form, FormControl, InputGroup, Row, Table, Tabs, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GetItems } from '../dynamo/GetItems';
import Header from '../components/Header';

import Rounds from '../components/Rounds';

export default function Setup() {
  let params = useParams();

  const [tab, setTab] = useState('players');
  const [active, setActive] = useState({ name: '' });
  const [tournaments, setTournaments] = useState([]);

  const [allPlayers, setAllPlayers] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);
  const [playerSearch, setPlayerSearch] = useState('');

  const [allScenarios, setAllScenarios] = useState([]);
  const [scenarioResults, setScenarioResults] = useState([]);
  const [scenarioSearch, setScenarioSearch] = useState('');

  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);

  const getTournaments = async () => {
    API.get('apiDirector', '/director/TOURNAMENTS')
      .then(res => setTournaments(res.Items.sort((a, b) => a.name.localeCompare(b.name))))
      .finally(res => tournamentSelected(params.sk));
  }

  const getTournamentDetails = async (pk) => {
    setPlayers([]);
    setRounds([]);

    API.get('apiDirector', `/director/${pk}`)
      .then(res => {
        setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0).sort((a, b) => a.rank > b.rank ? 1 : -1));
        setRounds(res.Items.filter(_ => _.sk.indexOf('ROUN') === 0).sort((a, b) => a.number > b.number ? 1 : -1));
      });
  }

  const getAllPlayers = async () => {
    GetItems('PLAYERS', 'name', setAllPlayers);
  }

  const getAllScenarios = async () => {
    GetItems('SCENARIOS', 'name', setAllScenarios);
  }

  // const putTournamentScenario = async (s) => {
  //   API.put('apiDirector', '/director', {
  //     body: {
  //       pk: `${active.sk}`,
  //       sk: `${s.sk}`,
  //       id: s.id,
  //       name: s.name,
  //     }
  //   });
  // }

  const putTournamentRound = async (r) => {
    API.put('apiDirector', '/director', {
      body: {
        pk: `${active.sk}`,
        sk: `${r.sk}`,
        number: r.number,
      }
    });
  }

  const putTournamentPlayer = async (p) => {
    API.put('apiDirector', '/director', {
      body: {
        pk: `${active.sk}`,
        sk: `${p.sk}`,
        name: p.name,
        rank: p.rank,
      }
    });
  }

  const refresh = async () => {
    await getTournaments();
  }

  const addPlayer = async (sk) => {
    if(sk === 0) return;

    const data = allPlayers.find(_ => _.sk === sk);

    const chk = players.length === 0 ? false  : players.find(_ => _.sk === sk);
    if(!chk) {
      const newPlayer = {
        pk: data.pk,
        sk: data.sk,
        name: data.name,
        rank: (players.length + 1)
      }
      players.push(newPlayer);
      setPlayers([...players]);
    }
  }

  // const addScenario = async (sk) => {
  //   if(sk === 0) return;
  //   console.log(`addScenario ${sk}`);
  //   const data = allScenarios.find(_ => _.sk === sk);

  //   const chk = scenarios.length === 0 ? false  : scenarios.find(_ => _.sk === sk);
  //   if(!chk) {
  //     const newScenario = {
  //       'pk': data.pk,
  //       'sk': data.sk,
  //       'name': data.name,
  //       'id': data.id
  //     }
  //     scenarios.push(newScenario);
  //     setScenarios([...scenarios]);
  //   }
  // }

  const addRound = async () => {
    const id = uuidv4();
    const newRound = {
      pk: `${active.sk}`,
      sk: `ROUN_${id}`,
      number: rounds.length+1,
    }
    rounds.push(newRound);
    setRounds([...rounds]);
  }

  const saveTournament = async (e) => {
    e.preventDefault();
    await players.forEach((p) => putTournamentPlayer(p));
    await rounds.forEach((r) => putTournamentRound(r));
  }

  const findPlayers = async (e) => {
    e.preventDefault();
    const data = allPlayers.filter(_ => _.name.toLowerCase().indexOf(playerSearch.toLowerCase()) >= 0);
    if (data.length > 0) {
      setPlayerResults(data);
    } else {
      setPlayerResults([{ pk: 0, sk: 0, name: 'Not Found' }]);
    }
    setPlayerSearch('');
  }

  const findScenarios = async (e) => {
    e.preventDefault();
    const data = allScenarios.filter(_ => _.id.toLowerCase().indexOf(scenarioSearch.toLowerCase()) >= 0);
    if (data.length > 0) {
      setScenarioResults(data);
    } else {
      setScenarioResults([{ pk: 0, sk: 0, id: '', name: 'Not Found' }]);
    }
    setScenarioSearch('');
  }

  const moveRow = async (direction, e, rank) => {
    e.preventDefault();

    const thisPlayer = players.findIndex(_ => _.rank === rank);
    const thatPlayer = players.findIndex(_ => _.rank === rank + direction);
    players[thisPlayer].rank = rank + direction;
    players[thatPlayer].rank = rank;
    setPlayers([...players]);
    swapRows(direction, e.target);
  }

  function swapRows(direction, target) {
    let index = target.parentElement.parentElement.parentElement.rowIndex;
    if (!index) index = target.parentElement.parentElement.rowIndex;

    const rows = document.getElementById('playerTable').rows;
    
    if (!rows[index]) {
      console.log(`can't find row[${index}]`, target)
      return;
    }

    const parent = rows[index].parentNode;

    if(direction === -1) {
      // when the row goes up the index will be equal to index - 1
      if(index > 1) parent.insertBefore(rows[index],rows[index - 1]);
    } else {
      // when the row goes down the index will be equal to index + 1
      if(index < rows.length -1) parent.insertBefore(rows[index + 1],rows[index]);
    }
  }

  useEffect(() => {
    const getData = async () => {
      await refresh();

      if(allPlayers.length === 0) await getAllPlayers();
      if(allScenarios.length === 0) await getAllScenarios();
    };

    getData();
  }, [allPlayers.length, allScenarios.length]);

  const tournamentSelected = async (eventKey) => {
    const t = tournaments.find(t => t.sk === eventKey);
    if (t && t.sk === eventKey) {
      setActive(t);
      await getTournamentDetails(t.sk); // the sk is the pk for tournament details
      setPlayerResults([]);
      setScenarioResults([]);
      setTab('players');
    }
  }

  return (
    <>
      <Header />
      <Container fluid id='main'>
        <Row>
          <Col md='9' className='mt-3'>
            <h2>{active.name}</h2>
          </Col>
          <Col md='3' className='mt-3'>
            <ButtonToolbar>
              <DropdownButton
                className='me-4'
                id='dropdown-basic-button' 
                title='Select a Tournament'
                onSelect={tournamentSelected}
              >
                { tournaments.map((p) => (
                  <Dropdown.Item eventKey={p.sk} key={p.sk}>{p.name}</Dropdown.Item>
                ))}
              </DropdownButton>
              <Button
                disabled={active.name === '' ? 'disabled' : '' }
                variant='outline-success'
                onClick={(e) => saveTournament(e)}
              >
                Save
              </Button>
            </ButtonToolbar>            
          </Col>
        </Row>
        <Row>
          <Tabs activeKey={tab} onSelect={(t) => setTab(t)} id='tabs' className='mt-3 mb-3'>
            <Tab eventKey='players' title={`Players - ${players.length}`}>
              <Row>
                <Col md='3' className='mt-3'>
                  <h3>Tournament Players</h3>
                  <Table id='playerTable' striped bordered hover size='sm'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Rank</th>
                      </tr>
                    </thead>            
                    <tbody>
                      {players && players.map(function(d, idx){
                        return (
                          <tr key={idx} data-index={idx}>
                            <td>{d.name}</td>
                            <td>
                              {d.rank}
                              <Button
                                className='float-end'
                                size='sm'
                                variant='outline-secondary'
                                onClick={(e) => moveRow(+1, e, d.rank)}
                                disabled={d.rank === players.length ? 'disabled' : '' }
                              >
                                ⋁
                              </Button>
                              <Button
                                className='float-end'
                                size='sm'
                                variant='outline-secondary'
                                onClick={(e) => moveRow(-1, e, d.rank)}
                                disabled={d.rank === 1 ? 'disabled' : '' }
                              >
                                ⋀
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>            
                  </Table>
                </Col>
                <Col md='3' className='mt-3'>
                  <h4>Add Players</h4>
                  <Form onSubmit={findPlayers}>
                    <InputGroup size='sm' className='mt-3'>
                      <FormControl
                        placeholder='Search by name'
                        onChange={(e) => setPlayerSearch(e.target.value)}
                        value={playerSearch}
                      />
                      <Button
                        type='submit'
                        disabled={active.name === '' ? 'disabled' : '' }
                      >
                        Search
                      </Button>
                      <Button
                        disabled={active.name === '' ? 'disabled' : '' }
                        variant='outline-primary'
                        onClick={() => setPlayerResults([])}
                      >
                        X
                      </Button>
                    </InputGroup>
                  </Form>
                  <ButtonGroup vertical className='mt-3'>
                    { playerResults.map((p, idx) => (
                      <Button
                        className='mb-1'
                        size='sm'
                        key={idx}
                        value={{ pk: p.pk, sk: p.sk }}
                        variant='outline-success'
                        onClick={() => addPlayer(p.sk)}
                      >
                        {p.name}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey='rounds' title={`Rounds - ${rounds.length}`}>
              <Row>
                <Col md='3' className='mt-3'>
                  <h3>Rounds</h3>
                </Col>
                <Col md='3' className='mt-3'>
                  <Button
                    className='mb-1'
                    size='sm'
                    onClick={() => addRound()}
                    disabled={active.name === '' ? 'disabled' : '' }                
                  >
                    Add Round
                  </Button>
                </Col>
              </Row>
              <Row>
                <Rounds rounds={rounds} tournament={active} scenarios={allScenarios} />
              </Row>
            </Tab>
          </Tabs>
        </Row>
      </Container>
    </>
  );
}
