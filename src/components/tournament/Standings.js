import { Row, Table } from 'react-bootstrap';
import React from 'react';
import StandingsPlayer from './StandingsPlayer';

const Standings = ({ players = [] }) => {
  return (
    <Row>
      <h4>Standings</h4>
      <div>
        {Array.from(players).length > 0 && (
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Wins</th>
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
      </div>
    </Row>
  );
}

export default Standings;