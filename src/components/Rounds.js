import { delRoundScenario, putRoundScenario, putItem } from '../dynamo/ApiCalls';
import { Button, Col, Row } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import Round from './Round';

const Rounds = ({ tournament, data }) => {
  const [tData, setData] = useState(data);

  function addRound(roundArray, round) {
    if (!roundArray.includes(round)) {
      roundArray.push(round);
    }
    return roundArray.sort();
  }

  const addNewRound = async () => {
    const rounds = tData.rounds;
    const x = Object.keys(rounds).length;
    const newRound = {
      pk: tournament.sk,
      sk: `ROUN_${x}_${uuidv4()}`,
      name: `Round ${x}`, 
      round: x,
      activePlayers: [],
      extraPlayers: [],
      matches: [],
    };

    putItem(newRound);

    newRound.scenarioSks = [];
    
    const newState = {
      ...tData,
      rounds: {
        ...rounds,
        [newRound.sk]: newRound,
      },
      roundOrder: addRound(tData.roundOrder, newRound.sk)
    };

    setData(newState);    
  }

  const copy = (source, destination, draggableId) => {
    const rounds = tData.rounds;
    const scenarios = tData.scenarios;

    const finish = rounds[destination.droppableId];
    const finishScenarioSks = Array.from(finish.scenarioSks);

    const i = draggableId.indexOf('_SCEN_');
    const sk = draggableId.substr(i+1);
    const scenario = scenarios[sk];

    let alreadyInRound = false;
    finishScenarioSks.forEach(sk => {
      const fs = scenarios[sk];
      if (fs.id === scenario.id && fs.name === scenario.name) {
        alreadyInRound = true;
      }
    });
    if (alreadyInRound) return;

    const scen = { 
      ...scenario, 
      pk: finish.pk, 
      sk: `${finish.sk}_${scenario.sk}`, 
      roundPk: finish.pk, 
      roundSk: finish.sk
    }

    putRoundScenario(scen);

    finishScenarioSks.splice(destination.index, 0, scen.sk);
    const newFinish = {
      ...finish,
      scenarioSks: finishScenarioSks,
    };

    const newState = {
      ...tData,
      scenarios: {
        ...scenarios,
        [scen.sk]: scen,
      },
      rounds: {
        ...rounds,
        [newFinish.sk]: newFinish,
      },
    };
    
    setData(newState);
    // console.log(newState.scenarios);
  };

  const reorder = (source, destination, draggableId) => {
    const rounds = tData.rounds;
    const start = rounds[source.droppableId];
    const newScenarioSks = Array.from(start.scenarioSks);

    const i = draggableId.indexOf('_SCEN_');
    const sk = draggableId.substr(i+1);

    newScenarioSks.splice(source.index, 1);
    newScenarioSks.splice(destination.index, 0, sk);

    const newRound = {
      ...start,
      scenarioSks: newScenarioSks,
    };

    const newState = {
      ...tData,
      rounds: {
        ...rounds,
        [newRound.sk]: newRound,
      },
    };

    setData(newState);
  };

  const move = (source, destination, draggableId) => {
    const rounds = tData.rounds;
    const scenarios = tData.scenarios;

    const start = rounds[source.droppableId];
    const startScenarioSks = Array.from(start.scenarioSks);

    const finish = rounds[destination.droppableId];
    const finishScenarioSks = Array.from(finish.scenarioSks);

    const i = draggableId.indexOf('_SCEN_');
    const sk = draggableId.substr(i+1);
    const scenario = scenarios[sk];

    let alreadyInRound = false;
    finishScenarioSks.forEach(sk => {
      const fs = scenarios[sk];
      if (fs.id === scenario.id && fs.name === scenario.name) {
        alreadyInRound = true;
      }
    });
    if (alreadyInRound) return;

    // delete old record
    delRoundScenario(finish.pk, draggableId);

    // add new record
    const scen = { ...scenario, pk: `${finish.pk}`, sk: `${finish.sk}_${sk}`, roundPk: finish.pk, roundSk: finish.sk }
    putRoundScenario(scen);

    // Moving from one list to another
    startScenarioSks.splice(source.index, 1);
    const newStart = {
      ...start,
      scenarioSks: startScenarioSks,
    };

    finishScenarioSks.splice(destination.index, 0, sk);
    const newFinish = {
      ...finish,
      scenarioSks: finishScenarioSks,
    };

    const newState = {
      ...tData,
      scenarios: {
        ...scenarios,
        [scen.sk]: scen,
      },
      rounds: {
        ...rounds,
        [newStart.sk]: newStart,
        [newFinish.sk]: newFinish,
      },
    };
    
    setData(newState);
    // console.log(newState.scenarios);
  }

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === 'scenarios') {
      return;
    }

    if (destination.droppableId === source.droppableId &&
        destination.index === source.index) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        reorder(source, destination, draggableId);
        break;
      case 'scenarios':
        copy(source, destination, draggableId);
        break;
      default:
        move(source, destination, draggableId);
        break;
    }
  }
    
  return (
    <>
      <Row>
        <Col md='3' className='mt-3'>
          <h3>Rounds</h3>
        </Col>
        <Col md='3' className='mt-3'>
          <Button
            className='mb-1'
            size='sm'
            onClick={() => addNewRound()}
            disabled={tournament.name === '' ? 'disabled' : '' }                
          >
            Add Round
          </Button>
        </Col>
      </Row>
      <Row>
        <DragDropContext onDragEnd={onDragEnd}>
          <Col md='3' className='mt-3'>
            {tData.roundOrder.map((roundId, index) => {
              const round = tData.rounds[roundId];
              if (round.name !== 'Scenarios') {
                return (
                  <span key={index}></span>
                );
              }
              const roundScenarios = round.scenarioSks.map(scenarioSk => tData.scenarios[scenarioSk]);
              return (
                <Round key={round.sk} round={round} scenarios={roundScenarios} colSize='12' />
              );
            })}
          </Col>
          <Col md='9' className='mt-3'>
            <Row>
              {tData.roundOrder.map((roundId, index) => {
                const round = tData.rounds[roundId];
                if (round.name === 'Scenarios') {
                  return (
                    <span key={index}></span>
                  );
                }
                const roundScenarios = round.scenarioSks.map(scenarioSk => tData.scenarios[scenarioSk]);
                return (
                  <Round key={round.sk} round={round} scenarios={roundScenarios} colSize='4' />
                );
              })}
            </Row>
          </Col>
        </DragDropContext>
      </Row>
    </>
  );
}

export default Rounds;