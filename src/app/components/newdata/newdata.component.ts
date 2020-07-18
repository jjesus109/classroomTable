
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ClassroomService } from 'src/app/services/classroom.service';
import { Users } from 'src/app/models/users.model';
import { Classroom } from 'src/app/models/classroom.model';
import { TimeTable} from "src/app/models/timetable.model";
import { environment } from "src/environments/environment"



@Component({
  selector: 'app-newdata',
  templateUrl: './newdata.component.html',
  styleUrls: ['./newdata.component.scss']
})
export class NewdataComponent implements OnInit {
  private usersSubscription:any;
  private classSubscription:any;
  public usersGet:Array<Users> = [];
  public classroomsGet:Array<Classroom> = [];
  public emptyData:boolean = false;

  public register:boolean = false;
  public registerFlow:boolean = true;
  public registerUserData:boolean = false;
  public registerClassData:boolean = false;
  public userSelected:Users;
  public classRoomSelected:Classroom;
  public scheduleSelected= {} as TimeTable;
  newClassroom = {} as Classroom;
  newSchedule = {} as TimeTable;
  newUser = {} as Users;
  public userRoles = environment.roles;
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
        
        if(this.usersGet.length==0 || this.classroomsGet.length==0){
          this.emptyData = true;
        }
      });
    });

  }
  ngOnDestroy() {
    this.classSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }
  createData(){
    this._usersService.addUser(this.newUser).then(id=>{
      this.newClassroom.TimeTable = [];
      //A new user to array
      let userArray = [id];  
      this.newSchedule.Users = userArray; 
      let newSchedule = this.newSchedule;
      this.newClassroom.TimeTable.push(newSchedule);
      this._classroomsService.addClassroom(this.newClassroom);
      this.newClassroom = {} as Classroom;
      this.newSchedule = {} as TimeTable;
      this.newUser = {} as Users;
      alert("Data Registered");
    });;
    
  }

  registerNewData(){

    let scheduled = false;
    let newScheduleFrom = new Date(this.scheduleSelected.From);
    let newScheduleTo = new Date(this.scheduleSelected.To);
    //verify order of timetable
    if(newScheduleFrom>newScheduleTo){
      alert("Start date could not be sooner than end date")
      return;
    }else if(newScheduleFrom.getTime()==newScheduleTo.getTime()){
      alert("Both dates could not be the same");
      return;
    }
    let keyClassroom = Object.keys(this.newClassroom)
    let keyUser = Object.keys(this.newUser)
    if(!keyClassroom[0] &&!keyUser[0]){
      alert("Complete the form");
    }
    else if(!keyUser[0]){
      alert("Complete the classroom values");
      return
    }
    else if(!keyClassroom[0]){
      alert("Complete the User values");
      return
    }
    this.createData();
    



    
  }
    

}

