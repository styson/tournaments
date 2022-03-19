import { Button } from 'react-bootstrap';
import React from 'react';

const Scenario = ({ scenario, handleDelete, handleRowClick }) => {
  return (
    <tr className='scenario'
      onClick={() => handleRowClick(scenario.pk, scenario.sk)}
    >
      <td>{scenario.id}</td>
      <td>{scenario.name}</td>
      <td>{scenario.attacker}</td>
      <td>{scenario.defender}</td>
      <td>{scenario.maps && (
          <>{scenario.maps.join(', ')}</>
        )}
      </td>
      <td>{scenario.scenario_id}
        <Button 
          size='sm'
          className='float-end me-2'
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