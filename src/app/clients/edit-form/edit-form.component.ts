import { Client } from './../../models/client.model';
import { Subscription } from 'rxjs';
import { ClientService } from './../../shared/client.service';
import Swal from 'sweetalert2';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit, OnDestroy {
  client: Client;
  subscription: Subscription;
  @ViewChild('saveBtn') saveBtn: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      console.log(params.id);
      if (params['id'] != null) {
        this.clientService.getClient(params['id']).subscribe(data => {
          this.client = {
            id: data.payload.id,
            ...data.payload.data()
          } as Client;
        });
      } else {
        this.client = new Client();
        this.client.firstName = '';
        this.client.lastName = '';
        this.client.city = '';
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSave() {
    if (
      this.client.firstName !== '' &&
      this.client.lastName !== '' &&
      this.client.city !== ''
    ) {
      (<HTMLInputElement>this.saveBtn.nativeElement).innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Saving';
      (<HTMLInputElement>this.saveBtn.nativeElement).disabled = true;
      if (this.client.id != undefined) {
        this.clientService
          .updateClient(this.client)
          .then(client => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Client saved successfully'
            });
            this.router.navigate(['clients']);
          })
          .catch(err => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: 'error',
              title: 'An error occurred, please try again later!'
            });
            (<HTMLInputElement>this.saveBtn.nativeElement).innerHTML =
              '<i class="fas fa-save"></i> Save';
            (<HTMLInputElement>this.saveBtn.nativeElement).disabled = false;
          });
      } else {
        this.clientService
          .addClient(this.client)
          .then(client => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Client saved successfully'
            });
            this.router.navigate(['clients']);
          })
          .catch(err => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: 'error',
              title: 'An error occurred, please try again later!'
            });
            (<HTMLInputElement>this.saveBtn.nativeElement).innerHTML =
              '<i class="fas fa-save"></i> Save';
            (<HTMLInputElement>this.saveBtn.nativeElement).disabled = false;
          });
      }
    } else {
      Swal.fire('Invalid data', 'Please fill valid data!', 'warning');
    }
  }
}
