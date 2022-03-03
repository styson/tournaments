import { Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import React from 'react';
import StandingsPlayer from './StandingsPlayer';

const Standings = ({ standings }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const pl = [];
    const s = Object.keys(standings);
    s.forEach(sk => {
      const p = standings[sk];
      const record = {
        sk,
        name: p.name,
        wins: 0,
        rounds: {},
      };

      const rds = Object.keys(p.rounds);
      rds.forEach(r => {
        const rd = p.rounds[r];
        record.rounds[r] = { win: rd.win };
        if(rd.win === 1) {
          record.wins = record.wins + 1;
        }
      });
      // "1":{"win":0,
      // {"scenario":
      //  "pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391",
      //  "sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_f16dc4f1-3f84-4143-8bdd-5e8739544f45",
      //  "name":"An Unexpected Complication",
      //  "id":"ON9"
      // },
      // "side":"Axis",
      // "opponent":{"sk":"PLAY_aea021fd-9f49-440e-be2a-2bdea95df30f","name":"Sam Tyson","rank":3,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}
      // }}

      // console.log(record)
      pl.push(record)
    });
    const orderedPlayers = pl.sort((a, b) => a.wins < b.wins ? 1 : -1);
    setPlayers(orderedPlayers);
  }, [standings]);

  return (
    <Row>
      <h4>Standings</h4>
      <div>
        {Array.from(players).length > 0 && (
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Wins</th>
              <th>Rounds</th>
            </tr>
          </thead>
          <tbody>
          {Array.from(players).map((p, index) => {
            return <StandingsPlayer key={p.sk} player={p} index={index} />;
          })}
          </tbody>
        </Table>
        )}
        {Array.from(players).length === 0 && (
          <p>No standings yet.</p>
        )}
      </div>
    </Row>
  );
}

export default Standings;

// "PLAY_0f863743-b1d5-48f2-8065-7215f1fffb2a":{"name":"Bill Cirillo","rounds":{"1":{"win":0,"scenario":{"sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_5edca12d-a8ec-44e5-a9ad-be3e2d101e81","name":"Storming Lommel","pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391","id":"DtF15"},"side":"","opponent":{"sk":"PLAY_da44e0e9-e473-4864-b348-26a5f8d60e27","name":"Alpha Joe","rank":2,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}}}},

// "PLAY_da44e0e9-e473-4864-b348-26a5f8d60e27":{"name":"Alpha Joe","rounds":{"1":{"win":1,"scenario":{"sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_5edca12d-a8ec-44e5-a9ad-be3e2d101e81","name":"Storming Lommel","pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391","id":"DtF15"},"side":"","opponent":{"sk":"PLAY_0f863743-b1d5-48f2-8065-7215f1fffb2a","name":"Bill Cirillo","rank":1,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}}}},

// "PLAY_aea021fd-9f49-440e-be2a-2bdea95df30f":{"name":"Sam Tyson","rounds":{"1":{"win":1,"scenario":{"sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_f16dc4f1-3f84-4143-8bdd-5e8739544f45","name":"An Unexpected Complication","pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391","id":"ON9"},"side":"Allied","opponent":{"sk":"PLAY_f1ef1618-9237-4d03-8a16-bdea3c4eec2b","name":"Ed Beekman","rank":7,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}}}},

// "PLAY_4a990ce7-386a-4b53-80b1-2047730b90c7":{"name":"Chuck Tewksbury","rounds":{"1":{"win":0,"scenario":{"sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_5edca12d-a8ec-44e5-a9ad-be3e2d101e81","name":"Storming Lommel","pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391","id":"DtF15"},"side":"Allied","opponent":{"sk":"PLAY_f6553f34-d244-4af1-832e-ee2e43fa86a9","name":"Bobby Lite","rank":5,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}}}},

// "PLAY_f6553f34-d244-4af1-832e-ee2e43fa86a9":{"name":"Bobby Lite","rounds":{"1":{"win":1,"scenario":{"sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_5edca12d-a8ec-44e5-a9ad-be3e2d101e81","name":"Storming Lommel","pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391","id":"DtF15"},"side":"Axis","opponent":{"sk":"PLAY_4a990ce7-386a-4b53-80b1-2047730b90c7","name":"Chuck Tewksbury","rank":4,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}}}},

// "PLAY_297f8866-fd55-4c3e-8ac2-6b21789520cd":{"name":"Arnold Shimo","rounds":{}},

// "PLAY_f1ef1618-9237-4d03-8a16-bdea3c4eec2b":{"name":"Ed Beekman","rounds":{"1":{"win":0,"scenario":{"sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_f16dc4f1-3f84-4143-8bdd-5e8739544f45","name":"An Unexpected Complication","pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391","id":"ON9"},"side":"Axis","opponent":{"sk":"PLAY_aea021fd-9f49-440e-be2a-2bdea95df30f","name":"Sam Tyson","rank":3,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}}}},

// "PLAY_129a71a6-4349-49a3-b847-8e0c5dcff947":{"name":"Will Farrell","rounds":{"1":{"win":0,"scenario":{"sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_8727c166-0e49-4952-9705-89c899ba2d9f","name":"Scotch On The Rocks","pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391","id":"WCW2"},"side":"Allied","opponent":{"sk":"PLAY_54584c7a-896e-4623-9846-36fc2429d9e6","name":"David Goldman","rank":9,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}}}},

// "PLAY_54584c7a-896e-4623-9846-36fc2429d9e6":{"name":"David Goldman","rounds":{"1":{"win":1,"scenario":{"sk":"ROUN_1_fe0dd805-5f47-4995-848c-cc6c1679bb86_SCEN_8727c166-0e49-4952-9705-89c899ba2d9f","name":"Scotch On The Rocks","pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391","id":"WCW2"},"side":"Axis","opponent":{"sk":"PLAY_129a71a6-4349-49a3-b847-8e0c5dcff947","name":"Will Farrell","rank":8,"pk":"TOUR_fa628436-7014-41fe-b596-7e8431dbd391"}}}}
