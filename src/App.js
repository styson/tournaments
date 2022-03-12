import '@aws-amplify/ui-react/styles.css';
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';
import Home from './pages/home';
import Players from './pages/players';
import Scenarios from './pages/scenarios';
import Setup from './pages/setup';
import Tournament from './pages/tournament';
import Tournaments from './pages/tournaments';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/tournaments' element={<Tournaments />} />
        <Route exact path='/players' element={<Players />} />
        <Route exact path='/scenarios' element={<Scenarios />} />
        <Route path="/setup" element={<Setup />}>
          <Route path=':sk' element={<Setup />} />
        </Route>
        <Route path="/tournament" element={<Tournament />}>
          <Route path=':sk' element={<Tournament />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App, {
});