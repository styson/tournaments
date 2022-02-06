import { Button } from 'react-bootstrap';
import React from 'react';

const Tournaments = ({ tournament }) => {
  return (
    <tr className='tournament'>
      <td>{tournament.name}</td>
      <td>{tournament.rounds}</td>
    </tr>
  );
};

export default Tournaments;