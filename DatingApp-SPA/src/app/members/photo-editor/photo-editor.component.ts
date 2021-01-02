import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { error } from 'protractor';
import { Photo } from 'src/app/_models/photo';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos: Photo[];
@Output() getMemberPhotoCange = new EventEmitter<string>();

uploader:FileUploader;
hasBaseDropZoneOver= false;
baseUrl = environment.apiUrl;
currenMain: Photo;

  constructor(private autheService: AuthService, private userServise: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.autheService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;};

    this.uploader.onSuccessItem = (item, response, status, Headers) => {
      if(response) {
        const res: Photo = JSON.parse( response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if(photo.isMain) {
          this.autheService.changeMenmberPhoto(photo.url);
          this.autheService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.autheService.currentUser));
        }
      }
    };
  }

  SetMainPhoto(photo: Photo) {
    this.userServise.setMainPhoto(this.autheService.decodedToken.nameid, photo.id).subscribe(() => {
      this.currenMain = this.photos.filter(p => p.isMain === true)[0];
      this.currenMain.isMain = false;
      photo.isMain = true;
      this.autheService.changeMenmberPhoto(photo.url);
      this.autheService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.autheService.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }
  DeletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo?',() => {
      this.userServise.deletePhoto(this.autheService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Photo has deleted')
      }, error => {
        this.alertify.error('Failed to delre the photo');
      })
    });

  }

}
