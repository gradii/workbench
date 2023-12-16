module.exports = {
  name: 'workbench',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/workbench',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
