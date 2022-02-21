const initialData = {
  tasks: {
    'scenario-1': { id: 'scenario-1', ref: 'DtF15', content: 'Storming Lommel' },
    'scenario-2': { id: 'scenario-2', ref: 'ON10', content: 'Chateau Of Death' },
    'scenario-3': { id: 'scenario-3', ref: 'ON9', content: 'An Unexpected Complication' },
    'scenario-4': { id: 'scenario-4', ref: 'WCW2', content: 'Scotch On The Rocks' },
    'scenario-5': { id: 'scenario-5', ref: 'HG12', content: 'Bumps Along The Road' },
    'scenario-6': { id: 'scenario-6', ref: 'J41', content: 'By Ourselves' },
  },
  columns: {
    'round-1': {
      id: 'round-1',
      title: 'Round 1',
      scenarioIds: ['scenario-1', 'scenario-2', 'scenario-3', 'scenario-4'],
    },
    'round-2': {
      id: 'round-2',
      title: 'Round 2',
      scenarioIds: ['scenario-5', 'scenario-6'],
    },
  },
  // Facilitate reordering of the rounds
  roundOrder: ['round-1', 'round-2'],
};

export default initialData;