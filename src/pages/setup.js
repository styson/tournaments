import { API } from 'aws-amplify';
import { Box } from '../components/styled/Box';
import { PlayerList } from '../components/styled/Lists';
import { Button, ButtonGroup, ButtonToolbar, Col, Container, Dropdown, 
  DropdownButton, Form, FormControl, InputGroup, Row, Tabs, Tab } from 'react-bootstrap';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { GetItems } from '../dynamo/ApiCalls';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import RankedPlayer from '../components/tournament/RankedPlayer';
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

  // const handleDelete = async (index, pk, sk) => {
  //   API.del('apiDirector', `/director/object/${pk}/${sk}`)
  //     .then(res => {
  //       players.splice(index, 1);

  //       players.forEach((p, idx) => {
  //         p.rank = idx+1;
  //       });

  //       setPlayers([...players]);
  //     });
  // };

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

  const reorder = (source, destination, draggableId) => {
    const player = players.find(p => p.sk === draggableId);
    players.splice(source.index, 1);
    players.splice(destination.index, 0, player);
  };

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    reorder(source, destination, draggableId);
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
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='activeDrop'>
                      {(provided, snapshot) => { 
                        return (
                          <Box>
                            <PlayerList
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              isDragging={snapshot.isDragging}                  
                              isDraggingOver={snapshot.isDraggingOver}
                            >
                              {players && players.map((p, index) => {
                                p.rank = index + 1;
                                return <RankedPlayer key={p.sk} player={p} index={index} showRank={true} showRating={true} />;
                              })}
                              {provided.placeholder}
                            </PlayerList>
                          </Box>
                         )
                      }}
                    </Droppable>
                  </DragDropContext>
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