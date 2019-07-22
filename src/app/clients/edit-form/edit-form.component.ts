import { Client } from './../../models/client.model';
import { Subscription } from 'rxjs';
import { ClientService } from './../../shared/client.service';
import { User } from './../../models/user.model';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

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
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      console.log(params.id);
      if (params['id'] != null) {
        this.clientService
          .getClient(params['id'])
          .subscribe(data => {
            this.client = {
              id: data.payload.id,
              ...data.payload.data()
            } as Client;
          });
      } else {
        this.client = new Client();
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
      if (this.client.id != undefined) {
        this.clientService
          .updateClient(this.client)
          .then(client => {
            alert('Data saved successflly');
          })
          .catch(err => alert('An error occured, please try again!'));
      } else {
        this.clientService
          .addClient(this.client)
          .then(client => {
            alert('Data saved successflly');
          })
          .catch(err => alert('An error occured, please try again!'));
      }
    } else {
      alert('Please fill login data');
    }
  }
}
