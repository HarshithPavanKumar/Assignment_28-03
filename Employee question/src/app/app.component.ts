import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <nav class="navbar">
      <a routerLink="/dashboard" class="nav-link">Dashboard</a>
      <a routerLink="/add-employee" class="nav-link">Add Employee</a>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .navbar {
        background: #f8f9fa;
        padding: 1rem;
        margin-bottom: 2rem;
      }
      .nav-link {
        margin-right: 1rem;
        text-decoration: none;
        color: #333;
      }
      .nav-link:hover {
        text-decoration: underline;
      }
      .container {
        padding: 0 1rem;
      }
    `,
  ],
})
export class AppComponent {}
