import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { fnCheckForm } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { LoginInOutService } from '@app/core/services/login-in-out.service';
import { LoginService, Role } from '@app/core/services/login.service';
import { SpinService } from '@app/core/services/store/spin.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzTabsModule, NzGridModule, NzButtonModule, NzInputModule, NzWaveModule, NzCheckboxModule, NzIconModule, RouterLink]
})
export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;
  destroyRef = inject(DestroyRef);
  constructor(
    private fb: FormBuilder,
    private loginInOutService: LoginInOutService,
    private loginService: LoginService,
    private spinService: SpinService,
    private router: Router
  ) {}

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.spinService.setCurrentGlobalSpinStore(true);
    const param = this.validateForm.getRawValue();
    this.loginService
      .login(param)
      .pipe(
        finalize(() => {
          this.spinService.setCurrentGlobalSpinStore(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(account => {
        this.loginInOutService
          .loginIn(account)
          .then(() => {
            if(account.role===Role.CLIENT){
              this.router.navigateByUrl('/default/client-portal');
            }
            if(account.role===Role.SALES){
              this.router.navigateByUrl('/default/sales-portal');
            }
          })
          .finally(() => {
            this.spinService.setCurrentGlobalSpinStore(false);
          });
      });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [null]
    });
  }
}
