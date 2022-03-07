import { Table } from 'react-bootstrap';
import React from 'react';
import StandingsPlayer from './StandingsPlayer';

const Standings = ({ players = [] }) => {
  return (
    <>
      <h3 className='mt-3'>Standings</h3>
      {Array.from(players).length > 0 && (
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Points</th>
            <th>Rounds</th>
          </tr>
        </thead>
        <tbody>
        {Array.from(players).map((p, index) => {
          return <StandingsPlayer key={p.sk} player={p} />;
        })}
        </tbody>
      </Table>
      )}
      {Array.from(players).length === 0 && (
        <p>No standings yet.</p>
      )}
    </>
  );
}

export default Standings;