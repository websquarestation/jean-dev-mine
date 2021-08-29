import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from './../_services/token-storage.service';

import { Profile } from './../models/profile.model';
import { ProfileService } from '../_services/profile.service';
import { NotificationService } from '../_services/notification.service'
import { PreferencesService } from '../_services/preferences.service'

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
  selectedItem: any = 'profile';
  principalInvestigatorEdit: boolean = false;
  fundingSourceEdit: boolean = false;
  principalInvestigatorInput: boolean = false;
  fundingSourceInput: boolean = false;
  principalInvestigatorEditable: boolean = true;
  fundingSourceEditable: boolean = true;
  principalInvestigator: string;
  fundingSource: string;
  rightNavItems: any = [
    {
      title: 'Profile',
      icon: 'fa-user',
      slug: 'profile'
    },
    {
      title: 'Settings',
      icon: 'fa-cog',
      slug: 'settings'
    },
    {
      title: 'Private Groups',
      icon: 'fa-users',
      slug: 'groups'
    },
    {
      title: 'Messages',
      icon: 'fa-envelope',
      slug: 'messages'
    },
    {
      title: 'Samples',
      icon: 'fa-shopping-cart',
      slug: 'samples'
    },
    {
      title: 'Entries',
      icon: 'fa-list',
      slug: 'entries'
    },
    {
      title: 'API Keys',
      icon: 'fa-key',
      slug: 'apikeys'
    }];
  messageTitle: string = "Profile Update";
  PreferencesModel: any;

  @ViewChild('editProfileBtn', { read: ElementRef, static: false }) editProfileBtn: ElementRef;
  @ViewChild('changePasswordBtn', { read: ElementRef, static: false }) changePasswordBtn: ElementRef;
  constructor(private tokenStorage: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private notifyService: NotificationService,
    private preferencesService: PreferencesService,
    private elementRef: ElementRef  ) {
    this.profileModel = new Profile();
  }

  ngOnInit(): void {
    this.cuser = this.tokenStorage.getUser();
    this.CreationDate = new Date();
    this.getProfile();
    this.selectedItem = 'profile';
    this.route.params.subscribe(params => {
      this.selectedItem = params['slug'];
    });

    if(this.selectedItem == 'settings') {
      this.getPreferences();
      this.messageTitle = 'Settings Update';
    }
  }

  getPreferences(): void {
    const id = this.cuser.id;
    this.preferencesService.get(id)
      .subscribe(
        (res: any) => {
          if (res.hasOwnProperty('preferences') >= 0 && res.preferences.length > 0) {
            res.preferences.forEach((val: any) => {
              if (val.key == 'PRINCIPAL_INVESTIGATOR') {
                this.principalInvestigator = res.preferences[0].value;
              }
              if (val.key == 'FUNDING_SOURCE') {
                this.fundingSource = res.preferences[1].value;
              }
            });
          }
          //this.PreferencesModel = res;
        },
        err => {
          //console.log("prpfile error", err);
          this.notifyService.showError("Get Preferences Error: " + err, this.messageTitle);
        }
      );
  }

  saveSettingsVal(name: string): void {
    let val = '';
    if (name == 'PRINCIPAL_INVESTIGATOR') {
      val = this.principalInvestigator;
      this.principalInvestigatorInput = false;
      this.principalInvestigatorEditable = true;
    } else if (name == 'FUNDING_SOURCE') {
      val = this.fundingSource;
      this.fundingSourceInput = false;
      this.fundingSourceEditable = true;
    }
    this.preferencesService.save(name, val).subscribe(data => {
      console.log(data);
      this.notifyService.showSuccess("Save Preferences Success !!", this.messageTitle);
      // do something, if upload success
    }, error => {
      console.log(error);
      this.notifyService.showError("Save Preferences Error: " + error.message, this.messageTitle);
    });
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

  profileNav(slug: string): void {
    this.selectedItem = slug;
    this.router.navigate([`/profile/${slug}`]);

  }

  gotoBack(): void {
    this.router.navigate(['/enteries']);
  }
}
