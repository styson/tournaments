import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddTournament from '../components/AddTournament';
import Header from '../components/Header';
import Tournament from '../components/Tournament';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);

  const refresh = async () => {
    // API.get('apiTourney', '/tournaments/:id')
    //   .then(res => setTournaments([...res]));
  }

  useEffect(() => {
    refresh();
  }, []);

  // const handleAdd = async () => refresh();

  const handleDelete = async (id) => {
    console.log(`delete tournament with id=${id}`)
    // API.del('apiTourney', `/tournaments/${id}`)
    //   .then(res => console.log(res))
    //   .then(refresh());
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