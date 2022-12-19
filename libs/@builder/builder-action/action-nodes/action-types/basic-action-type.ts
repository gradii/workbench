export const basicActionType = {
  name     : 'basic',
  namespace: 'gradii/action/basic',
  icon     : '',
  children : [
    {
      name    : 'string',
      inPorts : [],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'numeric',
      inPorts : [],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'boolean',
      inPorts : [],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'array',
      inPorts : [],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    }
  ]
};