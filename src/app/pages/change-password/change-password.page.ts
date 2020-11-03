import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  confirmarContrasena: string;
  contrasena: string;
  resultado2: any;
  usuario: any;
  email: boolean = false;
  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private _dataService: DataService,private screenOrientation: ScreenOrientation) { }


  ngOnInit() {
    this.screenBlock();
    console.log('Email: '+ this.email);
    if(this.email === false){
      this.presentAlertPrompt();
    }
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

  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ingrese su correo electronico',
      inputs: [
        {
          id: 'tituloPantalla',
          name: 'name1',
          type: 'text',
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelar');
            this.navCtrl.navigateForward('/login');
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            console.log('Boton OK', data.name1);
            this.usuario = data.name1;
            if ( data.name1 === undefined || data.name1.length === 0 || data.name1 === ' ' || data.name1 === null ){
              this.email = false;
              return this.alertShowEmail('No se ingresó ningun correo electronico, verifiquelo y vuela a intentarlo.');
            }
            var validado = true;
            var validado2 = false;
            for(var i=0;i<data.name1.length;i++){
              console.log(data.name1[0]);
              if(data.name1[i] === ' ' || data.name1[i] == null){
              validado = false;
              validado2=true;
              //i = data.namePass.length;
              }else{
                validado = true;
                //validado2=true;
                i = data.name1.length;
              }
            }
            if (validado){
            console.log('funciona');
              if(validado2){
                this.email = false;
                return this.alertShowEmail('El correo electronico ingresado contiene un espacio en blanco inicial');
              }
            }else{
              this.email = false;
              return this.alertShowEmail('Ingrese su correo electronico');
            }
            if(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.usuario)){
              this._dataService.sendChangePassword(data.name1).subscribe((resultado) => {
              this.resultado2 = {message: String, number: Int32Array};
              this.resultado2 = resultado;
              console.log(this.resultado2.number);
              if(this.resultado2.number === 3){
               this.email = false;
                return this.sendEmail(this.resultado2.message);
                
              }
              console.log("Aqui toy");
              this.email = true
              return this.sendEmail(this.resultado2.message);
            });
            }else{
              this.email = false;
              return this.alertShowEmail('El correo electronico ingresado no es valido');
            }
            
          }
        }
      ]
    });
    await alert.present();
  }
  async sendEmail(newMessage) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: newMessage,
      buttons: [ {
          text: 'Aceptar',
          handler: (blah) => {
            console.log('Boton OK');
            if(this.email === false){
              this.presentAlertPrompt();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async Onsubcribe() {
    this.email = false;
    console.log('Email: '+ this.email);
    this.navCtrl.navigateForward('/login');
  }

  onGenerator() {
    if(this.email === false){
      return this.alertShowEmail('Porfavor ingrese su correo electronico para continuar.');
    }
    if(this.contrasena===""||this.contrasena===null||this.contrasena===undefined ||this.contrasena.length===0){
      return this.alertShow('Ingrese una contraseña');
     } else {
      var validado = true;
      var validado2 = false;
      for(var i=0;i<this.contrasena.length;i++){
        console.log(this.contrasena[0]);
        if(this.contrasena[i] === ' ' || this.contrasena[i] == null){
        validado = false;
        validado2=true;
        //i = data.namePass.length;
        }else{
          validado = true;
          //validado2=true;
          i = this.contrasena.length;
        }
      }
      if (validado){
      console.log('funciona');
        if(validado2){
          return this.alertShow('La contraseña ingresada contiene un espacio en blanco inicial');
        }
      }else{
        return this.alertShow('Ingrese una contraseña');
      }
     }
   if (this.contrasena !== this.confirmarContrasena){
    this.alertShow('Las contraseñas no coindicen, verifiquelas y vuelva a intentarlo');
   }
   else{
    if(this.contrasena.length < 5 || this.contrasena.length > 11){
      return this.alertShow('Ingrese una contraseña de minimo 5 caracteres y maximo 11');
    }
    this._dataService.verifyChangePassword(this.usuario,this.contrasena).subscribe((resultado) => {
      this.resultado2 = {message: String, number: Int32Array};
      this.resultado2 = resultado;
      if (this.resultado2.number === 1){
    this.alertShow(this.resultado2.message);
    this.navCtrl.navigateForward('/login');
      }else if(this.resultado2.number === 2){
        console.log(this.resultado2.number);
    this.alertShow(this.resultado2.message);
      }else{
        this.alertShow(this.resultado2.message);
      }
    });
   }
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
  async alertShowEmail(messageShow) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: messageShow,
      buttons: [ {
          text: 'Aceptar',
          handler: (blah) => {
            console.log('Boton OK');
            this.presentAlertPrompt();
          }
        }
      ]
    });
    await alert.present();
  }
  onForgetPass(){
    alert('Pues nel!');
  }
  onNewAccount(){
  this.navCtrl.navigateForward('/register');
  }
}
