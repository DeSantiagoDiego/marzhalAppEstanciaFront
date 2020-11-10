import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {
resultado2: any;
session :boolean=false;
  constructor(private alertCtrl: AlertController, private _dataService: DataService, private navCtrl: NavController,private screenOrientation: ScreenOrientation) { }

  ngOnInit() {
    this.screenBlock();
    this.checkSession();
  }
  checkSession(){
    this._dataService.checkSession(localStorage.getItem('session')).subscribe((resultado) => {
      console.log(resultado);
      this.resultado2 = {auth: String, token: String, number: Int32Array};
      this.resultado2 = resultado;
      if (this.resultado2.number === 1){
        this.session = true;
        console.log('Logueado');
        if (localStorage.getItem('account') === 'true'){
          document.getElementById('notVerify2').style.display = "none";
        }
      } else{
        this.session =false;
        console.log('Usted no está logueado');
        this.alertShow('Usted no está logueado, inicie sesion para continuar.');
        this.navCtrl.navigateForward('/login');
      }
  });
  }
  screenBlock(){
    this.screenOrientation.lock('portrait');
    console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'
this.screenOrientation.onChange().subscribe(
   () => {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
       console.log("Orientation Changed: "+this.screenOrientation.type);
   }
);
  }
  async alertPanic(headerAlert,messageAlert) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: headerAlert,
      message: messageAlert,
      buttons: [ {
          text: 'ACEPTAR',
          handler: (blah) => {
            console.log('Boton OK');
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertPrompt(messageShow) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¿Cual es la alerta?',
      inputs: [
        {
          id: 'tituloPantalla',
          name: 'alert',
          type: 'text',
          placeholder: '',
          value: messageShow
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelar');
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            console.log('Boton OK', data.alert);
            //var alertMessage = data.name1;
            //console.log(alertMessage);
            if ( data.alert === undefined || data.alert.length === 0 || data.alert === ' ' || data.alert === null ){
              return this.alertShow('No se ingresó ningun mensaje, verifiquelo y vuela a intentarlo.');
            }
           /* if(data.alert[0].value === '' || data.alert[0].value == null){
              return this.alertShow('NO se ingresó ningun mensaje, verifiquelo y vuela a intentarlo.');
              }
              */
            var validado = true;
            for(var i=0;i<data.alert.length;i++){
              console.log(data.alert[0]);
              if(data.alert[i] === ' ' || data.alert[i] == null){
              validado = false;
              }else{
                validado = true;
                i = data.alert.length;
              }
            }
            if (validado){
            console.log('funciona');
            }else{
              return this.alertShow('No se ingresó ningun mensaje, verifiquelo y vuela a intentarlo.');
            }
            console.log(data.alert);
            this.alertShow2(data.alert);
            /*this._dataService.sendAlertByUser(data.name1, localStorage.getItem('session')).subscribe((resultado) => {
              this.resultado2 = {header: String, message: String, number: Number};
              this.resultado2 = resultado;
              this.alertPanic(this.resultado2.header, this.resultado2.message);
            });*/
          }
        }
      ]
    });
    await alert.present();
  }
  async alertShow(messageShow) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: messageShow,
      buttons: [ {
          text: 'Aceptar',
          handler: (blah) => {
            console.log('Boton OK');
          }
        }
      ]
    });
    await alert.present();
  }

  async alertShow2(messageShow) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Verifique su mensaje antes de enviar.',
      message: '<i>' + messageShow + '</i>',
      buttons: [
        {
          text: 'Editar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelar');
            this.presentAlertPrompt(messageShow);
          }
        }, {
          text: 'Enviar',
          handler: (blah) => {
            console.log('Boton OK');
            console.log('Boton OK', messageShow);
            //var alertMessage = data.name1;
            //console.log(alertMessage);
            if ( messageShow === undefined || messageShow.length === 0 || messageShow === ' ' || messageShow === null ){
              return this.alertShow('No se ingresó ningun mensaje, verifiquelo y vuela a intentarlo.');
            }
            console.log(messageShow);
            this.checkSession();
            if(this.session === false){
              return;
            }
            this._dataService.sendAlertByUser(messageShow, localStorage.getItem('session')).subscribe((resultado) => {
              this.resultado2 = {header: String, message: String, number: Number};
              this.resultado2 = resultado;
              if(this.resultado2.number === 1){
                //this.alertPanic(this.resultado2.header, this.resultado2.message);
                this._dataService.sendAlertToUser(messageShow, localStorage.getItem('session')).subscribe((resultado)=>{
                  this.resultado2 = resultado;
                 this.alertPanic(this.resultado2.header, this.resultado2.message);
                });
              }else{
                this.alertPanic(this.resultado2.header, this.resultado2.message);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
