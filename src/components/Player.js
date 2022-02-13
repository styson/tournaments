import { Button } from 'react-bootstrap';
import React from 'react';

const Player = ({ player, handleDelete }) => {
  return (
    <tr className='player'>
      <td>{player.name}</td>
      <td>{player.email}</td>
      <td className=''>
        <Button 
          size='sm'
          variant='outline-secondary'
          onClick={() => handleDelete(player.pk,player.sk)}
        >
          X
        </Button>
      </td>
    </tr>
  );
};

export default Player;