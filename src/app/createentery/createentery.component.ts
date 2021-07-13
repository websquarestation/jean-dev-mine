import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-createentery',
  templateUrl: './createentery.component.html',
  styleUrls: ['./createentery.component.css']
})
export class CreateenteryComponent implements OnInit {
  form: any = {
    username: 'Administator',
    password: 'Administator'
  };

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    
  }
}
