import { Client } from "./../../models/client.model";
import { ClientService } from "./../../shared/client.service";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  clients: Client[];
  subscription: Subscription;

  constructor(private clientService: ClientService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.clientService.getClients().subscribe((data) => {
      this.clients = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Client;
      });
    },
    (err) => {
      console.log('Error: ' + err);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEdit(id: string) {
    this.router.navigate(['save', id], {relativeTo: this.route});
  }

}
