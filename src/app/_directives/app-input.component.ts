import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  template: `  <input type="text" [(ngModel)]="inputModel" (ngModelChange)="inputModelChange.emit(inputModel)"/>`,
  styleUrls: ['./app-input.component.scss']
})
export class AppInputComponent {
  @Input() inputModel: string;
  @Output() inputModelChange = new EventEmitter<string>();
}