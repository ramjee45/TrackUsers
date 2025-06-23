import { Component, OnInit } from '@angular/core';
import { User } from '../../models/users-model';
import { UserService } from '../../services/users.service';
import { Router } from '@angular/router';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Column } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: false,
  styleUrls: ['./list.component.scss'],
  providers: []
})
export class ListComponent implements OnInit {
  users: User[] = [];
  userId: string | null = '';
  columns: Column[] = [
    {
      caption: 'Full Name',
      calculateCellValue: (rowData: User) => `${rowData.firstName} ${rowData.lastName}`,
    },
    {
      dataField: 'email',
      caption: 'Email'
    },
    {
      dataField: 'country',
      caption: 'Country'
    },
    {
      caption: 'Created At',
      calculateCellValue: (rowData: User) =>
        new Date(rowData.createdAt).toLocaleString()
    },
    {
      caption: 'Action',
      cellTemplate: 'actionCellTemplate',
      alignment:'center'
    }
  ];
  constructor(
    private userService: UserService,
    private router: Router) { }
  ngOnInit(): void {
    this.getAllUsersData();
  }
  getAllUsersData() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    })
  }
  createUser() {
    this.router.navigateByUrl('/user/create');
  }
  editUser(data: User) {
    this.router.navigateByUrl(`/user/update/${data.id}`);
  }
  deleteUser(data: User) {
    confirm(`Are you sure you want to delete user ${data.firstName}?`, 'Confirm Delete')
      .then((dialogResult: boolean) => {
        if (dialogResult) {
          this.userService.deleteUser(data.id).subscribe(() => {
            notify({ message: 'User deleted successfully', position: { my: 'center middle', at: 'center middle', }, width: 300, }, 'success', 5000);
            this.getAllUsersData();
          }, () => {
            notify({ message: 'Unable to deleted User', position: { my: 'center middle', at: 'center middle', }, width: 300, }, 'error', 5000);
          })
        }
      });
  }
}
