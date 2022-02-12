import { Button } from 'react-bootstrap';
import React from 'react';

const Tournament = ({ tournament, handleDelete }) => {
  return (
    <tr className='tournament'>
      <td>{tournament.name}</td>
      <td>{tournament.rounds}</td>
      <td className=''>
        <Button 
          size='sm'
          variant='outline-secondary'
          onClick={() => handleDelete(tournament.pk,tournament.sk)}
        >
          X
        </Button>
      </td>
    </tr>
  );
};

export default Tournament;