import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddScenario from '../components/AddScenario';
import Header from '../components/Header';
import Scenario from '../components/Scenario';

export default function Home() {
  const [scenarios, setScenarios] = useState([]);

  const refresh = async () => {
    API.get('apiTournaments', '/director')
      .then(res => setScenarios(JSON.parse(res.body)));
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (pk) => {
    API.del('apiTournaments', `/director/${pk}`)
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
                  <th>Scenario Id</th>
                  <th>Title</th>
                  <th></th>
                </tr>
              </thead>            
              <tbody>
                { scenarios.map((s) => (
                  <Scenario
                    key={s.pk}
                    scenario={s}
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