import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBY7sc5L1Snk3dFBBFA4BxrExg92mwl4KE",
  authDomain: "jeffsugg-portfolio.firebaseapp.com",
  databaseURL: "https://jeffsugg-portfolio.firebaseio.com",
  projectId: "jeffsugg-portfolio",
  storageBucket: "jeffsugg-portfolio.appspot.com",
  messagingSenderId: "932264466430",
  appId: "1:932264466430:web:ad5f5e70689b73ebb6d2af",
  measurementId: "G-E1GKQTTZYP"
};
firebase.initializeApp(firebaseConfig);

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  images = [];
  items = [];
  width: number;
  columns = 1;
  loaded = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  imageLoaded(e) {
    this.loaded++;
    if (this.loaded === this.images.length) {
      this.renderer.setStyle(this.el.nativeElement, 'visibility', 'visible');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    }
  }

  async ngOnInit() {
    const getImages = firebase.firestore().collection("images").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            this.images.push(doc.data());
        });
    });

    await getImages;
    this.images.sort(() => Math.random() - 0.5);

    this.width = this.el.nativeElement.offsetWidth;
    this.columns = (this.width > 1440) ? 4 : (this.width > 1024) ? 3 : (this.width > 640) ? 2 : 1 ;

    for (let i = 0; i < this.columns; i++) {
      this.items.push([]);
    }

    for (let i = 0; i < this.images.length; i++) {
      this.items[this.getShortestColumn()].push({
        title: this.images[i].name,
        src: this.images[i].thumb,
        height: this.images[i].thumbHeight,
        show: false,
      })
    }

    console.log(this.items);

  }

  getShortestColumn () {
    const columnLengths = { ...this.items.map(col => col.reduce((a, b) => a+b.height, 0)) };
    const shortest = Object.keys(columnLengths).sort((a,b)=> columnLengths[a]-columnLengths[b]).shift();
    return shortest;
  }

}
