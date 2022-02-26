import { Box } from './styled/Box';
import { Row } from 'react-bootstrap';
import React from 'react';
import RankedPlayer from './RankedPlayer';

const Standings = ({ standings }) => {
  return (
    <Row>
      <h4>Standings</h4>
      <Box>
      {standings.map((p, index) => {
        return <RankedPlayer key={p.sk} player={p} index={index} showRank={true} />;
      })}
      {standings.length === 0 && (
        <p>No standings yet.</p>
      )}
      </Box>
    </Row>
  );
}

export default Standings;