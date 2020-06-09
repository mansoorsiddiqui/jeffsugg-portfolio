import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemViewComponent } from './item-view/item-view.component';
import { GalleryComponent } from './gallery/gallery.component';


const routes: Routes = [
  {
    path: '', component: GalleryComponent
  },
  {
    path: 'view', component: ItemViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
