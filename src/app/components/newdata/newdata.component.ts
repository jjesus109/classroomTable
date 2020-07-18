
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
        
        if(this.usersGet.length==0 && this.classroomsGet.length==0){
          this.emptyData = true;
        }
      });
    });

  }
  ngOnDestroy() {
    this.classSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }
  registerNewData(){
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
 
  assign(){

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
    //Verify timetable is not assigned    
    this.classRoomSelected.TimeTable.forEach(element => {
      //convert into dates
      let start = new Date(element.From);
      let finish = new Date(element.To);     
      //Verify the cases where could match the dates
      if(newScheduleFrom>=start && newScheduleTo<=finish){
        scheduled=true;
      }else if(newScheduleFrom>=start && newScheduleFrom<=finish){
        scheduled=true;

      }else if((newScheduleTo<=finish) && newScheduleTo>=start){
        scheduled=true;

      }else if(newScheduleTo>=finish && newScheduleFrom<=start){
        scheduled=true;

      }

      if(start.getTime() == newScheduleFrom.getTime() 
         && finish.getTime() == newScheduleTo.getTime()){
          scheduled=false;   
      }
      

    });
    if(scheduled){
      alert("Select other dates,cause current match with scheduled");
      return
    }

    let sameUserInside:boolean = false;
    let studentInside:boolean= false;
    let teacherInside:boolean = false;
    let userInside:boolean =false;
    let userRegister:boolean = true;
    let registernewTimeTable:boolean = true;
    //Create object of ids vs role:
    let idsobject = {}
    this.usersGet.forEach(element=>{
      idsobject[element.IdUser] = element.Role;
    });
    let timeTableRegister = {} as TimeTable;
    //verify User doesnt have an schedule in that clasroom at selectedScheduled
    this.classRoomSelected.TimeTable.forEach(element => {
            
      let start = new Date(element.From);
      let finish = new Date(element.To);
      // Evaluate only in cases where selected schedule 
      // are the same values that current timetable
      if(start.getTime()!=newScheduleFrom.getTime() 
         && finish.getTime() != newScheduleTo.getTime())
         return

      registernewTimeTable = false;
      timeTableRegister = element;
      //verify current user role of timetable scheduled
      let currentrole0 = idsobject[element.Users[0]];
      let currentrole1 = idsobject[element.Users[1]];
      if(currentrole0=="teacher"){
        teacherInside = true;
      }else if(currentrole0=="student"){
        studentInside = true;
      }if(currentrole1=="teacher"){
        teacherInside = true;
      }else if(currentrole1=="student"){
        studentInside = true;
      }
      if(teacherInside && studentInside ){
        userRegister =false;
        alert("There's no more space left")
        return
      }
      // verify theres only one student and one teacher
      userInside = element.Users.includes(this.userSelected.IdUser)
      if(userInside){
        sameUserInside = true;             
      }
      // verify role of user selected
      if(teacherInside && this.userSelected.Role == "teacher"){
        userRegister = false;
        return
      }else if(studentInside && this.userSelected.Role == "student"){          
        userRegister = false;        
        return
      }
    });

    if(sameUserInside){
      alert("User already inside");
      return
    } //User resgiter on same timetable
    else if(userRegister && !registernewTimeTable){
    
      let scheduleSelected = this.scheduleSelected;
      let indexTT = this.classRoomSelected.TimeTable.findIndex(element=> element==timeTableRegister);
      this.classRoomSelected.TimeTable[indexTT].Users.push(this.userSelected.IdUser);    

      this._classroomsService.updateClassroom(this.classRoomSelected);
      this.scheduleSelected= {} as TimeTable;
      alert("Classroom assigned");
    }else if(userRegister && registernewTimeTable){
      
      
      //A new user to array
      let userArray = [this.userSelected.IdUser];  
      this.scheduleSelected.Users = userArray; 
      let scheduledobtained = this.classRoomSelected.TimeTable
      scheduledobtained.push(this.scheduleSelected);
      this.classRoomSelected.TimeTable = scheduledobtained;
      this._classroomsService.updateClassroom(this.classRoomSelected);
      this.scheduleSelected= {} as TimeTable;
      alert("Classroom assigned");
    }else if(!userRegister && !registernewTimeTable){
      alert("Cannot register that user because theres another one with the same role");
    }

  }
    

}

