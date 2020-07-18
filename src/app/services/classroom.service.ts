import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Classroom } from "../models/classroom.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private clasrooms: Observable<Classroom[]>;
  private clasroomsCollection: AngularFirestoreCollection<Classroom>;
  private clasroomsDoc: AngularFirestoreDocument<Classroom>;

  constructor(private db: AngularFirestore) {
    this.clasroomsCollection = this.db.collection("classrooms");
    this.clasrooms = this.clasroomsCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Classroom;
          data.IdClassroom = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  addClassroom(classroom: Classroom) {
    this.clasroomsCollection.add(classroom)

  }
  deleteClassroom(classroom: Classroom) {
    this.clasroomsDoc = this.db.doc(`classrooms/${classroom.IdClassroom}`);    
    this.clasroomsDoc.delete();
  }

  getClassrooom() {
    return this.clasrooms;
  }

  updateClassroom(classroom: Classroom) {
    this.clasroomsDoc = this.db.doc(`classrooms/${classroom.IdClassroom}`);
    this.clasroomsDoc.update(classroom);
  }
}