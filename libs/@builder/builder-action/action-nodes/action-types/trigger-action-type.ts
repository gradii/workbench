export const triggerActionType = {
  name         : 'trigger',
  namespace    : 'gradii/action/trigger',
  color        : 'rgb(167, 23, 23)',
  notAllowMulti: true,
  children     : [
    {
      name    : 'constructor', displayName: 'constructor', icon: '',
      inPorts : [],
      outPorts: [{ name: 'out' }]
    },
    {
      name    : 'on-init', displayName: 'on init', icon: '',
      inPorts : [],
      outPorts: [{ name: 'out' }]
    },
    {
      name    : 'do-check', displayName: 'do check', icon: '',
      inPorts : [],
      outPorts: [{ name: 'out' }]
    },
    {
      name    : 'on-destroy', displayName: 'on destroy', icon: '',
      inPorts : [],
      outPorts: [{ name: 'out' }]
    },
    {
      name    : 'custom', icon: '', notAllowMulti: false,
      inPorts : [],
      outPorts: [{ name: 'out' }]
    }
  ]
};