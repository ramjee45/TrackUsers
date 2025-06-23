import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users-model';
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private usersSignal = signal<User[]>([]);
  selectedUserId = signal('');
  users = this.usersSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router) {}

  getUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe((data: User[]) => {
      this.usersSignal.set(data);
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  addUser(user: User): void {
    this.http.post<User>(this.apiUrl, user).subscribe((newUser: User) => {
      notify({ message: 'User Created successfully', position: { my: 'center middle', at: 'center middle', }, width: 300, }, 'success', 5000);
      this.backToUserList();
      this.usersSignal.update((users: User[]) => [...users, newUser]);
    });
  }

  updateUser(id: string, updatedUser: Partial<User>): void {
    const url = `${this.apiUrl}/${id}`;
    this.http.put<User>(url, updatedUser).subscribe((updated: User) => {
      notify({ message: 'User Updated successfully', position: { my: 'center middle', at: 'center middle', }, width: 300, }, 'success', 5000);
      this.backToUserList();
      this.usersSignal.update((users: User[]) =>
        users.map((u) => (u.id === id ? { ...u, ...updated } : u))
      );
    });
  }
  deleteUser(id: string): void {
    const url = `${this.apiUrl}/${id}`;
    this.http.delete<void>(url).subscribe(() => {
      notify({ message: 'User deleted successfully', position: { my: 'center middle', at: 'center middle', }, width: 300, }, 'success', 5000);
      this.usersSignal.update((data: User[]) => data.filter((u: User) => u.id !== id));
    });
  }
  backToUserList(): void {
    this.router.navigateByUrl('/user/list');
  }
}
