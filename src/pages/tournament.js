import { API } from 'aws-amplify';
import { Col, Container, Row, Tabs, Tab } from 'react-bootstrap';
import { putItem } from '../dynamo/ApiCalls';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Matches from '../components/tournament/Matches';
import Rankings from '../components/tournament/Rankings';
import Standings from '../components/tournament/Standings';

export default function Tournament() {
  const params = useParams();

  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [standings, setStandings] = useState({});
  const [tournament, setTournament] = useState({});
  const [orderedPlayers, setOrderedPlayers] = useState([]);

  const [tab, setTab] = useState('players');

  const getTournamentDetails = async (pk) => {
    setPlayers([]);
    setRounds([]);
    setScenarios([]);

    API.get('apiDirector', '/director/TOURNAMENTS')
      .then(res => {
        setTournament(res.Items.find(_ => _.sk === pk));
        setStandings(tournament.standings || {});
      })
      .then(res => {
        API.get('apiDirector', `/director/${pk}`)
          .then(res => {
            // setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0).sort((a, b) => a.rank > b.rank ? 1 : -1));
            setPlayers(res.Items.filter(_ => _.sk.indexOf('PLAY') === 0).sort((a, b) => a.name > b.name ? 1 : -1));
            setRounds(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') < 0)).sort((a, b) => a.name > b.name ? 1 : -1));
            setScenarios(res.Items.filter(_ => (_.sk.indexOf('ROUN') === 0 && _.sk.indexOf('SCEN') > 0)).sort((a, b) => a.id > b.id ? 1 : -1));
          });
      });
  }

  function roundUpdate() {
    updateStandings();
  }

  function updateStandings() {
    if (players.length === 0 || rounds.length === 0) return;
    console.log('updateStandings', players.length, rounds.length)

    let cs = {};
    players.forEach((p, n) => {
      // console.log(`adding ${p.name}`);
      cs[p.sk] = {
        pk: p.pk,
        sk: p.sk,
        name: p.name,
        rank: 0,
        points: 0,
        wins: 0,
        rounds: {},        
      };
    });

    rounds.forEach((r, n) => {
      // console.log(`round ${r.round}`);
      if (r.matches === undefined) {
        return;
      }

      if (!r.hasOwnProperty('activePlayers')) {
        r.activePlayers = [];
      }
      if (!r.hasOwnProperty('extraPlayers')) {
        r.extraPlayers = [];
      }
      if (r.activePlayers.length === 0 && r.extraPlayers.length === 0) {
        r.activePlayers = players;
        putItem(r);
      }

      if (r.matches !== undefined) {
        r.matches.forEach((m, x) => {
          // console.log(`match ${x} ${m.p1.name} vs ${m.p2.name}`);
          if (m.p1Winner) {
            cs[m.p1.sk].wins += 1;
            cs[m.p1.sk].points += 10 + cs[m.p2.sk].wins;
          } else {
            cs[m.p2.sk].wins += 1;
            cs[m.p2.sk].points += 10 + cs[m.p1.sk].wins;
          }

          cs[m.p1.sk].rank = r.activePlayers.find(_ => _.sk === m.p1.sk).rank;
          cs[m.p2.sk].rank = r.activePlayers.find(_ => _.sk === m.p2.sk).rank;

          const p1Game = {
            win: m.p1Winner ? 1 : 0,
            scenario: m.scenario,
            side: m.p1Side,
            opponent: m.p2,
          }
          if(cs[m.p1.sk] === undefined) {
            cs[m.p1.sk] = { name: m.p1.name, rank: m.p1.rank, rounds: {} };
          }
          cs[m.p1.sk].rounds[`${r.round}`] = p1Game;

          const p2Game = {
            win: !m.p1Winner ? 1 : 0,
            scenario: m.scenario,
            side: m.p2Side,
            opponent: m.p1,
          }
          if(cs[m.p2.sk] === undefined) {
            cs[m.p2.sk] = { name: m.p2.name, rank: m.p2.rank, rounds: {} };
          }
          cs[m.p2.sk].rounds[`${r.round}`] = p2Game;
        });
        if (r['extraPlayers'] !== undefined) {
          r['extraPlayers'].forEach((m, x) => {
            const missedRound = {
              win: 0, scenario: { name: 'No game this round.' },
              side: '', opponent: {},
            }
            cs[m.sk].rounds[`${r.round}`] = missedRound;
            cs[m.sk].rank = m.rank;
          });
        }
      }
    });

    const pl = [];
    const s = Object.keys(cs);
    s.forEach(sk => {
      const p = cs[sk];
      const record = {
        pk: p.pk,
        sk: p.sk,
        name: p.name,
        rank: p.rank,
        points: p.points,
        wins: p.wins,
        sort: 0,
        rounds: {},
      };

      const rds = Object.keys(p.rounds);
      rds.forEach(r => {
        const rd = p.rounds[r];
        record.rounds[r] = { win: rd.win, opp: rd.opponent.name || '' };
      });

      pl.push(record)
    });

    const newOrderedPlayers = pl.sort((a, b) => {
      if (a.points === b.points) {
        return a.rank > b.rank ? 1 : -1;  
      }
      return a.points < b.points ? 1 : -1;
    });

    setOrderedPlayers(newOrderedPlayers);

    const tourney = { 
      ...tournament,
      standings: cs,
    }
    setTournament(tourney);

    putItem(tourney);
    // console.log(JSON.stringify(tourney.standings))
  }

  useMemo(() => {
    updateStandings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, rounds]);

  useEffect(() => {
    getTournamentDetails(params.sk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.sk]);

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
          <Col md='7' className='mt-3'>
            <Tabs activeKey={tab} onSelect={(t) => setTab(t)} id='tabs' className='mt-3'>
              { rounds.map((r, index) => (
                <Tab key={index} eventKey={r.name} title={r.name}>
                  <Row>
                    <Col md='5' className='mt-2'>
                      <div className='ms-3 me-1'>
                        <Rankings round={r} players={players} standings={standings} tournament={tournament} />
                      </div>
                    </Col>
                    <Col md='7' className='mt-2'>
                      <div className='ms-3 me-1'>
                        <Matches round={r} scenarios={scenarios} roundUpdate={roundUpdate} />
                      </div>
                    </Col>
                  </Row>
                </Tab>
              ))}
            </Tabs>
          </Col>
          <Col md='5' className='mt-3'>
            <div className='mx-3'>
              <Standings players={orderedPlayers} />
            </div>
          </Col>
        </Row>
     </Container>
    </>
  );
}