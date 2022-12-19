export const environment = {
  production         : true,
  server_info        : {
    host   : 'localhost',
    ws_port: 3201
  },
  //当前不需要直连
  directConnectServer: false,
  host               : 'https://reiki-punch.gradii.com',
  wsHost             : 'wss://reiki-punch.gradii.com',

  name: 'prod',
  formBuilder: false,
  baseHref: '/',
  workbenchUrl: 'http://localhost:4201',
  apiUrl: '/api',
  appServerName: 'https://app.local',
  landingPath: 'https://landing.local',
  downloadCodeUrl: 'https://help-download-url',
  stripeKey: 'x',
  auth: {
    googleClientId: 'xxxx'
  },
  cloudDomain: 'uibakery.app',
  // azure blob storage container prefix
  azureAssetsContainerPrefix: 'https://sauibakeryprod.blob.core.windows.net/assets-container/',
  tutorialsPrefix: 'https://academy.gradii.local/tutorials/',
  sampleTemplateId: 'xxxx',
  hostingDomain: 'uibakery.azureedge.net'
};
