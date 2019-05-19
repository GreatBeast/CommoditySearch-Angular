import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {PaginationModule, TooltipModule} from 'ngx-bootstrap';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import {FacebookModule} from 'ngx-facebook';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LightboxModule} from 'ngx-lightbox';

import 'hammerjs';
import * as $ from 'jquery';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PaginationModule.forRoot(),
    MatTooltipModule,
    BrowserAnimationsModule,
    RoundProgressModule,
    FacebookModule.forRoot(),
    TooltipModule.forRoot(),
    NgbModule.forRoot(),
    AutocompleteLibModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    LightboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
