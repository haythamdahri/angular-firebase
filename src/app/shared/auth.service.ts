import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private afAuth: AngularFireAuth){}

    loginWithEmailAndPassword(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        this.afAuth.auth.signOut();
    }

}