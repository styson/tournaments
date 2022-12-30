import { API } from 'aws-amplify';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Details } from '../components/styled/Details';
import { Error } from '../components/styled/Error';
import { GetItems, putItem } from '../dynamo/ApiCalls';
import { ScenarioList } from '../components/styled/Lists';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ArchiveData from '../components/setup/ArchiveData';
import AddScenariosFromFile from '../components/setup/AddScenariosFromFile';
import Header from '../components/Header';
import ScenarioRow from '../components/ScenarioRow';

// import Amplify from 'aws-amplify';
// Amplify.Logger.LOG_LEVEL = 'DEBUG';

export default function Home() {
  const [archiveData, setArchiveData] = useState({});
  const [details, setDetailHeader] = useState('');
  const [formTitle, setFormTitle] = useState('Add Scenario');
  const [scenario, setScenario] = useState({});
  const [scenarios, setScenarios] = useState([]);
  const [scenarioId, setScenarioId] = useState('');
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioArchiveId, setScenarioArchiveId] = useState('');
  const [scenarioAttacker, setScenarioAttacker] = useState('');
  const [scenarioDefender, setScenarioDefender] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setArchiveData({});
    setDetailHeader('');
    setError('');
    setScenario({});
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

  function showError(error) {
    setError(error);
    setTimeout(() => {setError('')}, 3000);
  }

  const findScenarioDetails = async (e) => {
    if (e) e.preventDefault();

    setDetailHeader('Searching...');

    fetch(`https://aslscenarioarchive.com/rest/scenario/list/${scenarioArchiveId}`, {
      method: 'GET',
      mode:'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then(function(data) {
      if (data.scenario_id === scenarioArchiveId) {
        setDetailHeader('Details found...');
        setArchiveData(data);
        // console.log(data)
        setScenarioId(data.sc_id);
        setScenarioName(data.title);
  
        if (scenario.attacker !== data.attacker) {
          if (scenario.sk === undefined) {
            scenario.pk = 'SCENARIOS';
            scenario.sk = `SCEN_${uuidv4()}`;
            scenario.name = data.title;
            scenario.scenario_id = data.scenario_id;
            scenario.id = data.sc_id;
            scenario.maps = data.maps;
            scenario.attacker = data.attacker;
            scenario.defender = data.defender;
            setDetailHeader(`New Details found...`);
            setScenarioAttacker(data.attacker);
            setScenarioDefender(data.defender);
          }
          
          putItem(scenario, refresh);

          const index = scenarios.findIndex(_ => _.pk === scenario.pk && _.sk === scenario.sk);
          if (scenarios.length === 0 || index < 0) {
            scenarios.push(scenario);
            showError(`Added ${scenario.name}`);
          } else {
            scenarios[index] = scenario;
            showError(`Updated ${scenario.name}`);
          }

          setScenarios(scenarios);
          refresh();
        }
      } else {
        showError('Details not found.');
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

    if (scenario.sk !== undefined) {
      setScenario(scenario);
      setFormTitle('Update Scenario');
      setScenarioId(scenario.id);
      setScenarioName(scenario.name);
      setScenarioArchiveId(scenario.scenario_id || '');
    }
  };

  const handleDelete = async (event, pk, sk) => {
    event.stopPropagation();
    API.del('apiDirector', `/director/object/${pk}/${sk}`)
      .then(res => refresh());
  };

  const addScenario = async() => {
    if(scenarioId === '' || scenarioName === '') {
      setError('Scenario Id and Name are required.');
      refresh();
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
      attacker: scenarioAttacker,
      defender: scenarioDefender,
      maps: scenario.maps,
    }

    API.put('apiDirector', '/director', { body })
      .then(res => refresh());

    reset();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    addScenario();
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
          <Col md={9} className='flex-end'>
            <Button              
              size='sm'
              variant='secondary'
              onClick={refresh}
            >
              refresh
            </Button>
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
                  <th>Attacker</th>
                  <th>Defender</th>
                  <th>Boards</th>
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