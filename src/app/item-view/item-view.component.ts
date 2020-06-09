import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {

  item: any;

  constructor() { }

  ngOnInit() {
    this.item = this.getItem();
  }

  getItem() {
    return JSON.parse(localStorage.getItem('currentItem'));
  }

}
