import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ClassroomsComponent } from './components/classrooms/classrooms.component';
import { UsersComponent } from './components/users/users.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from 'src/environments/environment';

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { NewdataComponent } from './components/newdata/newdata.component';
import { AssignclassroomComponent } from './components/assignclassroom/assignclassroom.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClassroomsComponent,
    UsersComponent,
    SchedulesComponent,
    NotFoundComponent,
    NavbarComponent,
    NewdataComponent,
    AssignclassroomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
