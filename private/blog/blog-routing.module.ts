import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { PageBlogFormComponent } from './page-blog-form/page-blog-form.component';
import { PageBlogDetailComponent } from './page-blog-detail/page-blog-detail.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      {

        path: '',
        pathMatch: 'full',
        redirectTo: 'add'
      },
      {
        path: 'add',
        component: PageBlogFormComponent
      },
      {
        path: 'edit/:id',
        component: PageBlogFormComponent
      },
      {
        path: 'detail',
        component: PageBlogDetailComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
