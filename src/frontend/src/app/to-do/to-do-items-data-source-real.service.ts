import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToDoItem } from './to-do-list-view/to-do-item.model';
import { environment } from 'src/environments/environment';
import { ToDoItemsDataSourceService } from './to-do-items-data-source.service';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ToDoItemsDataSourceRealService implements ToDoItemsDataSourceService {
  private items: BehaviorSubject<ToDoItem[]> = new BehaviorSubject<ToDoItem[]>([]);
  private url: string;
  constructor(private httpClient: HttpClient) {
    this.url = environment.apiUrl;
  }

  public getToDoItems$(): Observable<ToDoItem[]> {
    var getUrl = this.url + "/api/listitems";
    this.httpClient.get(getUrl).subscribe((x: ToDoItem[]) => {
      this.items.next(x);
    });
    return this.items.asObservable();
  }

  public addItem(itemName: string) {
    var newItem:ToDoItem = { id: '', name: itemName };
    this.addItemToList(newItem);

    var getUrl = this.url + "/api/listitems";

    this.httpClient.post(getUrl,{name: itemName}).subscribe((x: ToDoItem) => {
      newItem.id = x.id
    },
    error =>{
      this.removeItem(newItem);
    });
  }

  private addItemToList(newItem: ToDoItem) {
    var newArray: ToDoItem[] = this.items.value.slice(0);
    newArray.push(newItem);
    this.items.next(newArray);
  }

  public setAsDone(toDoItem: ToDoItem) {
    this.removeItem(toDoItem);
    if(toDoItem.id)
    {
      var putUrl = this.url + "/api/listitems/" + toDoItem.id + "/check";
      debugger;
      this.httpClient.put(putUrl,{}).subscribe((x: ToDoItem) => {
        debugger;
      },
      error =>{
        this.addItemToList(toDoItem);
      });
    }
  }

  private removeItem(toDoItem: ToDoItem) {
    var newArray: ToDoItem[] = this.items.value.slice(0);
    var index = newArray.indexOf(toDoItem);
    if (index === -1) {
      return;
    }

    newArray.splice(index, 1);
    this.items.next(newArray);
  }

}
