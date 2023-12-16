module.exports = {
  name: '@gradii-utils',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/@gradii-utils',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
