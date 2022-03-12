import { Col, Container, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import AddScenario from '../components/AddScenario';
// import Amplify from 'aws-amplify';
import { GetItems } from '../dynamo/ApiCalls';
import Header from '../components/Header';
import ScenarioRow from '../components/ScenarioRow';
import AddScenariosFromFile from '../components/AddScenariosFromFile';

// Amplify.Logger.LOG_LEVEL = 'DEBUG';

export default function Home() {
  const [scenarios, setScenarios] = useState([]);

  const refresh = async () => {
    GetItems('SCENARIOS', 'id', setScenarios);
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
                </tr>
              </thead>            
              <tbody>
                { scenarios.map((s) => (
                  <ScenarioRow
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
        <Row className='d-none'>
          <Col md={9}>
            <h4>Other possible scenarios</h4>
            <AddScenariosFromFile />
          </Col>
        </Row>
      </Container>
    </>
  );
}