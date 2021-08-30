import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  isLoading: boolean=false;


  constructor(private authService: AuthService, 
              private tokenStorage: TokenStorageService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {

    const { username, password } = this.form;
    
    this.isLoading=true;
    this.authService.login(username, password).subscribe(
      data => {
        this.isLoading=false;
        if(data.hasOwnProperty("sessionId")) {
          this.tokenStorage.saveToken(data.sessionId);
          this.tokenStorage.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          //this.router.navigate(['/']);
          this.reloadPage();
        } else {
          this.errorMessage = "Invalid Login, Please try again";
          this.isLoginFailed = true;
        }
      },
      err => {
        this.isLoading=false;
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadCurrentRoute(): void {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}
