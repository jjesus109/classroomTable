import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ClassroomService } from 'src/app/services/classroom.service';
import { Users } from 'src/app/models/users.model';
import { Classroom } from 'src/app/models/classroom.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private usersSubscription:any;
  private classSubscription:any;
  public usersGet:Array<Users> = [];
  public classroomsGet:Array<Classroom> = [];
  public emptyData:boolean = false;
  public showModal:boolean = false;
  public userEdit = {} as Users;
  public userId = {};
  public userInsideSchedules = {};
  constructor(
    private _usersService: UsersService,
    private _classroomsService: ClassroomService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.classSubscription= this._classroomsService.getClassrooom().subscribe(clasroomsGet=>{
      this.classroomsGet = clasroomsGet;
      
      this.usersSubscription = this._usersService.getUser().subscribe(userGet=>{
        this.usersGet = userGet;
        this.usersGet.forEach(element=>{
          this.userId[element.IdUser] = element.Name;
        });
        
        if(this.usersGet.length==0 && this.classroomsGet.length==0){
          this.emptyData = true;
        }
        console.log("Data emptyData",this.emptyData);
      });
    });

  }
  ngOnDestroy() {
    this.classSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  changeShowModal(){
    this.showModal = !this.showModal;
  }

  editUser(user:Users){
    this.userEdit = user;
    this.userInsideSchedules =  {};
    // Look for schudules and classrooms inside
    this.classroomsGet.forEach(classroom=>{
      classroom.TimeTable.forEach(timet=>{
        if(timet.Users.includes(user.IdUser) 
          && this.userInsideSchedules[classroom.IdClassroom]){
            let textPush = {
              From:timet.From,
              To:timet.To,
              ClassroomName:classroom.Name
            }
            this.userInsideSchedules[classroom.IdClassroom].push(textPush);
        }else if(timet.Users.includes(user.IdUser) 
                && !this.userInsideSchedules[classroom.IdClassroom]){
            this.userInsideSchedules[classroom.IdClassroom] = [];
            let textPush = {
              From:timet.From,
              To:timet.To,
              ClassroomName:classroom.Name
            }
            this.userInsideSchedules[classroom.IdClassroom].push(textPush);
        }
      });
    });
    console.log("Esto",this.userInsideSchedules);
    this.showModal = !this.showModal;
  }
  eraseClass(classroomId){
    let classroomToEdit={} as Classroom;
    this.classroomsGet.forEach(classroom=>{
      if(classroom.IdClassroom==classroomId){
        classroomToEdit = classroom;
      }
    });
    classroomToEdit.TimeTable.forEach(element=>{
      if(element.Users.includes(this.userEdit.IdUser)){
        let index= element.Users.indexOf(this.userEdit.IdUser)
        element.Users.splice(index,1);
      }
    });
    this._classroomsService.updateClassroom(classroomToEdit);
    this.showModal = !this.showModal;
  }
  eraseUser(user:Users){
    this._usersService.deleteUser(user);
  }
  cancelUpdate(){
    this.userEdit = {} as Users;
    this.showModal = !this.showModal;
  }
  updateUser(){
    this._usersService.deleteUser(this.userEdit);
    this.showModal = !this.showModal;
  }

}


