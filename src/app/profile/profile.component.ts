import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './../_services/token-storage.service';

import { Profile } from './../models/profile.model';

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

  @ViewChild('editProfileBtn', { read: ElementRef, static: false }) editProfileBtn: ElementRef;
  @ViewChild('changePasswordBtn', { read: ElementRef, static: false }) changePasswordBtn: ElementRef;
  constructor(private tokenStorage: TokenStorageService,
    private router: Router) {
    this.profileModel = new Profile();
  }

  ngOnInit(): void {
    this.cuser = this.tokenStorage.getUser();
    this.CreationDate = new Date();
    console.log(this.cuser);

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
    console.log(formData);
  }

  gotoBack(): void {
    this.router.navigate(['/enteries']);
  }
}
