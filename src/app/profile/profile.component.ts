import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './../_services/token-storage.service';

import { Profile } from './../models/profile.model';
import { ProfileService } from '../_services/profile.service';
import { NotificationService } from '../_services/notification.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  cuser: any;
  CreationDate: any;
  showEditProfile: boolean;
  showChangePassword: boolean;
  public profileModel: any;
  firstName: any;
  lastName: any;
  createdStatus: boolean;
  isFormSubmitted: boolean;
  isCFormSubmitted: boolean;
  changetatus: boolean;
  newPassword: any;
  confirmPassword: any;
  passwordMatched: boolean = true;

  messageTitle: string = "Profile Update";

  @ViewChild('editProfileBtn', { read: ElementRef, static: false }) editProfileBtn: ElementRef;
  @ViewChild('changePasswordBtn', { read: ElementRef, static: false }) changePasswordBtn: ElementRef;
  constructor(private tokenStorage: TokenStorageService,
    private router: Router,
    private profileService: ProfileService,
    private notifyService: NotificationService) {
    this.profileModel = new Profile();
  }

  ngOnInit(): void {
    this.cuser = this.tokenStorage.getUser();
    this.CreationDate = new Date();
    this.getProfile();

  }

  getProfile(): void {
    const id = this.cuser.id;
    this.profileService.getProfile(id)
      .subscribe(
        (res: any) => {
          this.profileModel = res;
        },
        err => {
          //console.log("prpfile error", err);
          this.notifyService.showError("Get Profile Error: " + err, this.messageTitle);
        }
      );
  }

  editProfile(): void {
    this.showEditProfile = true;
    this.editProfileBtn.nativeElement.classList.add('btn-primary');
    this.editProfileBtn.nativeElement.classList.remove('btn-outline-primary');
    this.showChangePassword = false;
    this.changePasswordBtn.nativeElement.classList.remove('btn-primary');
    this.changePasswordBtn.nativeElement.classList.add('btn-outline-primary');
  }

  changePassword(): void {
    this.showEditProfile = false;
    this.editProfileBtn.nativeElement.classList.remove('btn-primary');
    this.editProfileBtn.nativeElement.classList.add('btn-outline-primary');
    this.showChangePassword = true;
    this.changePasswordBtn.nativeElement.classList.add('btn-primary');
    this.changePasswordBtn.nativeElement.classList.remove('btn-outline-primary');
  }

  onSubmit(form: any): void {
    let formData = form.form.value;
    const id = this.cuser.id;
    this.profileService.submitProfile(id, formData)
      .subscribe(
        (res: any) => {
          //console.log("response", res);
          this.notifyService.showSuccess("Profile updated successfully !!", this.messageTitle);
          this.router.navigateByUrl('/enteries');
        },
        err => {
          //console.log("enteries error", err);
          this.notifyService.showError("Profile Update Error: " + err.message, this.messageTitle);
        }
      );
  }

  onChangeSubmit(form: any): void {
    let formData = form.form.value;
    if (formData.newPassword !== formData.confirmPassword) {
      this.passwordMatched = false;
    } else {
      let putData = { "password": formData.newPassword };
      const id = this.cuser.id;
      this.profileService.changePassword(id, putData)
        .subscribe(
          (res: any) => {
            console.log("response", res);
            this.notifyService.showSuccess("Password Changed successfully !!", this.messageTitle);
            this.router.navigateByUrl('/enteries');
          },
          err => {
            console.log("enteries error", err);
            this.notifyService.showError("Changed Password Error: " + err.message, this.messageTitle);
          }
        );
    }
  }

  gotoBack(): void {
    this.router.navigate(['/enteries']);
  }
}
