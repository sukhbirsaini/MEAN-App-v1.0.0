import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  botHeight: number = 38;
  botHeight2: number = 38;
  changeBotHeight() {
    this.botHeight = (this.botHeight == 600) ? 38 : 600;
  }
  changeBotHeight2() {
    this.botHeight = (this.botHeight2 == 600) ? 38 : 600;
  }
}
