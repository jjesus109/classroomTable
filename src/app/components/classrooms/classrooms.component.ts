import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ClassroomService } from 'src/app/services/classroom.service';
import { Users } from 'src/app/models/users.model';
import { Classroom } from 'src/app/models/classroom.model';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.scss']
})
export class ClassroomsComponent implements OnInit {
  private usersSubscription:any;
  private classSubscription:any;
  public usersGet:Array<Users> = [];
  public classroomsGet:Array<Classroom> = [];
  public emptyData:boolean = false;
  public showModal:boolean = false;
  public classroomEdit = {} as Classroom;
  public userId = {};
  constructor(
    private _usersService: UsersService,
    private _classroomsService: ClassroomService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.classSubscription= this._classroomsService.getClassrooom().subscribe(clasroomsGet=>{
      this.classroomsGet = clasroomsGet;
      console.log("Data class",clasroomsGet);
      this.usersSubscription = this._usersService.getUser().subscribe(userGet=>{
        this.usersGet = userGet;
        this.usersGet.forEach(element=>{
          this.userId[element.IdUser] = element.Name;
        });
        console.log("Data userGet",userGet);
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

  editClass(classrom){
    this.classroomEdit = classrom;
    this.showModal = !this.showModal;
  }
  eraseSchedule(schuduleErase:any){
    let erasescheduleindex = this.classroomEdit.TimeTable.indexOf(schuduleErase);
    this.classroomEdit.TimeTable.splice(erasescheduleindex,1);
    this._classroomsService.updateClassroom(this.classroomEdit);
  }
  eraseClassroom(classroom:Classroom){
    this._classroomsService.deleteClassroom(classroom);
  }
  cancelUpdate(){
    this.classroomEdit = {} as Classroom;
    this.showModal = !this.showModal;
  }
  updateClassroom(){
    this._classroomsService.updateClassroom(this.classroomEdit);
    this.showModal = !this.showModal;
  }

}
