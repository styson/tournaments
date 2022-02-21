const initialData = {
  scenarios: {
    'scenario-1': { pk: 'scenario-1', id: 'DtF15', name: 'Storming Lommel' },
    'scenario-2': { pk: 'scenario-2', id: 'ON10', name: 'Chateau Of Death' },
    'scenario-3': { pk: 'scenario-3', id: 'ON9', name: 'An Unexpected Complication' },
    'scenario-4': { pk: 'scenario-4', id: 'WCW2', name: 'Scotch On The Rocks' },
    'scenario-5': { pk: 'scenario-5', id: 'HG12', name: 'Bumps Along The Road' },
    'scenario-6': { pk: 'scenario-6', id: 'J41', name: 'By Ourselves' },
  },
  columns: {
    'round-1': {
      id: 'round-1',
      title: 'Round 1',
      scenarioSks: ['scenario-1', 'scenario-2', 'scenario-3', 'scenario-4'],
    },
    'round-2': {
      id: 'round-2',
      title: 'Round 2',
      scenarioSks: ['scenario-5', 'scenario-6'],
    },
  },
  // Facilitate reordering of the rounds
  roundOrder: ['round-1', 'round-2'],
};

export default initialData;