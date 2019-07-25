import { Title } from "@angular/platform-browser";
import { ConstantsService } from './../shared/constants.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  fileUploaded = false;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  uploadStarted = false;

  constructor(
    private storage: AngularFireStorage,
    private constantsService: ConstantsService, 
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Files Manager');
  }

  init() {
    this.uploadStarted = false;
    this.fileUploaded = false;
  }

  onFileUpload(event) {
    const file = event.target.files[0];
    const size = Math.round(file.size / 1024);
    console.log(size);
    if (size < this.constantsService.MAX_FILE_SIZE) {
      this.uploadStarted = true;
      const filePath = `crm/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      // get notified when the download URL is available
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.fileUploaded = true;
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'File has been uploaded successflly'
            });
          })
        )
        .subscribe();
    } else {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        html: '<i class="fas fa-exclamation-triangle"></i> Maximum file exceeded!',
        confirmButtonText: '<i class="fas fa-check"></i> Ok'
      })
    }
  }
}
