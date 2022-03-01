import { API } from 'aws-amplify';
import { Col, Container, Row, Tabs, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Matches from '../components/tournament/Matches';
import Rankings from '../components/tournament/Rankings';
import Standings from '../components/tournament/Standings';

export default function Tournament() {
  let params = useParams();

  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [standings, setStandings] = useState([]);
  const [tournament, setTournament] = useState({});

  const [tab, setTab] = useState('players');

  const getTournamentDetails = async (pk) => {
    setPlayers([]);
    setRounds([]);
    setScenarios([]);

    API.get('apiDirector', '/director/TOURNAMENTS')
      .then(res => {
        setTournament(res.Items.find(_ => _.sk === pk));
        setStandings(tournament.standings || []);
      });

    API.get('apiDirector', `/director/${pk}`)
      .then(res => {
        setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0).sort((a, b) => a.rank > b.rank ? 1 : -1));
        setRounds(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') < 0)).sort((a, b) => a.name > b.name ? 1 : -1));
        setScenarios(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') > 0)).sort((a, b) => a.id > b.id ? 1 : -1));
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
                      <Rankings round={r} players={players} standings={standings} />
                    </div>
                  </Col>
                  <Col md='4' className='mt-2'>
                    <div className='ms-3 me-1'>
                      <Matches round={r} scenarios={scenarios} />
                    </div>
                  </Col>
                  <Col md='4' className='mt-2'>
                    <div className='mx-3'>
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