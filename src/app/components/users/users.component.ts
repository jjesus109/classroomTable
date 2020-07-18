import { Component, OnInit, KeyValueDiffers } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ClassroomService } from 'src/app/services/classroom.service';
import { Users } from 'src/app/models/users.model';
import { Classroom } from 'src/app/models/classroom.model';
import Swal from 'sweetalert2'
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
  public userInsideSchedules = {} as Object;
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
    this.findInfoUser(user);
    console.log("Esto",this.userInsideSchedules);
    this.showModal = !this.showModal;
  }
  findInfoUser(user){
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
  }
  eraseClass(time,classroomId){
    console.log("recibre",time,classroomId);
    this.eraseOneClass(time,classroomId);
    this.showModal = !this.showModal;
  }

  eraseUser(user:Users){
    // Update this.userInsideSchedules
    this.findInfoUser(user);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'button is-primary',
        cancelButton: 'button is-danger'
      },
      buttonsStyling: false
    
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Classroom has been deleted.',
          'success'
        )
        console.log("Borrado");
        let keys = Object.keys(this.userInsideSchedules);
        keys.forEach(k=>{
          let currentValue = this.userInsideSchedules[k];
          this.eraseOneClass(currentValue[0],k)
        });
        this._usersService.deleteUser(user);
      } 
    })



    
  }

  eraseOneClass(time,classroomId){
    let classroomToEdit={} as Classroom;
    this.classroomsGet.forEach(classroom=>{
      if(classroom.IdClassroom==classroomId){
        classroomToEdit = classroom;
      }
    });
    classroomToEdit.TimeTable.forEach(element=>{
      if(element.Users.includes(this.userEdit.IdUser)
        &&element.From == time.From
        &&element.To == time.To){
          console.log("AJja");
          
        let index= element.Users.indexOf(this.userEdit.IdUser)
        
        element.Users.splice(index,1);
      }
    });
    console.log("classroomToEdit",classroomToEdit);
    this._classroomsService.updateClassroom(classroomToEdit);
    
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


