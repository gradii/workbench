import { Injectable } from '@angular/core';
import { InterpolationType, Scope, WorkflowStepParameter } from '@common/public-api';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { InterpolateService } from './interpolate.service';

@Injectable()
export class ExecutorUtilService {
  constructor(private interpolateService: InterpolateService) {
  }

  interpolateString(content: string, scope: Scope): string {
    return this.interpolateService.interpolate(content, scope, InterpolationType.STRING);
  }

  executeCode(codeString: string, scope: Scope): any {
    return this.interpolateService.interpolate(codeString, scope, InterpolationType.CODE);
  }

  executeCustomCode(codeString: string, scope: Scope): any {
    return this.interpolateService.interpolate(codeString, scope, InterpolationType.CUSTOM_CODE);
  }

  // { key: 'text {{varId}}' } => '{ key: `text ${varId}` }' => { key: 'text varValue' }
  interpolateCustomParams(param: WorkflowStepParameter, scope: Scope): { [key: string]: string } {
    let objectString = `{`;
    for (const { name, value } of param.value) {
      const valueForInterpolation = value.replace(/{{([^}]+)}}/gm, '${$1}');
      objectString += `'${name}': \`${valueForInterpolation}\`,`;
    }
    objectString += '}';
    return this.interpolateService.interpolate(objectString, scope, InterpolationType.CODE);
  }

  executeAsyncCodeUNSAFE(codeString: string, scope: Scope): Observable<any> {
    const interpolatedCode: string = this.interpolateService.interpolateCodeToCode(
      codeString,
      InterpolationType.CUSTOM_CODE
    );
    const argumentsNames: string = Array.from(Object.keys(scope.values)).join(',');
    const argumentsValues: string = Array.from(Object.values(scope.values))
      .map(val => JSON.stringify(val))
      .join(',');

    const asyncFunctionString = `(async function(${argumentsNames}){ ${interpolatedCode} })(${argumentsValues})`;
    // This definition is needed to set requireAsync visible in eval to execute custom code
    const requireAsync = this.requireAsync;
    // tslint:disable-next-line
    const result = eval(asyncFunctionString);
    return from(result).pipe(
      switchMap((value: any) => {
        if (value?.subscribe) {
          return value;
        } else {
          return of(value);
        }
      })
    );
  }

  private async requireAsync(dependencyName: string): Promise<any> {
    const dependencies = {
      // Webpack comment is required for proper dynamic import node_module package
      // 'aws-amplify': import(/* webpackChunkName: "aws-amplify" */ 'aws-amplify'),
      // 'aws-appsync': import(/* webpackChunkName: "aws-appsync" */ 'aws-appsync'),
      'graphql-tag': import(/* webpackChunkName: "graphql-tag" */ 'graphql-tag')
    };
    const dependency = dependencies[dependencyName];
    if (dependency) {
      return dependency;
    } else {
      throw Error(`Usage of ${dependencyName} is not permitted.`);
    }
  }
}
