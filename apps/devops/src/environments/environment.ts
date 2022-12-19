// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production         : false,
  server_info        : {
    host   : 'localhost',
    ws_port: 3201
  },
  //直连, 表示浏览器直连
  directConnectServer: false,
  host               : 'http://localhost:8200',
  wsHost             : ((location.protocol === "https:") ? "wss://" : "ws://") + location.host,

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
