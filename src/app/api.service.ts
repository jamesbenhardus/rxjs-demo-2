import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  makeApiCall() {
    return this.http.get("http://worldtimeapi.org/api/ip");
  }

  getTime(location: string) {
    return this.http.get("http://worldtimeapi.org/api/timezone/" + location);
  }

  getTimezones() {
    return this.http.get("http://worldtimeapi.org/api/timezone");
  }
}
