import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddTournament from '../components/AddTournament';
import Header from '../components/Header';
import Tournament from '../components/Tournament';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);

  // const params = {'queryStringParameters': {
  //   'pk': 'TOURNAMENTS',
  //   'sk': 'TOURNEY#0badc6d7-b782-46c8-9bef-ceea898825db'
  // }};
  const refresh = async () => {
    // API.get('apiDirector', '/director/:pk', params)
    API.get('apiDirector', '/director/entity')
    .then(res => {
      const t = res.filter(_ => _.entityType === 'tournament');
      const st = t.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      setTournaments(st);
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (pk, sk) => {
    const params = {'queryStringParameters': { pk, sk }};
    console.log(params)
    API.del('apiDirector', '/director/object/:pk/:sk', params)
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