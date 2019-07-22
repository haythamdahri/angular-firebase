import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AuthService } from "./../shared/auth.service";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
