import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { PageBlogDetailComponent } from './page-blog-detail/page-blog-detail.component';
import { PageBlogFormComponent } from './page-blog-form/page-blog-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BlogComponent,
    PageBlogFormComponent,
    PageBlogDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
