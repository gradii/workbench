module.exports = {
  name: 'uibakery',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/uibakery',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
