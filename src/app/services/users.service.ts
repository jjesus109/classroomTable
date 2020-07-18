import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Users } from "../models/users.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: Observable<Users[]>;
  private usersCollection: AngularFirestoreCollection<Users>;
  private usersDoc: AngularFirestoreDocument<Users>;

  constructor(private db: AngularFirestore) {
    this.usersCollection = this.db.collection("users");
    this.users = this.usersCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Users;
          data.IdUser = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  addUser(user: Users) {
    return this.usersCollection.add(user).
    then(function(docRef) {
      return docRef.id
     });
  }
  deleteUser(user: Users) {
    this.usersDoc = this.db.doc(`users/${user.IdUser}`);    
    this.usersDoc.delete();
  }

  getUser() {
    return this.users;
  }

  updateUser(user: Users) {
    this.usersDoc = this.db.doc(`users/${user.IdUser}`);
    this.usersDoc.update(user);
  }
}