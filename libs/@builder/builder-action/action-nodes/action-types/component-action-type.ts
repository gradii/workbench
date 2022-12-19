export const componentActionType = {
  name     : 'component',
  namespace: 'gradii/action/component',
  icon     : '',
  children : [
    // can't write variable because can't detect the flow execute order
    // uncomment now. but must add out
    {
      name    : 'assign-variable', displayName: 'assign variable',
      icon    : '',
      inPorts : [
        { name: 'in' },
        { name: 'var' }
      ],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'state', icon: '',
      inPorts : [
        { name: 'state1' },
        { name: 'state2' },
        { name: 'state3' },
        { name: 'state4' }
      ],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'event', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'run-action', icon: '',
      inPorts : [{ name: 'in' }],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    },
    {
      name    : 'card',
      inPorts : [
        { name: 'visible' },
        { name: 'display' }
      ],
      outPorts: [{ name: 'out' }, { name: 'executed' }]
    }
  ]
};