import { BsCheckSquare, BsSquare } from 'react-icons/bs';
import React from 'react';
import styled from 'styled-components';

const IdleBsSquare = styled(BsSquare)`
  background-color: ${props => props.bgcolor || 'inherit'};
`;

const StandingsPlayer = ({ player }) => {
  const rds = Object.keys(player.rounds);
  return (
    <>
      <tr>
        <td>{player.name} <sup>{player.rank}</sup></td>
        <td>{player.wins}</td>
        <td>
          {rds.map((r, index) => {
            const game = player.rounds[r];
            const opp = game.opp === '' ? '' : ` vs. ${game.opp}`;
            const win = game.win === 1;

            let title = '';
            if (game.win === 1) title += 'Win';
            if (game.win !== 1 && opp !== '') title += 'Loss';
            if (game.win !== 1 && opp === '') title += 'No game.';
            if (opp !== '') title += opp;
            const bg = (opp !== '') ? 'white' : 'lightgray';

            if (win) return ( <BsCheckSquare key={index} title={title} className='me-2' /> );
            else return ( <IdleBsSquare key={index} title={title} className='me-2' bgcolor={bg} /> );
          })}
        </td>
      </tr>
    </>
  );
}

export default StandingsPlayer;