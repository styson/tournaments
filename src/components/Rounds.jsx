import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Column from './column';

const Rounds = ({ tournament, data }) => {
  const [tData, setData] = useState(data);
  const [tourney, setTournament] = useState({});

  useEffect(() => {
    setTournament(tournament);
  }, [tournament]);

  function addColumn(roundArray, round) {
    if (!roundArray.includes(round)) {
      roundArray.push(round);
    }
    return roundArray.sort();
  }

  const saveRounds = async () => {
    // const rounds = tData.columns;
  }

  const addRound = async () => {
    const rounds = tData.columns;
    const x = Object.keys(rounds).length;
    const newColumn = {
      id: `round-${x}`,
      title: `Round ${x}`, 
      scenarioSks: [],
    };

    const newState = {
      ...tData,
      columns: {
        ...rounds,
        [newColumn.id]: newColumn,
      },
      roundOrder: addColumn(tData.roundOrder, newColumn.id)
    };

    setData(newState);    
  }

  const copy = (source, destination, draggableId) => {
    const rounds = tData.columns;
    const scenarios = tData.scenarios;

    const finish = rounds[destination.droppableId];
    const finishScenarioSks = Array.from(finish.scenarioSks);

    const scenario = scenarios[draggableId];

    let alreadyInRound = false;
    finishScenarioSks.forEach(sk => {
      const fs = scenarios[sk];
      if (fs.id === scenario.id && fs.name === scenario.name) {
        alreadyInRound = true;
      }
    });
    if (alreadyInRound) return;

    const scen = { ...scenario, pk: finish.sk, sk: `SCEN_${uuidv4()}`, new: true, roundPk: finish.pk, roundSk: finish.sk }
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
      columns: {
        ...rounds,
        [newFinish.id]: newFinish,
      },
    };
    
    setData(newState);
    console.log(newState.scenarios);
  };

  const reorder = (source, destination, draggableId) => {
    const rounds = tData.columns;
    const start = rounds[source.droppableId];
    const newScenarioSks = Array.from(start.scenarioSks);

    newScenarioSks.splice(source.index, 1);
    newScenarioSks.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...start,
      scenarioSks: newScenarioSks,
    };

    const newState = {
      ...tData,
      columns: {
        ...rounds,
        [newColumn.id]: newColumn,
      },
    };

    setData(newState);
  };

  const move = (source, destination, draggableId) => {
    const rounds = tData.columns;
    const scenarios = tData.scenarios;

    const start = rounds[source.droppableId];
    const startScenarioSks = Array.from(start.scenarioSks);

    const finish = rounds[destination.droppableId];
    const finishScenarioSks = Array.from(finish.scenarioSks);

    const scenario = scenarios[draggableId];

    let alreadyInRound = false;
    finishScenarioSks.forEach(sk => {
      const fs = scenarios[sk];
      if (fs.id === scenario.id && fs.name === scenario.name) {
        alreadyInRound = true;
      }
    });
    if (alreadyInRound) return;

    const scen = { ...scenario, roundPk: finish.pk, roundSk: finish.sk }
    // Moving from one list to another
    startScenarioSks.splice(source.index, 1);
    const newStart = {
      ...start,
      scenarioSks: startScenarioSks,
    };

    finishScenarioSks.splice(destination.index, 0, draggableId);
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
      columns: {
        ...rounds,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    
    setData(newState);
    console.log(newState.scenarios);
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
            onClick={() => addRound()}
            disabled={tourney.name === '' ? 'disabled' : '' }                
          >
            Add Round
          </Button>
          <Button
            className='mb-1 ms-2'
            size='sm'
            onClick={() => saveRounds()}
            disabled={tourney.name === '' ? 'disabled' : '' }                
          >
            Save Rounds
          </Button>
        </Col>
      </Row>
      <Row>
        <DragDropContext onDragEnd={onDragEnd}>
          {tData.roundOrder.map(columnId => {
            const column = tData.columns[columnId];
            const scenarios = column.scenarioSks.map(scenarioSk => tData.scenarios[scenarioSk]);
            return <Column key={column.id} column={column} scenarios={scenarios} />;
          })}
        </DragDropContext>
      </Row>
    </>
  );
}

export default Rounds;