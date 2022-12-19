import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserFacade } from '@auth/user-facade.service';
import { TriAuthService } from '@gradii/triangle/auth';


@Component({
  selector: 'dt-workbench-home',
  templateUrl: './home-workbench.component.html',
  styleUrls: ['./home-workbench.component.scss']
})
export class HomeWorkbenchComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  userMenu: any[]          = [
    { title: '修改密码', link: '/auth/reset-password' },
    { title: '注销', link: '/auth/logout' }
  ];

  userAccountName$ = this.userFacade.accountName$;
  realName$        = this.userFacade.realName$;

  constructor(private authService: TriAuthService,
              private userFacade: UserFacade) {
  }


  ngOnInit() {

    // this.nbMenuService.onItemClick()
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     filter(({ tag }) => tag === 'avatar-context-menu'),
    //     tap((data) => {
    //       console.log(data);
    //     }),
    //     map(({ item: { title, data } }) => {
    //       if(data === 'logout') {
    //         // this.nbAuthService.logout()
    //       }
    //     })
    //   )
    //   .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
