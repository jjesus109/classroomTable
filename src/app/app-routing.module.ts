import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from "./components/home/home.component"
import { ClassroomsComponent } from "./components/classrooms/classrooms.component";
import { UsersComponent  } from "./components/users/users.component";
import { SchedulesComponent } from  "./components/schedules/schedules.component"
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { NewdataComponent } from "./components/newdata/newdata.component";
import { AssignclassroomComponent } from "./components/assignclassroom/assignclassroom.component";

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"classrooms",component:ClassroomsComponent},
  {path:"newdata",component:NewdataComponent},
  {path:"assign",component:AssignclassroomComponent},
  {path:"classrooms/:id",component:SchedulesComponent},
  {path:"users",component:UsersComponent},  
  {path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
