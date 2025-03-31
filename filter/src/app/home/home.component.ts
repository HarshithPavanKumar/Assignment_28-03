import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <h1>Welcome to Our Store</h1>
      <!-- Using routerLink for navigation -->
      <button class="nav-btn" routerLink="/products">View Products</button>
    </div>
  `,
  styles: [
    `
      .home-container {
        text-align: center;
        padding: 2rem;
      }
      .nav-btn {
        padding: 12px 24px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .nav-btn:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class HomeComponent {
  constructor(private router: Router) {}
}
