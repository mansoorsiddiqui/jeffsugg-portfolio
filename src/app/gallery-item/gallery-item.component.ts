import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../constants';

@Component({
  selector: 'app-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.css']
})
export class GalleryItemComponent implements OnInit {

  @Input() item: Project;
  @Input() width: Project;

  constructor() { }

  ngOnInit() {
  }

}
