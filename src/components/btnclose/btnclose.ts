import { Component } from '@angular/core';

/**
 * Generated class for the BtncloseComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'btnclose',
  templateUrl: 'btnclose.html'
})
export class BtncloseComponent {

  text: string;

  constructor() {
    console.log('Hello BtncloseComponent Component');
    this.text = 'Hello World';
  }

}
