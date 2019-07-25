import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  MAX_FILE_SIZE = 2048; // 2Mb as a maximum size of any file to upload
  WEATHER_API_KEY = 'a72a8a2eb463bdd3784614fc52229a70';

  constructor() {}
  
}
