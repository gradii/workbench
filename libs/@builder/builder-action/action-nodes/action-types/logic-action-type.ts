export const logicActionType = {
  name     : 'logic',
  namespace: 'gradii/action/logic',
  icon     : '',
  children : [
    {
      name       : 'if-condition',
      inPorts    : [
        { name: 'in' },
        { name: 'condition' },
        { name: 'nullable' }
      ], outPorts: [
        { name: 'true' },
        { name: 'false' },
        { name: 'null' }, { name: 'executed' }
      ],
      variant    : 'outlined',
      icon       : ''
    },
    {
      name    : 'map', variant: 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'switch-case', displayName: 'switch case',
      variant : 'outlined', icon: '',
      inPorts : [
        { name: 'in' }
      ],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'scripts',
      variant : 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'junction',
      variant : 'outlined', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    }
  ]
};
