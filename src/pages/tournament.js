import { API } from 'aws-amplify';
import { Col, Container, Row, Tabs, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Matchups from '../components/Matchups';
import Rankings from '../components/Rankings';
import Results from '../components/Results';
import Standings from '../components/Standings';

export default function Tournament() {
  let params = useParams();

  // const matchups = [];
  // const results = [];

  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [standings, setStandings] = useState([]);
  const [tournament, setTournament] = useState({});

  const [tab, setTab] = useState('players');

  const getTournamentDetails = async (pk) => {
    setPlayers([]);
    setRounds([]);

    API.get('apiDirector', '/director/TOURNAMENTS')
      .then(res => {
        setTournament(res.Items.find(_ => _.sk === pk));
        setStandings(tournament.standings || []);
      });

    API.get('apiDirector', `/director/${pk}`)
      .then(res => {
        setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0).sort((a, b) => a.rank > b.rank ? 1 : -1));
        setRounds(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') < 0)).sort((a, b) => a.name > b.name ? 1 : -1));
        // setScenarios(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') > 0)).sort((a, b) => a.id > b.id ? 1 : -1));
      });
  }

  useEffect(() => {
    getTournamentDetails(params.sk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (rounds.length > 0) {
      setTab(rounds[0].name);
    }
  }, [rounds]);

  return (
    <>
      <Header />
      <Container fluid id='main'>
        <Row>
          <Col md='8' className='mt-3'>
            <h2>{tournament.name}</h2>
          </Col>
        </Row>
        <Row>
          <Tabs activeKey={tab} onSelect={(t) => setTab(t)} id='tabs' className='mt-3'>
            { rounds.map((r, index) => (
              <Tab key={index} eventKey={r.name} title={r.name}>
                <Row>
                  <Col md='3' className='mt-2'>
                    <div className='ms-3 me-1'>
                      <Rankings round={r} players={players} index={index} tab={tab} standings={standings} />
                    </div>
                  </Col>
                  <Col md='3' className='mt-2'>
                    <div className='ms-3 me-1'>
                      <Matchups matchups={r.matchups || []} />
                    </div>
                  </Col>
                  <Col md='3' className='mt-2'>
                    <div className='ms-3 me-1'>
                      <Results results={r.results || []} />
                    </div>
                  </Col>
                  <Col md='3' className='mt-2'>
                    <div className='ms-3 me-1'>
                      <Standings standings={standings} />
                    </div>
                  </Col>
                </Row>
              </Tab>
            ))}
          </Tabs>
        </Row>
     </Container>
    </>
  );
}