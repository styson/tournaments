import '@aws-amplify/ui-react/styles.css';
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';
import Home from './pages/home';
import Scenarios from './pages/scenarios';
import Tournaments from './pages/tournaments';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/tournaments' element={<Tournaments />} />
        <Route exact path='/scenarios' element={<Scenarios />} />
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);