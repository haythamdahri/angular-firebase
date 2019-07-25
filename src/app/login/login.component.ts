import { Title } from "@angular/platform-browser";
import { AuthService } from './../shared/auth.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  @ViewChild('loginBtn') loginButton: ElementRef;
  loginError: boolean = false;

  constructor(private authService: AuthService, private router: Router, 
    private title: Title) {}

  ngOnInit() {
    this.user = new User();
    this.user.email = '';
    this.user.password = '';
  }

  onLogin() {
    this.title.setTitle('Login');
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
      Swal.fire('Invalid data', 'Please fill login data!', 'warning');
    }
  }
}
