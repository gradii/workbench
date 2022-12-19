export const formActionType = {
  name     : 'form',
  namespace: 'gradii/action/form',
  children : [
    {
      name    : 'Validation', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'Init', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'Submit', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    }
  ]
};