import { Component, OnInit, signal, Signal } from '@angular/core';
import { User } from '../../models/users-model';
import { UserService } from '../../services/users.service';
import { Router } from '@angular/router';
import { confirm } from 'devextreme/ui/dialog';
import { Column } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: false,
  styleUrls: ['./list.component.scss'],
  providers: []
})
export class ListComponent implements OnInit {
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
    public userService: UserService,
    private router: Router) { }
  ngOnInit(): void {
    this.userService.getUsers();
  }
  createUser() {
    this.router.navigateByUrl('/user/create');
  }
  editUser(data: User) {
    this.userService.selectedUserId.set(data.id)
    this.router.navigateByUrl(`/user/update`);
  }
  deleteUser(data: User) {
    confirm(`Are you sure you want to delete user ${data.firstName}?`, 'Confirm Delete')
      .then((dialogResult: boolean) => {
        if (dialogResult) {
          this.userService.deleteUser(data.id);
        }
      });
  }
}
