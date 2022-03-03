import { BsCheckSquare, BsSquare } from 'react-icons/bs';
import React from 'react';

const StandingsPlayer = ({ player }) => {
  const rds = Object.keys(player.rounds);
  return (
    <>
      <tr>
        <td>{player.name}</td>
        <td>{player.wins}</td>
        <td>
          {rds.map((r, index) => {
            if (player.rounds[r].win === 1) return ( <BsCheckSquare key={index} /> );
            else return ( <BsSquare key={index} /> );
          })}
        </td>
      </tr>
    </>
  );
}

export default StandingsPlayer;