import { API } from 'aws-amplify';
import { Button, ButtonGroup, ButtonToolbar, Col, Container, Dropdown, 
  DropdownButton, Form, FormControl, InputGroup, Row, Table, Tabs, Tab } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header';

export default function Setup() {
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
  const [scenarios, setScenarios] = useState([]);

  const getTournaments = async () => {
    API.get('apiDirector', '/director/TOURNAMENTS')
      .then(res => setTournaments(res.Items.sort((a, b) => a.name.localeCompare(b.name))));
  }

  const getTournamentDetails = async (pk) => {
    API.get('apiDirector', `/director/${pk}`)
      .then(res => {
        setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0));
        setRounds(res.Items.filter(_ => _.sk.indexOf('ROUN') === 0));
        setScenarios(res.Items.filter(_ => _.sk.indexOf('SCEN') === 0));
      });
  }

  const getAllPlayers = async () => {
    API.get('apiDirector', '/director/PLAYERS')
      .then(res => setAllPlayers(res.Items.sort((a, b) => a.name.localeCompare(b.name))));
  }

  const getAllScenarios = async () => {
    API.get('apiDirector', '/director/SCENARIOS')
      .then(res => setAllScenarios(res.Items.sort((a, b) => a.name.localeCompare(b.name))));
  }

  const putTournamentScenario = async (s) => {
    API.put('apiDirector', '/director', {
      body: {
        pk: `${active.sk}`,
        sk: `${s.sk}`,
        id: s.id,
        name: s.name,
      }
    });
  }

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
        'pk': data.pk,
        'sk': data.sk,
        'name': data.name,
        'rank': (players.length + 1)
      }
      players.push(newPlayer);
      setPlayers([...players]);
    }
  }

  const addScenario = async (sk) => {
    if(sk === 0) return;
    console.log(`addScenario ${sk}`);
    const data = allScenarios.find(_ => _.sk === sk);

    const chk = scenarios.length === 0 ? false  : scenarios.find(_ => _.sk === sk);
    if(!chk) {
      const newScenario = {
        'pk': data.pk,
        'sk': data.sk,
        'name': data.name,
        'id': data.id
      }
      scenarios.push(newScenario);
      setScenarios([...scenarios]);
    }
  }

  const addRound = async () => {
    console.log(`add round ${rounds.length+1}`);
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
    console.log(`Update ${active.name}`);
    await scenarios.forEach((s) => putTournamentScenario(s));
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
    setActive(t);
    await getTournamentDetails(t.sk); // the sk is the pk for tournament details
    setPlayerResults([]);
    setScenarioResults([]);
    setTab('players');
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
          <Tabs activeKey={tab} onSelect={(t) => setTab(t)} id="tabs" className="mt-3 mb-3">
            <Tab eventKey="players" title="Players">
              <Row>
                <Col md='3' className='mt-3'>
                  <h3>Tournamant Players</h3>
                  <Table striped bordered hover size='sm'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Rank</th>
                      </tr>
                    </thead>            
                    <tbody>
                      {players && players.map(function(d, idx){
                        return (
                          <tr key={idx}>
                            <td>{d.name}</td>
                            <td>{d.rank}</td>
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
                        onClick={(e) => addPlayer(p.sk)}
                      >
                        {p.name}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="scenarios" title="Scenarios">
              <Row>
                <Col md='3' className='mt-3'>
                  <h3>Scenarios</h3>
                  <Table striped bordered hover size='sm'>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Name</th>
                      </tr>
                    </thead>            
                    <tbody>
                      {scenarios && scenarios.map(function(d, idx){
                        return (
                          <tr key={idx}>
                            <td>{d.id}</td>
                            <td>{d.name}</td>
                          </tr>
                        )
                      })}              
                    </tbody>            
                  </Table>
                </Col>
                <Col md='3' className='mt-3'>
                  <h4>Add Scenarios</h4>
                  <Form onSubmit={findScenarios}>
                    <InputGroup size='sm' className='mt-3'>
                      <FormControl
                        placeholder='Search by scenario id'
                        onChange={(e) => setScenarioSearch(e.target.value)}
                        value={scenarioSearch}
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
                        onClick={() => setScenarioResults([])}
                      >
                        X
                      </Button>
                    </InputGroup>
                  </Form>
                  <ButtonGroup vertical className='mt-3'>
                    { scenarioResults.map((s, idx) => (
                      <Button
                        className='mb-1'
                        size='sm'
                        key={idx}
                        value={{ pk: s.pk, sk: s.sk }}
                        variant='outline-success'
                        onClick={(e) => addScenario(s.sk)}
                      >
                        {s.id}{s.id ? ': ' : ''}{s.name}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="rounds" title="Rounds">
              <Row>
                <Col md='3' className='mt-3'>
                  <h3>Rounds</h3>
                </Col>
                <Col md='3' className='mt-3'>
                  <Button
                    className='mb-1'
                    size='sm'
                    onClick={(e) => addRound()}
                    disabled={active.name === '' ? 'disabled' : '' }                
                  >
                    Add Round
                  </Button>
                </Col>
              </Row>
              <Row>
                {rounds && rounds.map(function(d, idx){
                  return (
                  <Col md='3' className='mt-3' key={idx}>
                    <Table striped bordered hover size='sm'>
                      <thead>
                        <tr>
                          <th>Round {d.number}</th>
                        </tr>
                      </thead>            
                      <tbody>
                        <tr>
                        </tr>
                      </tbody>            
                    </Table>
                  </Col>
                  )
                })}              
              </Row>
            </Tab>
          </Tabs>
        </Row>
      </Container>
    </>
  );
}
