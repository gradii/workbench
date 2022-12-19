import { NgModule } from '@angular/core';
import { TriSecurityModule } from '@gradii/triangle/security';

import { aclConfig } from './acl-config';
import { AclService } from './acl.service';

@NgModule({
  imports: [TriSecurityModule.forRoot(aclConfig)],
  providers: [AclService]
})
export class AclModule {
}
