import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public hamClick: boolean
  constructor() { }

  ngOnInit(): void {
  }
  tocarNavbar(){
    this.hamClick = !this.hamClick;
  }
}
