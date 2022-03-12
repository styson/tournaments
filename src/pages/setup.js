import { API } from 'aws-amplify';
import { Button, ButtonGroup, ButtonToolbar, Col, Container, Dropdown, 
  DropdownButton, Form, FormControl, InputGroup, Row, Table, Tabs, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GetItems } from '../dynamo/ApiCalls';
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

  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [data, setData] = useState({ scenarios: {}, rounds: {}, roundOrder: [] });

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
        setRounds(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') < 0)).sort((a, b) => a.name > b.name ? 1 : -1));
        setScenarios(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') > 0)).sort((a, b) => a.id > b.id ? 1 : -1));
      });
  }

  const getAllPlayers = async () => {
    GetItems('PLAYERS', 'name', setAllPlayers);
  }

  const getAllScenarios = async () => {
    GetItems('SCENARIOS', 'id', setAllScenarios);
  }

  const putTournamentPlayer = async (p) => {
    API.put('apiDirector', '/director', {
      body: {
        pk: `${active.sk}`,
        sk: `${p.sk}`,
        name: p.name,
        rank: p.rank,
        rating: p.rating,
      }
    });
  }

  const refresh = async () => {
    await getTournaments();
  }

  const handleDelete = async (index, pk, sk) => {
    API.del('apiDirector', `/director/object/${pk}/${sk}`)
      .then(res => {
        players.splice(index, 1);

        players.forEach((p, idx) => {
          p.rank = idx+1;
        });

        setPlayers([...players]);
      });
  };

  const addPlayer = async (sk) => {
    if(sk === 0) return;

    const data = allPlayers.find(_ => _.sk === sk);

    const chk = players.length === 0 ? false  : players.find(_ => _.sk === sk);
    if(!chk) {
      const newPlayer = {
        pk: data.pk,
        sk: data.sk,
        name: data.name,
        rank: (players.length + 1),
        rating: data.rating,
      }
      players.push(newPlayer);
      setPlayers([...players]);
    }
  }

  const saveTournament = async (e) => {
    e.preventDefault();
    await players.forEach((p) => putTournamentPlayer(p));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPlayers.length, allScenarios.length]);

  function addRound(roundArray, round) {
    if (!roundArray.includes(round)) {
      roundArray.push(round);
    }
    return roundArray.sort();
  }

  useEffect(() => {
    rounds.forEach((r, idx) => {
      const round = {
        pk: r.pk,
        sk: r.sk,
        name: r.name,
        scenarioSks: [],
      };
      data.rounds[round.sk] = round;
      data.roundOrder = addRound(data.roundOrder, round.sk);
    });
    setData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rounds]);

  useEffect(() => {
    scenarios.forEach((s, idx) => {
      const i = s.sk.indexOf('_SCEN_');
      const roundSk = s.sk.substr(0,i);
      const round = data.rounds[roundSk];
      if (round) {
        data.rounds[roundSk].scenarioSks.push(s.sk.substr(i+1));
      }
    });
    setData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarios]);

  useEffect(() => {
    const round = {
      pk: active.sk,
      sk: 'scenarios',
      name: 'Scenarios',
      scenarioSks: [],
    };

    data.scenarios = {};
    allScenarios.forEach((s, idx) => {
      round.scenarioSks.push(s.sk);
      data.scenarios[s.sk] = { pk: s.pk, sk: s.sk, id: s.id, name: s.name };
    });

    data.rounds[round.sk] = round;
    data.roundOrder = addRound(data.roundOrder, round.sk);
    setData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allScenarios]);

  const tournamentSelected = async (eventKey) => {
    const t = tournaments.find(t => t.sk === eventKey);
    if (t && t.sk === eventKey) {
      setActive(t);
      await getTournamentDetails(t.sk); // the sk is the pk for tournament details
      setPlayerResults([]);
      setTab('players');
    }
  }

  return (
    <>
      <Header />
      <Container fluid id='main'>
        <Row>
          <Col md='8' className='mt-3'>
            <h2>{active.name}</h2>
          </Col>
          <Col md='4' className='mt-3'>
            <ButtonToolbar>
              <DropdownButton
                className='me-4'
                id='dropdown-basic-button' 
                title='Select a Tournament'
                onSelect={tournamentSelected}
              >
                { tournaments.map((t) => (
                  <Dropdown.Item eventKey={t.sk} key={t.sk}>{t.name}</Dropdown.Item>
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
                <Col md='5' className='mt-3'>
                  <h3>Tournament Players</h3>
                  <Table id='playerTable' striped bordered hover size='sm'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>Rank</th>
                        <th>Remove</th>
                      </tr>
                    </thead>            
                    <tbody>
                      {players && players.map(function(d, idx){
                        return (
                          <tr key={idx} data-index={idx}>
                            <td>{d.name}</td>
                            <td>{d.rating}</td>
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
                            <td>
                              <Button 
                                key={`b${d.sk}`}
                                className='float-end'
                                size='sm'
                                title={`${d.pk} ${d.sk}`}
                                variant='outline-secondary'
                                onClick={(e) => {
                                  e.preventDefault();

                                  handleDelete(idx, active.sk, d.sk);
                                }}
                              >
                                X
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
            <Tab eventKey='rounds' title='Rounds'>
              <Rounds tournament={active} data={data} />
            </Tab>
          </Tabs>
        </Row>
      </Container>
    </>
  );
}