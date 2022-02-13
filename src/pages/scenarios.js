import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddScenario from '../components/AddScenario';
// import Amplify from 'aws-amplify';
import Header from '../components/Header';
import Scenario from '../components/Scenario';

// Amplify.Logger.LOG_LEVEL = 'DEBUG';

export default function Home() {
  const [scenarios, setScenarios] = useState([]);

  const refresh = async () => {
    API.get('apiDirector', '/director/SCENARIOS')
      .then(res => setScenarios(res.Items.sort((a, b) => a.id.localeCompare(b.id))));
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
            <h1>Scenarios</h1>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <Table striped bordered hover size='sm'>
              <thead>
                <tr>
                  <th>Scenario Id</th>
                  <th>Name</th>
                  <th></th>
                </tr>
              </thead>            
              <tbody>
                { scenarios.map((s) => (
                  <Scenario
                    key={s.sk}
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