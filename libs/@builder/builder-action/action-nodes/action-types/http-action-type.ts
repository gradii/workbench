export const httpActionType = {
  name     : 'http',
  namespace: 'gradii/action/http',
  children : [
    {
      name    : 'request', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'get', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'post', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    }
  ]
};