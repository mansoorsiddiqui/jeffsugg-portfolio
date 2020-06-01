import { Component, OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ContentfulService } from 'src/app/contentful.service';
import { Entry } from 'contentful';
import { SCREEN_SIZE, Project } from '../constants';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  projects: Entry<any>[];
  images = [];
  columns = [];
  numColumns = 1;
  loaded = 0;
  screenWidth: number;

  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    private contentfulService: ContentfulService
  ) { }

  async ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.setColumns();
    this.watchForResize();
    await this.loadProjects();
    console.log(this.projects);
    this.projects.forEach(project => console.log(this.getThumbnailUrl(project, 640)));
    this.sortProjects();
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

  setColumns() {
    this.columns = [];
    const width = this.el.nativeElement.offsetWidth;
    this.numColumns = (width > SCREEN_SIZE.LARGE) ? 4
                        : (width > SCREEN_SIZE.MEDIUM) ? 3
                        : (width > SCREEN_SIZE.SMALL) ? 2
                        : 1 ;
    for (let i = 0; i < this.numColumns; i++) {
      this.columns.push([]);
    }
  }

  watchForResize() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.pipe(debounceTime(500)).subscribe((e) => this.recalculateColumns(e));
  }

  recalculateColumns(e) {
    if (this.screenWidth !== e.target.innerWidth) {
      this.setColumns();
      this.sortProjects();
      this.screenWidth = e.target.innerWidth;
    }
  }

  async loadProjects() {
    return this.contentfulService.getProjects().then(projects => this.projects = projects);
  }

  sortProjects() {
    let currentColumn = 0;
    this.projects.forEach(project => {
      const item: Project = {
        title: project.fields.title,
        description: project.fields.description,
        thumbnail: this.getThumbnailUrl(project, 640),
        show: false,
      };
      this.columns[currentColumn % this.numColumns].push(item);
      currentColumn++;
      console.log(this.columns);
    });
  }

  getThumbnailUrl(project: Entry<any>, width: number) {
    return `https:${project.fields.images[0].fields.file.url}?fm=jpg&fl=progressive&w=${width}&q=90`;
  }

}
