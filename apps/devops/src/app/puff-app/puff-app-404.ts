/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

@Component({
  template: `
    <h1>404</h1>
    <p>This page does not exist</p>
    <a triButton routerLink="/">Go back to the home page</a>
  `,
  host    : {'class': 'tri-typography'},
})
export class PuffApp404 {
}
