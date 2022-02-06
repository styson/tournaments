import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddScenario from '../components/AddScenario';
import Header from '../components/Header';
import Scenario from '../components/Scenario';

export default function Home() {
  const [scenarios, setScenarios] = useState([]);

  const refresh = async () => {
    API.get('apiTournaments', '/scenarios')
      .then(res => setScenarios(JSON.parse(res.body)));
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id) => {
    API.del('apiTournaments', `/scenarios/${id}`)
      .then(res => refresh());
  };

  return ( 
    <>
      <Header />
      <Container fluid id="main">
        <Row>
          <Col md={3}>
            <h1>Scenarios</h1>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Delete</th>
                </tr>
              </thead>            
              <tbody>
                { scenarios.map((p) => (
                  <Scenario
                    key={p.id}
                    scenario={p}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>            
            </Table>
          </Col>
          <Col md={3}>
            <AddScenario handleAdd={ refresh } />
          </Col>
        </Row>
      </Container> 
    </>
  );
}