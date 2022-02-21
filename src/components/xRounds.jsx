import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
// import { useEffect } from 'react';
import Column from './column';

const Rounds = ({ rounds, tournament, scenarios }) => {
  // console.log(rounds)
  // console.log(tournament)
  // console.log(scenarios)

  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});

  const scenarioColumn = {
    id: 'scenarios',
    title: 'Scenarios',
    scenarioIds: [],
  };

  useEffect(() => {
    var columns = [];

    rounds.map((r, idx) => {
      const column = {
        id: `round-${r.number}`,
        title: `Round ${r.number}`,
        scenarioIds: [],
      };
      columns[columns.length] = column;
    });

    scenarios.map((s, idx) => {
      scenarioColumn.scenarioIds[idx] = s.sk;
      tasks[s.sk] = {
        id: s.sk, 
        ref: s.id, 
        content: s.name
      }
    });

    columns[columns.length] = scenarioColumn;

    setColumns(columns);
    setTasks(tasks);
    // console.log(tasks)

  }, [rounds, scenarios]);


  //   // const round = 
  //   // this.state = {
  //   //   tasks: {
  //   //     'scenario-1': { id: 'scenario-1', ref: 'DtF15', content: 'Storming Lommel' },
  //   //   },
  //   //   rounds: roundO,
  //   //   roundOrder: roundOrder
  //   // };

  // //   let roundOrder = [];
  // //   const rds = this.props.rounds.map((r, idx) => {
  // //     roundO[r.sk] = {
  // //       id: r.sk,
  // //       title: `Round ${r.number}`,
  // //       scenarioIds: ['scenario-1'],
  // //     };
  // //     roundOrder[idx] = r.sk;
  // //   });

  //   setStaate(data);
  // });

  // function onDragEnd(result) {
  //   const { destination, source, draggableId } = result;

  //   if (!destination) {
  //     return;
  //   }

  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) {
  //     return;
  //   }

  //   const start = rounds[source.droppableId];
  //   const finish = rounds[destination.droppableId];

  //   if (start === finish) {
  //     const newScenarioIds = Array.from(start.scenarioIds);
  //     newScenarioIds.splice(source.index, 1);
  //     newScenarioIds.splice(destination.index, 0, draggableId);

  //     const newColumn = {
  //       ...start,
  //       scenarioIds: newScenarioIds,
  //     };

  //     const newState = {
  //       ...this.state,
  //       columns: {
  //         ...rounds,
  //         [newColumn.id]: newColumn,
  //       },
  //     };

  //   //   this.setState(newState);
  //   //   return;
  //   }

    // // Moving from one list to another
    // const startScenarioIds = Array.from(start.scenarioIds);
    // startScenarioIds.splice(source.index, 1);
    // const newStart = {
    //   ...start,
    //   scenarioIds: startScenarioIds,
    // };

    // const finishScenarioIds = Array.from(finish.scenarioIds);
    // finishScenarioIds.splice(destination.index, 0, draggableId);
    // const newFinish = {
    //   ...finish,
    //   scenarioIds: finishScenarioIds,
    // };

    // const newState = {
    //   ...this.state,
    //   columns: {
    //     ...rounds,
    //     [newStart.id]: newStart,
    //     [newFinish.id]: newFinish,
    //   },
    // };
    
    // this.setState(newState);    
  // }

    
  //   console.log(roundO);

  //   this.state = {
  //     tasks: {
  //       'scenario-1': { id: 'scenario-1', ref: 'DtF15', content: 'Storming Lommel' },
  //     },
  //     rounds: roundO,
  //     roundOrder: roundOrder
  //   };
  // }

  // onDragEnd = result => {
  //   const { destination, source, draggableId } = result;

  //   if (!destination) {
  //     return;
  //   }

  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) {
  //     return;
  //   }

  //   const start = this.state.rounds[source.droppableId];
  //   const finish = this.state.rounds[destination.droppableId];

  //   if (start === finish) {
  //     const newScenarioIds = Array.from(start.scenarioIds);
  //     newScenarioIds.splice(source.index, 1);
  //     newScenarioIds.splice(destination.index, 0, draggableId);

  //     const newColumn = {
  //       ...start,
  //       scenarioIds: newScenarioIds,
  //     };

  //     const newState = {
  //       ...this.state,
  //       rounds: {
  //         ...this.state.rounds,
  //         [newColumn.id]: newColumn,
  //       },
  //     };

  //     this.setState(newState);
  //     return;
  //   }

  //   // Moving from one list to another
  //   const startScenarioIds = Array.from(start.scenarioIds);
  //   startScenarioIds.splice(source.index, 1);
  //   const newStart = {
  //     ...start,
  //     scenarioIds: startScenarioIds,
  //   };

  //   const finishScenarioIds = Array.from(finish.scenarioIds);
  //   finishScenarioIds.splice(destination.index, 0, draggableId);
  //   const newFinish = {
  //     ...finish,
  //     scenarioIds: finishScenarioIds,
  //   };

  //   const newState = {
  //     ...this.state,
  //     rounds: {
  //       ...this.state.rounds,
  //       [newStart.id]: newStart,
  //       [newFinish.id]: newFinish,
  //     },
  //   };
    
  //   this.setState(newState);    
  // }

  return (
    <DragDropContext>
        {columns.map(column => {
          const colTasks = column.scenarioIds.map(t => tasks[t]);
          return <Column key={column.id} column={column} tasks={colTasks} />;
        })}
    </DragDropContext>
  );
}

export default Rounds;