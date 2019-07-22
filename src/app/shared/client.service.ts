import { Client } from "./../models/client.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    constructor(private afs: AngularFirestore) {}

    getClients() {
        return this.afs.collection('clients').snapshotChanges();
    }

    getClient(id: string) {
        return this.afs.doc(`clients/${id}`).snapshotChanges();
    }

    addClient(client: Client) {
        return this.afs.collection('clients').add({firstName: client.firstName, lastName :client.lastName, city: client.city});
    }

    updateClient(client: Client) {
        return this.afs.doc(`clients/${client.id}`).update(client);
    }

}