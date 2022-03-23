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
        <td>{player.name}</td>
        <td>{player.points}</td>
        <td>
          {rds.map((r, index) => {
            const game = player.rounds[r];
            const opp = game.opp === '' ? '' : ` vs. ${game.opp}`;
            const win = game.win === 1;
            const noWinner = game.noWinner;

            let title = '';
            if (game.win === 1) title += 'Win';
            if (game.win === 0 && !noWinner && opp !== '') title += 'Loss';
            if (game.win === 0 && opp === '') title += `No game in Round ${index+1}`;
            if (noWinner && opp !== '') title += 'In progress';
            if (opp !== '') title += opp;

            let bg = (opp !== '') ? 'white' : 'lightgray';
            if(noWinner) bg = '#FFF59D';

            if (win) return ( <BsCheckSquare key={index} title={title} className='me-2' /> );
            else return ( <IdleBsSquare key={index} title={title} className='me-2' bgcolor={bg} /> );
          })}
        </td>
      </tr>
    </>
  );
}

export default StandingsPlayer;