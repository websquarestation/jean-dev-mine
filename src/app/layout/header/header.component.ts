import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from './../../_services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  username = '';

  constructor (
        private router: Router,
        private tokenStorageService: TokenStorageService) {
    console.log(this.tokenStorageService.getToken()); 
  }

  ngOnInit(): void { 
    const user = this.tokenStorageService.getUser();
    if(user) {
      this.username = user.firstName + ' ' + user.lastName;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }

  createEntery(type: String): void {
    this.router.navigate(['/create/entery'], { queryParams: { type: type } });
  }

  localSearch(): void {
    this.router.navigate(['/search']);
  }
}
