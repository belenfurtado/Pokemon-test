import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import this module

import { AppComponent } from './app.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { ScorePanelComponent } from './score-panel/score-panel.component';
import { OptionsPanelComponent } from './options-panel/options-panel.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonComponent,
    ScorePanelComponent,
    OptionsPanelComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule // Add HttpClientModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
