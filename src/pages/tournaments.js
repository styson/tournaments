import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddTournament from '../components/AddTournament';
import { GetItems } from '../dynamo/ApiCalls';
import Header from '../components/Header';
import Tournament from '../components/Tournament';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);

  const refresh = async () => {
    GetItems('TOURNAMENTS', 'name', setTournaments);
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (pk, sk) => {
    API.del('apiDirector', `/director/object/${pk}/${sk}`)
      .then(res => refresh());
  };

  return ( 
    <>
      <Header />
      <Container fluid id='main'>
        <Row>
          <Col md={3}>
            <h1>Tournaments</h1>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <Table striped bordered hover size='sm'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Players</th>
                  <th>Rounds</th>
                  <th className=''>Delete</th>
                </tr>
              </thead>            
              <tbody>
                { tournaments.map((p) => (
                  <Tournament
                    key={p.sk}
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