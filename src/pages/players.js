import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddPlayer from '../components/AddPlayer';
import Header from '../components/Header';
import Player from '../components/Player';

export default function Home() {
  const [players, setPlayers] = useState([]);

  const refresh = async () => {
    API.get('apiDirector', '/director/PLAYERS')
      .then(res => setPlayers(res.Items.sort((a, b) => a.name.localeCompare(b.name))));
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
      <Container fluid id = 'main' >
        <Row>
          <Col md={3}>
            <h1>Players</h1>
          </Col>
        </Row> 
        <Row>
          <Col md={9}>
            <Table striped bordered hover size='sm'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>            
              <tbody>
                { players.map((p) => (
                  <Player
                    key={p.sk}
                    player={p}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>            
            </Table>
          </Col>
          <Col md={3}>
            <AddPlayer handleAdd={ refresh } /> 
          </Col>
        </Row>
      </Container>
    </>
  );
}