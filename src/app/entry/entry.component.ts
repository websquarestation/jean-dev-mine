import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnteriesService } from '../_services/enteries.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  entry: any = {};
  currentRate: number = 0;
  constructor(private enteriesService: EnteriesService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.enteriesService.detail(id)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.entry = res;
          this.currentRate = res.ratingStars;
        },
        err => {
          console.log("entry errpr", err);
        }
      );
  }

  gotoBack(): void {
    this.router.navigate(['/enteries']);
  }
}
