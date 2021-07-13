import { Component } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jean-ui1';
  isLoggedIn = false;
  username = '';
  status = null;

  constructor (
        private router: Router,
        private tokenStorageService: TokenStorageService) {
    
    console.log(this.tokenStorageService.getToken());
  }

  ngOnInit(): void {
    console.log(this.tokenStorageService.getToken());
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
}
