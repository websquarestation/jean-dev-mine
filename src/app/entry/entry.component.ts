import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnteriesService } from '../_services/enteries.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  entry: any = {};
  currentRate: number = 0;
  id: any = 0;
  rd: boolean = true;
  editratingDescription: boolean = false;
  constructor(private enteriesService: EnteriesService,
    private route: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getEntry();
  }

  getEntry(): void {
    this.enteriesService.detail(this.id)
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

  updateEntry(field: any, val: any): void {
    let data: any = [];
    data.push(val.toString());
    
    this.enteriesService.updateField(this.id, field, data)
      .subscribe(
        (res: any) => {
          console.log("response", res);
          this.notifyService.showSuccess("Entry updated successfully !!", "View Entry");
        },
        err => {
          //console.log("enteries error", err);
          this.notifyService.showError("Entry error: " + err.message, "View Entry");
        }
      );
  }

  gotoBack(): void {
    this.router.navigate(['/enteries/folder/personal']);
  }
}
