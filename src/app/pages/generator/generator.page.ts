import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, IonItemSliding, AlertController, NavController, ToastController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.page.html',
  styleUrls: ['./generator.page.scss'],
})
export class GeneratorPage implements OnInit {
  message: any;
  resultado2: any;
  passwords: any;
  session :boolean=false;
  erased:boolean=false;
  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private _dataService: DataService,private screenOrientation: ScreenOrientation,public toastCtrl: ToastController) { }

  ngOnInit() {
    this.screenBlock();
    this.checkSession();
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
  checkSession(){
    this._dataService.checkSession(localStorage.getItem('session')).subscribe((resultado) => {
      console.log(resultado);
      this.resultado2 = {auth: String, token: String, number: Int32Array};
      this.resultado2 = resultado;
      if (this.resultado2.number === 1){
        this.session = true;
        console.log('Logueado');
        if (localStorage.getItem('account') === 'true'){
          document.getElementById('notVerify').style.display = "none";
        }
        this.checkPasswords();
      } else{
        this.session =false;
        console.log('Usted no está logueado');
        this.alertShow('Usted no está logueado, inicie sesion para continuar');
        this.navCtrl.navigateForward('/login');
      }
  });
  }

  checkSession2(){
    this._dataService.checkSession(localStorage.getItem('session')).subscribe((resultado) => {
      console.log(resultado);
      this.resultado2 = {auth: String, token: String, number: Int32Array};
      this.resultado2 = resultado;
      if (this.resultado2.number === 1){
        this.session = true;
        console.log('Logueado');
        if (localStorage.getItem('account') === 'true'){
          document.getElementById('notVerify').style.display = "none";
        }
        //this.checkPasswords();
      } else{
        this.session =false;
        console.log('Usted no está logueado');
        this.alertShow('Usted no está logueado, inicie sesion para continuar');
        this.navCtrl.navigateForward('/login');
      }
  });
  }
  checkPasswords(){
    this._dataService.checkPasswords(localStorage.getItem('session')).subscribe((resultado)=>{
      console.log(resultado);
      
      this.resultado2 = {userPasswords: Object, message: String, number: Number};
      this.resultado2 = resultado;
      if(this.resultado2.number !== 2){
        console.log("No hay nada");
        document.getElementById('allPasswords').style.display = 'none';
        console.log(this.resultado2.userPasswords.length);
      }else{
        console.log("Hay algo");
        this.passwords = this.resultado2.userPasswords;
        console.log(this.resultado2.userPasswords.length);
      }
  });
  }
  OnNewPassword(){
    document.getElementById('newPassword').style.display = 'block';
    document.getElementById('newPassword2').style.display = 'block';
  }

  deletePassword(slidingItem: IonItemSliding, password) {
    console.log(password.namePassword);
    this.message = '¿Estás seguro de eliminar el registro de contraseña <strong>' + password.namePassword + '</strong>?';
    this.alertPanic(password._id);
    slidingItem.closeOpened();
      }
  updatePassword(slidingItem: IonItemSliding, password) {
    console.log(password);
    //this.alertShow(password.namePassword + ' actualizado!');
    slidingItem.closeOpened();
    this.presentAlertUpdate(password);
  }

  async alertPanic(idPassword) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: this.message,
      buttons: [
       {
        text: 'CANCELAR',
        handler: (blah) => {
        console.log('Boton Cancel');
        }
        },
        {
        text: 'ACEPTAR',
        handler: (blah) => {
          this.checkSession();
          if(this.session === false){
            return;
          }
          this._dataService.deletePassword(idPassword).subscribe((resultado) => {
            console.log('Boton OK');
            this.resultado2 = {message: String};
            this.resultado2 = resultado;
            this.alertShow(this.resultado2.message);
            this.checkPasswords();
          });
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

  public togglePassword(id){
    this.checkSession2();
    if(this.session === false){
      return;
    }
    var typePassword = document.getElementById(id.toString()).getAttribute('type');
    console.log(typePassword);
    if (typePassword === 'password'){
      document.getElementById(id.toString()).setAttribute('type', 'text');
    }else{
      document.getElementById(id.toString()).setAttribute('type', 'password');
    }
    console.log(id);
  }

  copyPassword(slidingItem: IonItemSliding,id){
    //alert(id);
    this.checkSession();
    if(this.session === false){
      return;
    }
    console.log(id.toString());
    console.log(document.getElementById(id.toString()).getAttribute('type'));
    console.log( (<HTMLInputElement>document.getElementById(id.toString())).value);
    var aux = document.createElement('input');
    aux.setAttribute('value', (<HTMLInputElement>document.getElementById(id.toString())).value);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    slidingItem.closeOpened();
    this.presentToast('Contraseña copiada.');
  }

  async presentToast(uuid) {
    const toast = await this.toastCtrl.create({
      message: uuid,
      duration: 2000
    });
    toast.present();
  }
  createPassword(){
    this.presentAlertCreate()
  }
  async presentAlertCreate() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ingrese el nombre de su contraseña y el numero de digitos',
      inputs: [
        {
          id: 'tituloPantalla',
          name: 'namePass',
          type: 'text',
          placeholder: 'Nombre(Max:8)'
        },
        {
          id: 'numberPassword',
          name: 'numberPass',
          type: 'number',
          placeholder: 'Digitos(Max:32)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelar');
            //this.navCtrl.navigateForward('/login');
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            console.log('Boton OK', data.namePass, parseInt(data.numberPass));
            if (data.namePass.length === 0 || data.namePass === '' || data.namePass === null || data.namePass === undefined){
              return this.alertShow('Ingrese un nombre');
            }

            var validado = true;
            var validado2 = false;
            for(var i=0;i<data.namePass.length;i++){
              console.log(data.namePass[0]);
              if(data.namePass[i] === ' ' || data.namePass[i] == null){
              validado = false;
              validado2=true;
              //i = data.namePass.length;
              }else{
                validado = true;
                //validado2=true;
                i = data.namePass.length;
              }
            }
            if (validado){
            console.log('funciona');
              if(validado2){
                return this.alertShow('El nombre ingresado contiene un espacio en blanco inicial');
              }
            }else{
              return this.alertShow('Ingrese un nombre');
            }
            if (data.namePass.length > 8){
              return this.alertShow('El nombre ingresado es muy largo, verifiquelo y vuelva a intentarlo.');
            }
            if (data.numberPass === 0 || data.numberPass < 8 || data.numberPass.length === 0 || data.numberPass === '' || data.numberPass === null || data.numberPass === undefined){
              console.log('Usted no ingresó nada, por tanto, el valor es 8');
              data.numberPass = 8;
            }
            if (data.numberPass > 32){
             return this.alertShow('El numero de digitos ingresado excede el limite permitido, verifiquelo y vuelva a intentarlo.');
            }
            //console.log('[' + data.namePass.padEnd(8) + ']');
            this.checkSession();
            if(this.session === false){
              return;
            }
            this._dataService.createPassword(localStorage.getItem('session'),data.namePass,parseInt(data.numberPass)).subscribe((resultado)=>{
              this.resultado2 = {message: String};
              this.resultado2 = resultado;
              this.alertShow(this.resultado2.message);
              this.checkPasswords();
            });
          }
        }
      ]
    });
    await alert.present();
  }
  async presentAlertUpdate(password) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Modifique los valores necesarios',
      inputs: [
        {
          id: 'tituloPantalla',
          name: 'namePass',
          type: 'text',
          value:  password.namePassword,
          placeholder: password.namePassword
        },
        {
          id: 'numberPassword',
          name: 'numberPass',
          type: 'text',
          value:  password.password,
          placeholder: password.password
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelar');
            //this.navCtrl.navigateForward('/login');
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            console.log('Boton OK', data.namePass, data.numberPass);
            if (data.namePass.length === 0 || data.namePass === '' || data.namePass === null || data.namePass === undefined){
              return this.alertShow('Ingrese un nombre');
            }
            if (data.namePass.length > 8){
              return this.alertShow('El nombre ingresado es muy largo, verifiquelo y vuelva a intentarlo.');
            }
            if (data.numberPass.length === 0 || data.numberPass === '' || data.numberPass === null || data.numberPass === undefined){
              return this.alertShow('Ingrese una contraseña');
            }
            if (data.numberPass.length > 32){
             return this.alertShow('El numero de digitos ingresado excede el limite permitido, verifiquelo y vuelva a intentarlo.');
            }
            if (data.namePass === password.namePassword && data.numberPass === password.password ){
              return this.alertShow('Sin cambios, ' + password.namePassword + ' actualizado!');
            }
            this.checkSession();
            if(this.session === false){
              return;
            }
            this._dataService.updatePassword(localStorage.getItem('session'),password._id,data.namePass,data.numberPass).subscribe((resultado)=>{
              this.resultado2 = {message: String};
              this.resultado2 = resultado;
              this.alertShow(this.resultado2.message);
              this.checkPasswords();
            });
            /*this._dataService.createPassword(localStorage.getItem('session'),data.namePass,parseInt(data.numberPass)).subscribe((resultado)=>{
              this.resultado2 = {message: String};
              this.resultado2 = resultado;
              this.alertShow(this.resultado2.message);
              this.checkPasswords();
            });*/
          }
        }
      ]
    });
    await alert.present();
  }

}

