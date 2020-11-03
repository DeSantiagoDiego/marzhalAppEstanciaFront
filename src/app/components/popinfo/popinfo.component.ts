import { Component, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-popinfo',
  templateUrl: './popinfo.component.html',
  styleUrls: ['./popinfo.component.scss'],
})
export class PopinfoComponent implements OnInit {

  items = Array(28);
  constructor(private popoverCtrl: PopoverController, private navCtrl: NavController, private _dataService: DataService) { }

  ngOnInit() {}
  onClick() {
    console.log('item', 1);
    this.popoverCtrl.dismiss({
      item: 1
    });
  }
  onAlert() {
    console.log('item', 1);
    this.popoverCtrl.dismiss({
      item: 1
    });
    this.navCtrl.navigateForward('/alert');
  }
  onGenerator() {
    console.log('item', 1);
    this.popoverCtrl.dismiss({
      item: 1
    });
    this.navCtrl.navigateForward('/generator');
  }
  onLogin() {
    console.log('item', 1);
    this.popoverCtrl.dismiss({
      item: 1
    });
    this._dataService.deleteToken(localStorage.getItem('session')).subscribe((resultado)=>{
      localStorage.setItem('session', null);
      localStorage.setItem('account', null);
      this.navCtrl.navigateForward('/login');
    });
  }
}
