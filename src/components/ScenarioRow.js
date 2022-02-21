import { Button } from 'react-bootstrap';
import React from 'react';

const Scenario = ({ scenario, handleDelete }) => {
  return (
    <tr className='scenario'>
      <td>{scenario.id}</td>
      <td>{scenario.name}</td>
      <td className=''>
        <Button 
          size='sm'
          variant='outline-secondary'
          onClick={() => handleDelete(scenario.pk,scenario.sk)}
        >
          X
        </Button>
      </td>
    </tr>
  );
};

export default Scenario;