import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
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
    const rounds = tData.columns;
  }

  const addRound = async () => {
    const rounds = tData.columns;
    const x = Object.keys(rounds).length;
    const newColumn = {
      id: `round-${x}`,
      title: `Round ${x}`,
      scenarioIds: [],
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

  function onDragEnd(result) {
    const rounds = tData.columns;
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId &&
        destination.index === source.index) {
      return;
    }

    const start = rounds[source.droppableId];
    const finish = rounds[destination.droppableId];

    if (start === finish) {
      const newScenarioIds = Array.from(start.scenarioIds);
      newScenarioIds.splice(source.index, 1);
      newScenarioIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        scenarioIds: newScenarioIds,
      };

      const newState = {
        ...tData,
        columns: {
          ...rounds,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    // Moving from one list to another
    const startScenarioIds = Array.from(start.scenarioIds);
    startScenarioIds.splice(source.index, 1);
    const newStart = {
      ...start,
      scenarioIds: startScenarioIds,
    };

    const finishScenarioIds = Array.from(finish.scenarioIds);
    finishScenarioIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      scenarioIds: finishScenarioIds,
    };

    const newState = {
      ...tData,
      columns: {
        ...rounds,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    
    setData(newState);
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
            const tasks = column.scenarioIds.map(taskId => tData.tasks[taskId]);
            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </DragDropContext>
      </Row>
    </>
  );
}

export default Rounds;