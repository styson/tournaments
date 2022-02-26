import { Box } from './styled/Box';
import { Row } from 'react-bootstrap';
import React from 'react';
import RankedPlayer from './RankedPlayer';

const Results = ({ results }) => {
  return (
    <Row>
      <h4>Results</h4>
      <Box>
      {results.map((p, index) => {
        return <RankedPlayer key={p.sk} player={p} index={index} showRank={true} />;
      })}
      {results.length === 0 && (
        <p>No results are in.</p>
      )}
      </Box>
    </Row>
  );
}

export default Results;