export const authActionType = {
  name     : 'auth',
  namespace: 'gradii/action/auth',
  children : [
    {
      name    : 'auth-service', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'user-service', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    }
  ]
};