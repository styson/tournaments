import { Button } from 'react-bootstrap';
import React from 'react';

const Tournament = ({ tournament }) => {
  return (
    <tr className='tournament'>
      <td>{tournament.name}</td>
      <td>{tournament.rounds}</td>
    </tr>
  );
};

export default Tournament;