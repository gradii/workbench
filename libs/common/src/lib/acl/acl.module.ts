import { NgModule } from '@angular/core';
import { NbSecurityModule } from '@nebular/security';

import { aclConfig } from './acl-config';
import { AclService } from './acl.service';

@NgModule({
  imports: [NbSecurityModule.forRoot(aclConfig)],
  providers: [AclService]
})
export class AclModule {
}
