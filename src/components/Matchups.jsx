import { Box } from './styled/Box';
import { Row } from 'react-bootstrap';
import React from 'react';
import RankedPlayer from './RankedPlayer';

const Matchups = ({ matchups }) => {
  return (
    <Row>
      <h4>Matchups</h4>
      <Box>
      {matchups.map((p, index) => {
        return <RankedPlayer key={p.sk} player={p} index={index} showRank={true} />;
      })}
      {matchups.length === 0 && (
        <p>Matchups have not been set.</p>
      )}
      </Box>
    </Row>
  );
}

export default Matchups;