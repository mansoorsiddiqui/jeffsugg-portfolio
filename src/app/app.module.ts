import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularTiltModule } from 'angular-tilt';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ContentfulService } from './contentful.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HeaderComponent } from './header/header.component';
import { GalleryItemComponent } from './gallery-item/gallery-item.component';
import { ItemViewComponent } from './item-view/item-view.component';

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    HeaderComponent,
    GalleryItemComponent,
    ItemViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularTiltModule,
    DeferLoadModule
  ],
  providers: [ContentfulService],
  bootstrap: [AppComponent]
})
export class AppModule { }
