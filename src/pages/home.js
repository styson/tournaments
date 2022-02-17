import { Col, Container, Row, Table } from 'react-bootstrap';
import { GetItems } from '../dynamo/GetItems';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import TournamentList from '../components/TournamentList';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    GetItems('TOURNAMENTS', 'name', setTournaments);
  }, []);

  return ( 
    <>
      <Header />
      <Container fluid id="main">
        <Row>
          <Col md={3}>
            <h1>Home</h1>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <Table striped bordered hover size='sm'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Players</th>
                  <th>Scenarios</th>
                  <th>Rounds</th>
                </tr>
              </thead>            
              <tbody>
                { tournaments.map((p) => (
                  <TournamentList
                    key={p.sk}
                    tournament={p}
                  />
                ))}
              </tbody>            
            </Table>
          </Col>
        </Row>
      </Container> 
    </>
  );
}