import { DetailList } from '../styled/Details';
import React from 'react';

const ArchiveData = ({ data }) => {
  let aWins = data.playings ? ` (${data.playings[0].attacker_wins}` : '';
  let dWins = data.playings ? ` (${data.playings[0].defender_wins}` : '';
  if (aWins > '' && data.playings[0].totalGames > 0) {
    aWins += ` - ${Math.round(data.playings[0].attacker_wins / data.playings[0].totalGames * 100)}%`;
    dWins += ` - ${Math.round(data.playings[0].defender_wins / data.playings[0].totalGames * 100)}%`;
  }
  if (aWins > '') {
    aWins += ')';
    dWins += ')';
  }

  const maps = data.maps ? data.maps.join(', ') : '';
  const plural = data.maps ? data.maps.length === 1 ? '' : 's' : 's';
  return (
    <DetailList>
      <li><b>Id:</b> {data.sc_id}</li>
      <li><b>Title:</b> {data.title}</li>
      <li><b>Attacker:</b> {data.attacker}{aWins}</li>
      <li><b>Defender:</b> {data.defender}{dWins}</li>
      <li><b>Board{plural}:</b> {maps}</li>
    </DetailList>
  );
};

export default ArchiveData;