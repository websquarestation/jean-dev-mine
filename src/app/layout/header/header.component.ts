import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { TokenStorageService } from './../../_services/token-storage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  username = '';
  searchKeyword: string | null;
  constructor (
        private router: Router,
        private tokenStorageService: TokenStorageService,
        private route: ActivatedRoute,
        private location: Location   ) {
  }

  ngOnInit(): void { 
    const user = this.tokenStorageService.getUser();
    if(user) {
      this.username = user.firstName + ' ' + user.lastName;
    }
    this.searchKeyword = this.route.snapshot.paramMap.get('keyword');
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }

  createEntery(type: String): void {
    this.router.navigate(['/create/entery'], { queryParams: { type: type } });
  }

  localSearch(): void {
    if (this.searchKeyword != '' || this.searchKeyword != null) {
      this.router.navigateByUrl(`/enteries/${this.searchKeyword}`);
    }
  }

  goToProfile(): void {
    this.router.navigateByUrl(`/profile`);
  }
}
