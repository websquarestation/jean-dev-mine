// my-loader.component.ts
import { Component, OnInit } from '@angular/core';
import { LoaderService } from './../../_services/loader.service';

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.css']
})
export class MyLoaderComponent implements OnInit {

  loading: boolean = false;

  constructor(private loaderService: LoaderService) {

    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
    });

  }
  ngOnInit() {
  }

}