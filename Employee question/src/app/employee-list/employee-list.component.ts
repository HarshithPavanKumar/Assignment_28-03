import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../models/employee.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent {
  @Input() employees: Employee[] = [];
  @Output() delete = new EventEmitter<string>();

  onDelete(id: string): void {
    if (id) {
      this.delete.emit(id);
    }
  }
}
