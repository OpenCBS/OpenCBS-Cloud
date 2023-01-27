import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CFBuilderService {

  constructor(private httpClient: HttpClient) {
  }

  updateSection(url: string, id: number, data: Object) {
    return this.httpClient.put(`${url}/${id}`, data);
  }

  createSection(url: string, data: Object) {
    return this.httpClient.post(url, data);
  }

  updateField(url: string, id: number, data: Object) {
    return this.httpClient.put(`${url}/${id}`, data);
  }

  createField(url: string, data: Object) {
    return this.httpClient.post(url, data);
  }

  removeField(url: string, id: number) {
    return this.httpClient.delete(`${url}/${id}`);
  }

  getFields(url: string) {
    return this.httpClient.get(`${url}`);
  }
}
