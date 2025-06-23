import { Component, Signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { CountryService } from '../../services/country.service';
import { Router } from '@angular/router';
import { User } from '../../models/users-model';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  usersData: Signal<User[]>;
  usersForm: FormGroup = new FormGroup({});
  countries: string[] = [];
  formTitle: string = 'Create';
  constructor(
    private userService: UserService,
    private countryService: CountryService,
    private router: Router,
    private fb: FormBuilder) {
      this.usersData = this.userService.users;
    }
  ngOnInit() {
    this.usersForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required]
    });
    this.countryService.getCountries().subscribe(
      (data) => {
        this.countries = data.map((country: any) => country.name.common);
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
    if (this.userService.selectedUserId()) {
      this.formTitle = 'Update';
      this.getSelectedUserDetails(this.userService.selectedUserId());
    }
  }
  backToUserList(): void {
    this.router.navigateByUrl('/user/list');
  }

  saveUserData(): void {
    const payloadData: User = { ...this.usersForm.value, createdAt: new Date() };
    if (this.userService.selectedUserId()) {
      this.userService.updateUser(this.userService.selectedUserId(), payloadData);
    } else {
      this.userService.addUser(payloadData);
    }
  }
  getSelectedUserDetails(id: string): void {
    this.userService.getUserById(id).subscribe((data) => {
      this.setUsersData(data);
    }, () => {
      notify({ message: 'Unable to get user details!', position: { my: 'center middle', at: 'center middle', }, wdth: 300, }, 'success', 5000);
    });
  }

  setUsersData(userData: User): void {
    this.usersForm.patchValue({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      country: userData.country
    });
  }
}
