import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
const apiUrl = environment.apiUrl;
const apiHost =environment.apiHost;
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private _client: HttpClient) { }

  welcome(){
    console.log(apiUrl);
    return this._client.get('http://localhost:3000/api/auth');
  }

  checkToken(){
    return this._client.get(apiUrl + '/me');
  }
  registerUser(usuario: string, contrasena: string){
    const user = {
      username: null,
      email: usuario,
      password: contrasena,
      hostSend: apiHost
    };
    console.log(user);
    return this._client.post(apiUrl + '/prueba', user);
  }
  loginUser(usuario: string, contrasena: string){
    const user = {
      email: usuario,
      password: contrasena
    };
    console.log(user);
    return this._client.post(apiUrl + '/login', user);
  }
  checkSession(session: string){
    const sessions = {
      sessionVerify: session
    };
    return this._client.post(apiUrl + '/session', sessions);
  }
  sendChangePassword(emailUser: string){
    const user = {
      to: emailUser,
      hostSend: apiHost
    };
    return this._client.post(apiUrl + '/sendChangePass', user);
  }
  verifyChangePassword(userEmail: string, contrasena: string){
    const user = {
      email: userEmail,
      password: contrasena,
    };
    console.log(user);
    return this._client.post(apiUrl + '/verifyChangePassword', user);
  }

  deleteToken(tokenClose: string){
    const token = {
      tokenSession: tokenClose
    };
    console.log(token);
    return this._client.post(apiUrl + '/deleteToken', token);
  }
  sendAlertUser(emailUser: string){
    const user = {
      to: emailUser
    };
    return this._client.post(apiUrl + '/userTryFailed', user);
  }

  saveBlock(distance: number, idAccess: string){
    const block = {
      time: distance,
      idDevice: idAccess
    };
    return this._client.post(apiUrl + '/blockLogin', block);
  }
  checkBlock( idAccess: string){
    const idBlock = {
      idDevice: idAccess
    };
    return this._client.post(apiUrl + '/checkLogin', idBlock);
  }
  checkPasswords(tokenUser: string){
    const token = {
      token: tokenUser
    };
    return this._client.post(apiUrl + '/readPassword', token);
  }
  deletePassword(idPass: string){
    const password = {
      idPassword: idPass
    };
    return this._client.post(apiUrl + '/deletePassword', password);
  }
  createPassword(tokenUser: string, namePass: string, numberPass: number){
    const newPassord = {
      token: tokenUser,
      name: namePass,
      digits: numberPass
    };
    return this._client.post(apiUrl + '/createNewPassword', newPassord);
  }
  updatePassword(tokenUser: string, idPass: string, newNamePassword: string, newValuePassword: string){
    const updatePassword = {
      token: tokenUser,
      idPassword: idPass,
      newName: newNamePassword,
      newPassword: newValuePassword
    };
    return this._client.post(apiUrl + '/editPassword', updatePassword);
  }
  sendAlertByUser(messageAlert: string, tokenUser: string){
    const alert = {
      message: messageAlert,
      token: tokenUser
    }
    return this._client.post(apiUrl + '/userSendByAlert', alert);
  }
  sendAlertToUser(messageAlert: string, tokenUser: string){
    const alert = {
      message: messageAlert,
      token: tokenUser
    }
    return this._client.post(apiUrl + '/userSendToAlert', alert);
  }
}
