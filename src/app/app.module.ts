import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
// DevExtreme module (optional)
import { DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxTemplateModule, DxTextBoxModule } from 'devextreme-angular';
import { ListComponent } from './users/list/list.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { UserFormComponent } from './users/user-form/user-form.component';

@NgModule({
  declarations: [
    ListComponent,
    UserFormComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    DxButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxDataGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}