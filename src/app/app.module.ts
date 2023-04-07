import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ImageTableModule } from './components/image-table/image-table.module';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { SettingsBarComponent } from './components/settings-bar/settings-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterBarComponent,
    SettingsBarComponent,
    SearchBarComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ImageTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
