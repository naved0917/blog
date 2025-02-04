import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

const importExportArray = [
  HeaderComponent
]

@NgModule({
  declarations: [
    ...importExportArray
  ],
  exports: [
    ...importExportArray
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
