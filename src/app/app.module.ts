
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { IonicModule } from '@ionic/angular';

import { AppComponent } from './app.component';
import { SupabaseService } from './supabase.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    //RouterModule.forRoot([]),
    IonicModule.forRoot({ mode: 'ios' }),
  ],
  declarations: [AppComponent],
  providers: [SupabaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
