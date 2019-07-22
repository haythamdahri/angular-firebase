import { AuthService } from './../shared/auth.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  @ViewChild('loginBtn') loginButton: ElementRef;
  loginError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = new User();
  }

  onLogin() {
    if (this.user.email !== '' && this.user.password !== '') {
      (<HTMLInputElement>this.loginButton.nativeElement).innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Login';
      (<HTMLInputElement>this.loginButton.nativeElement).disabled = true;
      this.authService
        .loginWithEmailAndPassword(this.user.email, this.user.password)
        .then(user => {
          this.router.navigate(['clients']);
        })
        .catch(erro => {
          this.loginError = true;
          (<HTMLInputElement>this.loginButton.nativeElement).innerHTML =
            '<i class="fas fa-sign-in-alt"></i> Login';
          (<HTMLInputElement>this.loginButton.nativeElement).disabled = false;
        });
    } else {
      alert('Please fill login data');
    }
  }
}
