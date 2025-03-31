import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      department: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.loadEmployee(this.employeeId);
    } else {
      this.navigateToDashboard();
    }
  }

  private loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue(employee);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.navigateToDashboard();
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid && this.employeeId) {
      this.isLoading = true;
      const updatedEmployee: Employee = {
        ...this.employeeForm.value,
        id: this.employeeId,
      };

      this.employeeService
        .updateEmployee(this.employeeId, updatedEmployee)
        .subscribe({
          next: () => {
            this.navigateToDashboard();
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.isLoading = false;
            alert('Failed to update employee');
          },
        });
    }
  }

  cancel(): void {
    this.navigateToDashboard();
  }

  private navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
