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

  // const init = {
  //   queryStringParameters: {
  //     'entityType': 'scenario'
  //   }
  // }

  const refresh = async () => {
    // API.get('apiDirector', '/director/:pk', params)
    API.get('apiDirector', '/director/entity')
    .then(res => {
      console.log(res)
      const t = res.filter(_ => _.entityType === 'scenario');
      const st = t.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1);
      setScenarios(st);
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

  return ( <
    >
    <Header /> <
    Container fluid id = 'main' >
    <Row>
          <Col md={3}>
            <h1>Scenarios</h1>
          </Col>
        </Row> <
    Row >
    <Col md={9}>
            <Table striped bordered hover size='sm'>
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
                    key={s.sk}
                    scenario={s}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>            
            </Table>
          </Col> <
    Col md = { 3 } >
    <AddScenario handleAdd={ refresh } /> <
    /Col> <
    /Row> <
    /Container>  <
    />
  );
}