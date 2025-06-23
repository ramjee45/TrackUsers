import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/users-model';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  usersForm: FormGroup = new FormGroup({});
  countries: string[] = [];
  userId: string | null = '';
  formTitle: string = 'Create';
  constructor(
    private userService: UserService,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }
  ngOnInit() {
    this.usersForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required]
    });
    this.userId = this.route.snapshot.paramMap.get('id');
    this.countryService.getCountries().subscribe(
      (data) => {
        this.countries = data.map((country: any) => country.name.common);
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
    if (this.userId) {
      this.getSelectedUserDetails(this.userId);
      this.formTitle = 'Update';
    }
  }
  backToUserList(): void {
    this.router.navigateByUrl('/user/list');
  }

  saveUserData(): void {
    const payloadData: User = { ...this.usersForm.value, createdAt: new Date() };
    if (this.userId) {
      this.userService.updateUser(this.userId, payloadData).subscribe((res) => {
        notify({ message: 'User Updated successfully', position: { my: 'center middle', at: 'center middle', }, width: 300, }, 'success', 5000);
        this.backToUserList();
      },
      (err) => {
        console.error('Error updating user:', err);
      });
    } else {
      this.userService.addUser(payloadData).subscribe(() => {
        notify({ message: 'User created successfully', position: { my: 'center middle', at: 'center middle', }, width: 300, }, 'success', 5000);
        this.backToUserList();
      });
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
