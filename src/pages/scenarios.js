import { API } from 'aws-amplify';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Details } from '../components/styled/Details';
import { Error } from '../components/styled/Error';
import { GetItems } from '../dynamo/ApiCalls';
import { ScenarioList } from '../components/styled/Lists';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ArchiveData from '../components/ArchiveData';
import AddScenariosFromFile from '../components/AddScenariosFromFile';
import Header from '../components/Header';
import ScenarioRow from '../components/ScenarioRow';

// import Amplify from 'aws-amplify';
// Amplify.Logger.LOG_LEVEL = 'DEBUG';

export default function Home() {
  const [archiveData, setArchiveData] = useState({});
  const [details, setDetails] = useState('');
  const [formTitle, setFormTitle] = useState('Add Scenario');
  const [scenario, setScenario] = useState({});
  const [scenarios, setScenarios] = useState([]);
  const [scenarioId, setScenarioId] = useState('');
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioArchiveId, setScenarioArchiveId] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setArchiveData({});
    setDetails('');
    setError('');
    setScenarioArchiveId('');
    setScenarioId('');
    setScenarioName('');
  }

  const refresh = async () => {
    GetItems('SCENARIOS', 'id', setScenarios);
  }

  useEffect(() => {
    refresh();
  }, []);

  const findScenarioDetails = async (e) => {
    if (e) e.preventDefault();

    setDetails('Searching...');

    fetch(`https://aslscenarioarchive.com/rest/scenario/list/${scenarioArchiveId}`, {
      method: 'GET',
      mode:'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then(function(data) {
      if (data.scenario_id === scenarioArchiveId) {
        // setDetails(JSON.stringify(data));
        setDetails('Details found...');
        setArchiveData(data);
      } else {
        setTimeout(() => {
          setDetails('Details not found.');
        }, 5000);
      }        
    })
    .catch((err) => {
      reset();
      setError(err);      
    });
  };

  const handleRowClick = async (pk, sk) => {
    reset();

    const scenario = scenarios.length === 0 ? {} : scenarios.find(_ => _.pk === pk && _.sk === sk);

    if (scenario.pk !== undefined) {
      setScenario(scenario);
      setFormTitle('Update Scenario');
      setScenarioId(scenario.id);
      setScenarioName(scenario.name);
      setScenarioArchiveId(scenario.scenario_id || '');
    }
  };

  const handleDelete = async (pk, sk) => {
    API.del('apiDirector', `/director/object/${pk}/${sk}`)
      .then(res => refresh());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(scenarioId === '' || scenarioName === '') {
      setError('Scenario Id and Name are required.');
      return;
    }

    setFormTitle('Add Scenario');
    setError('');

    const pk = 'SCENARIOS';
    const sk = scenario.sk || `SCEN_${uuidv4()}`;

    const body = {
        pk,
        sk,
        id: scenarioId,
        name: scenarioName,
        scenario_id: scenarioArchiveId,
      }

    API.post('apiDirector', '/director', { body })
      .then(res => refresh());

    reset();
  };

  const cancel = async (e) => {
    if (e) e.preventDefault();

    setFormTitle('Add Scenario');
    reset();
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
          <Col md={8}>
            <ScenarioList>
            <Table striped bordered hover size='sm'>
              <thead>
                <tr>
                  <th>Scenario Id</th>
                  <th>Name</th>
                  <th>Archive Id</th>
                </tr>
              </thead>            
              <tbody>
                { scenarios.map((s) => (
                  <ScenarioRow
                    key={s.sk}
                    scenario={s}
                    handleDelete={handleDelete}
                    handleRowClick={handleRowClick}
                 />
                ))}
              </tbody>            
            </Table>
            </ScenarioList>
          </Col>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Card>
                <Card.Body>
                  <Card.Title>{formTitle}</Card.Title>
                    <Form.Control
                      className='mb-2'
                      type='text'
                      placeholder='Enter Id...'
                      value={scenarioId}
                      autoComplete='off'
                      onChange={(e) => setScenarioId(e.target.value)}
                    />

                    <Form.Control
                      className='mb-2'
                      type='text'
                      placeholder='Enter Name...'
                      value={scenarioName}
                      autoComplete='off'
                      onChange={(e) => setScenarioName(e.target.value)}
                    />

                    <InputGroup className='mb-2'>
                      <Form.Control
                        type='text'
                        placeholder='Enter Archive Id...'
                        value={scenarioArchiveId}
                        autoComplete='off'
                        onChange={(e) => setScenarioArchiveId(e.target.value)}
                      />
                      <Button
                        id='archiveLookup'
                        size='sm'
                        variant='success'
                        onClick={(e) => findScenarioDetails(e)}
                        disabled={scenarioArchiveId === '' ? 'disabled' : ''}
                      >
                        S.A.
                      </Button>
                    </InputGroup>

                    <div className='d-flex'>
                      <Button
                        className='flex-grow-1'
                        size='sm'
                        type='submit'
                        variant='primary'
                      >
                        {formTitle}
                      </Button>
                      <Button
                        className='flex-grow-1 ms-2'
                        size='sm'
                        onClick={(e) => cancel(e)}
                        variant='outline-secondary'
                      >
                        Cancel
                      </Button>
                    </div>
                    <Details
                      className={details > '' ? '' : 'd-none'}
                    >
                      {details}
                      <ArchiveData data={archiveData} />
                    </Details>
                    <Error>
                      {error}
                    </Error>
               </Card.Body>
              </Card>
            </Form>
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