import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneratorPageRoutingModule } from './generator-routing.module';

import { GeneratorPage } from './generator.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneratorPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GeneratorPage]
})
export class GeneratorPageModule {}
