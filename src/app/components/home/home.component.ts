import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ClassroomService } from 'src/app/services/classroom.service';
import { Users } from 'src/app/models/users.model';
import { Classroom } from 'src/app/models/classroom.model';
import { environment } from "src/environments/environment"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private usersSubscription:any;
  private classSubscription:any;
  public usersGet:Array<Users> = [];
  public classroomsGet:Array<Classroom> = [];

  constructor(
    private _usersService: UsersService,
    private _classroomsService: ClassroomService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.classSubscription= this._classroomsService.getClassrooom().subscribe(clasroomsGet=>{
      this.classroomsGet = clasroomsGet;
      
    });
    this.usersSubscription = this._usersService.getUser().subscribe(userGet=>{
      this.usersGet = userGet;

    });

    
  }

  ngOnDestroy() {
    this.classSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }



}
