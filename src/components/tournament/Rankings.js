import { Box, ExtrasBox } from '../styled/Box';
import { Button, Form, Row } from 'react-bootstrap';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Error } from '../styled/Error';
import { PlayerList, ExtraPlayerList } from '../styled/Lists';
import { getItem, putItem } from '../../dynamo/ApiCalls';
import { useState, useEffect } from 'react';
import RankedPlayer from './RankedPlayer';
import React from 'react';

const Rankings = ({ round, players, standings, tournament }) => {
  const [complete, setComplete] = useState(round.rankingsComplete || false);

  const [activePlayers, setActivePlayers] = useState([]);
  const [extraPlayers, setExtraPlayers] = useState([]);

  useEffect(() => {
    if (round.hasOwnProperty('extraPlayers')) {
      setExtraPlayers(round['extraPlayers']);
    }
    if (round.hasOwnProperty('activePlayers')) {
      setActivePlayers(round['activePlayers']);
    } else {
      setActivePlayers(players);
      updateRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, players]);

  useEffect(() => {
    if(round.round === undefined) return;
    console.log(`useEffect round ${round.round} with ${activePlayers.length} active players`);

    // if (round.hasOwnProperty('extraPlayers')) {

    const rnd = { 
      ...round,
      activePlayers,
      extraPlayers,
    }
    putItem(rnd);
  }, [round, activePlayers, extraPlayers]);

  function updateRound() {
    if (round.rankingsComplete || complete) {
      console.log(`update round ${round.round} players failed since complete [${complete}]`);
      return;
    }

    console.log(`updateRound ${round.round} with ${activePlayers.length} active players`);
    const rnd = { 
      ...round,
      activePlayers,
      extraPlayers,
    }
    putItem(rnd);
  }

  function resetWithStandings(res) {
    if (res.standings === {}) return;

    if (round.rankingsComplete || complete) {
      console.log(`reset round ${round.round} players failed since complete [${complete}]`);
      return;
    }

    const pl = [];
    const s = Object.keys(res.standings);
    s.forEach(p => {
      pl.push(res.standings[p]);
    });

    const orderedPlayers = pl.sort((a, b) => {
      if (a.points === b.points) {
        return a.rank > b.rank ? 1 : -1;  
      }
      return a.points < b.points ? 1 : -1;
    });

    setActivePlayers(orderedPlayers);
    setExtraPlayers([]);
  }

  function resetPlayers() {
    if (complete) {
      showError(`Can't reset since Round is complete.`);
      return;
    }

    const getData = async () => {
      getItem(tournament.pk, tournament.sk, resetWithStandings);
    };

    getData();
  }

  function clearPlayers() {
    if (complete) {
      showError(`Can't clear since Round is complete.`);
      return;
    }

    setActivePlayers([]);
    setExtraPlayers([]);

    console.log(`clearPlayers ${round.round} with ${activePlayers.length} active players`);
    const rnd = { 
      ...round,
      activePlayers,
      extraPlayers,
    }
    putItem(rnd);
  }

  function completeRound(checked) {
    setComplete(checked);
    round.rankingsComplete = checked;
    console.log(`completeRound ${round.round} with ${activePlayers.length} active players`);
    const rnd = { 
      ...round,
      rankingsComplete: checked,
      activePlayers,
      extraPlayers,
    }
    putItem(rnd);
  }

  const reorder = (source, destination, draggableId) => {
    const active = source.droppableId === 'activeDrop';
    const players = active ? activePlayers : extraPlayers;
    const player = players.find(p => p.sk === draggableId);

    players.splice(source.index, 1);
    players.splice(destination.index, 0, player);

    if (round.rankingsComplete || complete) {
      console.log(`reorder round ${round.round} players failed since complete [${complete}]`);
      return;
    }

    if (active) {
      setActivePlayers(players); 
    } else {
      setExtraPlayers(players); 
    }
    updateRound();
  };

  const move = (source, destination, draggableId) => {
    const active = source.droppableId === 'activeDrop';

    if (active) {
      const player = activePlayers.find(p => p.sk === draggableId);
      activePlayers.splice(source.index, 1);
      extraPlayers.splice(destination.index, 0, player);
    } else {
      const player = extraPlayers.find(p => p.sk === draggableId);
      extraPlayers.splice(source.index, 1);
      activePlayers.splice(destination.index, 0, player);
    }

    setActivePlayers(activePlayers); 
    setExtraPlayers(extraPlayers); 
    updateRound();
  }

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) {
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
      default:
        move(source, destination, draggableId);
        break;
    }
  }
    
  const [error, setError] = useState('');
  function showError(error) {
    setError(error);
    setTimeout(() => {setError('')}, 3000);
  }

  return (
    <>
      <Row>
        <Form>
          <Form.Group className='mt-1 float-end' controlId={`completeCheckbox${round.round}`}>
            <Form.Check
              type='switch' 
              label='Complete'
              checked={complete}
              onChange={(e) => completeRound(e.currentTarget.checked)}
            />
          </Form.Group>
          <h4>Rankings</h4>
        </Form>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='activeDrop' isDropDisabled={complete}>
            {(provided, snapshot) => { 
              return (
                <Box>
                  <h5>Active</h5>
                  <PlayerList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDragging={snapshot.isDragging}                  
                    isDraggingOver={snapshot.isDraggingOver}
                  >
                    {activePlayers.map((p, index) => {
                      p.rank = index + 1;
                      return <RankedPlayer key={p.sk} player={p} index={index} showRank={true} />;
                    })}
                    {provided.placeholder}
                  </PlayerList>
                </Box>
               )
            }}
          </Droppable>
          <Droppable droppableId='extraDrop' isDropDisabled={complete}>
            {(provided, snapshot) => { 
              return (
                <ExtrasBox>
                  <h5>Sidelines</h5>
                  <ExtraPlayerList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDragging={snapshot.isDragging}                  
                    isDraggingOver={snapshot.isDraggingOver}
                    isDragDisabled={complete}
                  >
                    {extraPlayers.map((p, index) => {
                      p.rank = index + 1001;
                      return <RankedPlayer key={p.sk} player={p} index={index} showRank={false} />;
                    })}
                    {provided.placeholder}
                  </ExtraPlayerList>
                </ExtrasBox>
               )
            }}
          </Droppable>
        </DragDropContext>
        <div className='d-flex'>
          <Button
            id='clear-players'
            size='sm'
            className={`flex-grow-1 me-1 mb-2 ${complete ? 'd-none' : ''}`}
            variant='outline-danger'
            onClick={clearPlayers}
            disabled={complete}
          >
            Clear Players
          </Button>
          <Button
            id='reset-players'
            size='sm'
            className={`flex-grow-1 ms-1 mb-2 ${complete ? 'd-none' : ''}`}
            variant='outline-secondary'
            onClick={resetPlayers}
            disabled={complete}
          >
            Reset Players
          </Button>
        </div>
        <Error>
          {error}
        </Error>
      </Row>
    </>
  );
}

export default Rankings;