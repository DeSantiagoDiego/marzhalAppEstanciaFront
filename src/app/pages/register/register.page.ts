import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  usuario: string;
  contrasena: string;
  resultado2: any;
  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private _dataService: DataService,private screenOrientation: ScreenOrientation) { }

  ngOnInit() {
    this.screenBlock();
  }
  async Onsubcribe() {
   this.navCtrl.navigateForward('/login');
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
  onGenerator() {
    if(this.usuario==="" || this.usuario===null || this.usuario===undefined ||this.usuario.length===0){
      this.alertShow('Ingrese el correo.');
    } else if(this.contrasena===""||this.contrasena===null||this.contrasena===undefined ||this.contrasena.length===0){
      this.alertShow('Ingrese una contraseña.');
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
          return this.alertShow('La contraseña ingresada contiene un espacio en blanco inicial.');
        }
      }else{
        return this.alertShow('Ingrese una contraseña.');
      }
     }
     
     if(this.contrasena.length < 8){
        this.alertShow('Ingrese una contraseña de minimo 8 caracteres.');
      }else if(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.usuario)){
      //this.alertShow('Correcto');
      console.log('Correcto');
      this._dataService.registerUser(this.usuario, this.contrasena).subscribe((resultado) => {
      console.log(resultado);
      this.resultado2 = {message: String, number: Int32Array};
      this.resultado2 = resultado;
      if (this.resultado2.number === 1){
        console.log('Registrado');
        this.alertShow(this.resultado2.message);
        this.navCtrl.navigateForward('/login');
      } else{
        this.alertShow(this.resultado2.message);
      }
    });
    // this.navCtrl.navigateForward('/generator');
  }else{
    this.alertShow('El correo electronico ingresado no es valido.');
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
}
