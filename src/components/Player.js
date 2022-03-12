import { Button } from 'react-bootstrap';
import React from 'react';

const Player = ({ player, handleDelete, handleRowClick }) => {
  return (
    <tr
      className='player'
      onClick={() => handleRowClick(player.pk, player.sk)}
    >
      <td>{player.name}</td>
      <td>{player.rating}</td>
      <td>{player.email}
        <Button 
          key={`b${player.sk}`}
          className='float-end me-2'
          size='sm'
          variant='outline-secondary'
          onClick={(e) => {
            e.preventDefault();
            handleDelete(player.pk, player.sk);
          }}
        >
          X
        </Button>
      </td>
    </tr>
  );
};

export default Player;