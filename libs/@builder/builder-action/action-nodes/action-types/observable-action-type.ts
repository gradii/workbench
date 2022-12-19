export const observableActionType = {
  name     : 'observable',
  namespace: 'gradii/action/observable',
  icon     : '',
  children : [
    {
      name       : 'observable-subscribe',
      inPorts    : [
        { name: 'in' }
      ], outPorts: [
        { name: 'out' }
      ],
      variant    : 'outlined',
      icon       : ''
    },
    {
      name       : 'pipe-map',
      inPorts    : [
        { name: 'in' }
      ], outPorts: [
        { name: 'out' }
      ],
      variant    : 'outlined',
      icon       : ''
    }
  ]
};
