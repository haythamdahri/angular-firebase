import { ConstantsService } from './../shared/constants.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioRecordingService } from '../shared/audio-recording.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit, OnDestroy {
  isRecording = false;
  recordedTime;
  blobUrl;
  uploadStarted = false;
  fileUploaded = false;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage,
    private constantsService: ConstantsService
  ) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe(time => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe(data => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
    });
  }

  ngOnInit() {}

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
    this.uploadStarted = false;
    this.fileUploaded = false;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }



  // Upload saved audio file to firebase
  onFileUpload() {
    let metadata = {
      type: 'audio/mp3'
    };
    const file = new File(this.blobUrl, new Date().getTime().toString(), metadata);
    const size = Math.round(file.size / 1024);
    console.log(size);

    // if (size < this.constantsService.MAX_FILE_SIZE) {
    //   this.uploadStarted = true;
    //   const filePath = `crm/${file.name}`;
    //   const fileRef = this.storage.ref(filePath);
    //   const task = this.storage.upload(filePath, file);

    //   // observe percentage changes
    //   this.uploadPercent = task.percentageChanges();
    //   // get notified when the download URL is available
    //   task
    //     .snapshotChanges()
    //     .pipe(
    //       finalize(() => {
    //         this.downloadURL = fileRef.getDownloadURL();
    //         this.fileUploaded = true;
    //         const Toast = Swal.mixin({
    //           toast: true,
    //           position: 'top-end',
    //           showConfirmButton: false,
    //           timer: 3000
    //         });

    //         Toast.fire({
    //           type: 'success',
    //           title: 'File has been uploaded successflly'
    //         });
    //       })
    //     )
    //     .subscribe();
    // } else {
    //   Swal.fire({
    //     type: 'error',
    //     title: 'Oops...',
    //     html:
    //       '<i class="fas fa-exclamation-triangle"></i> Maximum file exceeded!',
    //     confirmButtonText: '<i class="fas fa-check"></i> Ok'
    //   });
    // }
  }
}
