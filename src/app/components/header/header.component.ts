import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopinfoComponent } from '../popinfo/popinfo.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input()titulo: string;
  constructor(private popoverCtril: PopoverController) { }

  ngOnInit() {
  }

  async mostrarPop(evento) {
    const popover = await this.popoverCtril.create({
      component: PopinfoComponent,
      event: evento,
      mode: 'ios',
      backdropDismiss: false
    });

    await popover.present();

    // const {data} = await popover.onDidDismiss();
    const {data} = await popover.onWillDismiss();
    console.log('Padre', data);
  }
}
