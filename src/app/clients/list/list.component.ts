import { Title } from "@angular/platform-browser";
import { Client } from './../../models/client.model';
import { ClientService } from './../../shared/client.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  clients: Client[];
  subscription: Subscription;
  p: Number = 1;
  count: Number = 5;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute, 
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Client Manager');
    this.subscription = this.clientService.getClients().subscribe(
      data => {
        this.clients = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Client;
        });
      },
      err => {
        console.log('Error: ' + err);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEdit(id: string) {
    this.router.navigate(['save', id], { relativeTo: this.route });
  }

  onDelete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText:
        '<i class="fas fa-chevron-circle-down"></i> Yes, delete it!',
      cancelButtonText: '<i class="fas fa-times"></i> No, cancel'
    }).then(result => {
      if (result.value) {
        this.clientService
          .deleteClient(id)
          .then(() => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Client deletd successfully'
            });
          })
          .catch(err => {
            Swal.fire(
              'Error!',
              'An error occurred, please try again later!',
              'error'
            );
          });
      }
    });
  }

  onSearch(keyword: string) {
    if (keyword === '') {
      this.ngOnInit();
    } else {
      this.subscription = this.clientService
        .getCustomClients(keyword)
        .subscribe(
          data => {
            this.clients = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data()
              } as Client;
            });
          },
          err => {
            console.log('Error: ' + err);
          }
        );
    }
  }
}
