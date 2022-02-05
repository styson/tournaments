import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddTournament from '../components/AddTournament';
import Header from '../components/Header';
import Tournament from '../components/Tournament';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);

  const refresh = async () => {
    API.get('apiTournaments', '/tournaments')
      .then(res => setTournaments(JSON.parse(res.body)));
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id) => {
    API.del('apiTournaments', `/tournaments/${id}`)
      .then(res => refresh());
  };

  return ( 
    <>
      <Header />
      <Container fluid id="main">
        <Row>
          <Col md={3}>
            <h1>Tournaments</h1>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rounds</th>
                  <th className=''>Delete</th>
                </tr>
              </thead>            
              <tbody>
                { tournaments.map((p) => (
                  <Tournament
                    key={p.id}
                    tournament={p}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>            
            </Table>
          </Col>
          <Col md={3}>
            <AddTournament handleAdd={ refresh } />
          </Col>
        </Row>
      </Container> 
    </>
  );
}