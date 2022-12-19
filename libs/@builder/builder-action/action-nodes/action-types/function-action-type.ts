export const functionActionType = {
  name     : 'function',
  namespace: 'gradii/action/function',
  children : [
    {
      name    : 'function', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'observable', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'promise', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    }
  ]
};