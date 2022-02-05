import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
// import { API } from 'aws-amplify';
import Header from '../components/Header';
import Tournaments from '../components/Tournaments';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);

  // useEffect(() => {
  //   API.get('apiTourney', '/tournaments/:id')
  //     .then(res => setTournaments([...res]));
  // }, []);

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
          <Col md={3}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rounds</th>
                </tr>
              </thead>            
              <tbody>
                { tournaments.map((p) => (
                  <Tournaments
                    key={p.id}
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