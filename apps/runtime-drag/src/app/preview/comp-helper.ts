import { Type, ɵNG_COMP_DEF, ɵpatchComponentDefWithScope, ɵtransitiveScopesFor } from '@angular/core';

export function setScopeOnDeclaredComponents(moduleType: Type<any>, component: any) {
  const transitiveScopes = ɵtransitiveScopesFor(moduleType);
  const componentDef     = component[ɵNG_COMP_DEF];
  if (!componentDef) {
    console.error('not define comp');
  }
  ɵpatchComponentDefWithScope(componentDef, transitiveScopes);
}