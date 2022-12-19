import { StateConverterService } from '@shared/communication/state-converter.service';
import { CodeGenVisitor } from '../../src/lib/runtime/code-gen-visitor';
import { Definitions } from './definitions';
import { Slots } from './slots';
import '@angular/compiler';
import { StateConverterTestingService } from '../../testing/state-converter-testing.service';

describe('runtime generate', () => {
  it('should generate a runtime', () => {
    const stateConverterService = new StateConverterTestingService();
    const data                  = stateConverterService.testConvertPage('1', Definitions, Slots);

    const visitor = new CodeGenVisitor();
    const slot    = data.content;
    visitor.visit(slot);

    const output = visitor.flush();

    expect(output).toMatchSnapshot();
  });
});
