import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  botHeight: number = 38;
  changeBotHeight() {
    this.botHeight = (this.botHeight == 600) ? 38 : 600;
  }
}
