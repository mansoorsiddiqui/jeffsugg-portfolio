import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  items = [];
  width: number;
  columns = 1;

  constructor(
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.width = this.el.nativeElement.offsetWidth;
    this.columns = (this.width > 1024) ? 3 : (this.width > 640) ? 2 : 1 ;
    console.log(this.width, this.columns);
    for (let i = 0; i < this.columns; i++) {
      this.items.push([]);
    }
    for (let i = 1; i < 30; i++) {
      this.items[(i-1)%this.columns].push({
        title: i,
        src: `./assets/${i}.jpg`,
      })
    }
    console.log(this.items);
  }

}
