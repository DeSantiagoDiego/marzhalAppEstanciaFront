import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ChangePasswordPage } from '../change-password/change-password.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: string;
  contrasena: string;
  resultado2: any;
  intentos = 0;
  idAccess: any;
  minutes: any;
  seconds: any;
  distance: any;
  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private _dataService: DataService,private screenOrientation: ScreenOrientation,private changeCtrl: ChangePasswordPage, private uniqueDeviceID: UniqueDeviceID,public toastCtrl: ToastController) { }

  ngOnInit() {
    
    this.uniqueDeviceID.get()
    .then((uuid: any) => this.presentToast(uuid))
    .catch((error: any) => this.presentToast(error));
   this.screenBlock();
    this._dataService.checkBlock().subscribe((resultado) => {
      this.resultado2 = {number: Int32Array, time: Int32Array};
      this.resultado2 = resultado;
      console.log(this.resultado2.number);
      if (this.resultado2.number === 2){
       this.distance = this.resultado2.time;
       this.loginStillBlock();
      }
    });
  }
  async presentToast(uuid) {
    const toast = await this.toastCtrl.create({
      message: uuid,
      duration: 2000
    });
    toast.present();
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
  async Onsubcribe() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Para hacer uso de este servicio debes adquirir una de nuestras cajas de seguridad en <strong>marzhalhackers.com</strong>',
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

  onGenerator() {
    this._dataService.checkBlock().subscribe((resultado) => {
      this.resultado2 = {number: Int32Array, time: Int32Array};
      this.resultado2 = resultado;
      console.log(this.resultado2.number);
      if (this.resultado2.number === 2){
       this.alertShow('El inicio de sesion ha sido bloqueado anteriormente, espere <strong>' + this.minutes + ' minutos y ' + this.seconds + ' segundos.</strong>');
      }else{
        if (this.usuario === '' || this.usuario === null || this.usuario === undefined || this.usuario.length === 0){
          this.alertShow('Ingrese el correo');
        } else if (this.contrasena === '' || this.contrasena === null || this.contrasena === undefined || this.contrasena.length === 0){
          this.alertShow('Ingrese una contraseña');
        }else{
        this._dataService.loginUser(this.usuario, this.contrasena).subscribe((resultado) => {
          this.resultado2 = {auth: String, token: String, number: Int32Array, account: Boolean};
          this.resultado2 = resultado;
          if (this.resultado2.number === 1){
            console.log('Bienvenido');
            console.log(resultado);
            this.alertShow('Bienvenido');
            localStorage.setItem('session', this.resultado2.token);
            localStorage.setItem('account', this.resultado2.account.toString());
            console.log(localStorage.getItem('session'));
            this.navCtrl.navigateForward('/generator');
          }else{
          console.log(resultado);
          this.alertShow('Correo o contraseña invalidos');
          console.log(this.resultado2.auth);
          this.intentos = this.intentos + 1;
          // console.log(this.intentos);
          if (this.intentos === 10){
            this._dataService.sendAlertUser(this.usuario).subscribe(( resultado ) => {
              console.log(resultado);
            });
            this.loginBlock();
          }
          }
        });
      }
      }
    });
  }
  loginBlock(){
    const expirationDate = new Date();
    const exp = expirationDate;
    exp.setSeconds(exp.getSeconds() + 30);
    let countDownDate = exp.getTime();
    let i = false;
    let distance;

    // Update the count down every 1 second
    const x = setInterval(() => {

      // Get today's date and time
      if (i !== true){
        let now = new Date().getTime();
        distance = countDownDate - now;
        console.log('Primera Vez');
      } else{
        distance = distance - 1000;
      }
      this._dataService.saveBlock(distance).subscribe((resultado) => {
      });
      console.log(distance);
      // Time calculations for days, hours, minutes and seconds
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      console.log(this.seconds);
      i = true;
      if (distance < 0) {
        clearInterval(x);
        this._dataService.saveBlock(null).subscribe((resultado) => {
        });
        this.intentos = 0;
        alert('Terminado');
      }
    }, 1000);
  }
  loginStillBlock(){
    const x = setInterval(() => {
      // Get today's date and time
        this.distance = this.distance - 1000;
        this._dataService.saveBlock(this.distance).subscribe((resultado) => {
      });
        console.log(this.distance);
      // Time calculations for days, hours, minutes and seconds
        this.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
        console.log(this.seconds);
        if (this.distance < 0) {
        clearInterval(x);
        this._dataService.saveBlock(null).subscribe((resultado) => {
        });
        this.intentos = 0;
        alert('Terminado');
      }
    }, 1000);
  }
  onForgetPass(){
    this.navCtrl.navigateForward('/change-password');
  }
  onNewAccount(){
  this.navCtrl.navigateForward('/register');
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
}
