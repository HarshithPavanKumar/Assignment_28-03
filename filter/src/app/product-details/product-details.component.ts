import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../../models/product.model';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  isLoading = true;
  categories: string[] = [];
  filters: any = {
    name: '',
    minPrice: null,
    maxPrice: null,
    category: '',
  };

  newProduct: Omit<Product, 'id'> = {
    name: '',
    price: 0,
    description: '',
    category: '',
    imageUrl: 'assets/images/default-product.jpg',
  };

  editingProduct: Product | null = null;
  showAddProductForm = false;
  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.extractCategories();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      },
    });
  }

  private extractCategories(): void {
    const uniqueCategories = new Set<string>();
    this.products.forEach((product) => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    this.categories = Array.from(uniqueCategories);
  }

  setupSearch(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.isLoading = true;
          return this.productService.searchProducts(term);
        })
      )
      .subscribe({
        next: (products) => {
          this.filteredProducts = products;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Search error:', err);
          this.isLoading = false;
        },
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchTerms.next('');
    this.filteredProducts = [...this.products];
  }

  applyFilters(): void {
    this.isLoading = true;
    this.productService.filterProducts(this.filters).subscribe({
      next: (products) => {
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error filtering products:', err);
        this.isLoading = false;
      },
    });
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      minPrice: null,
      maxPrice: null,
      category: '',
    };
    this.filteredProducts = [...this.products];
  }

  toggleAddProductForm(): void {
    this.showAddProductForm = !this.showAddProductForm;
    if (this.showAddProductForm && this.editingProduct) {
      this.cancelEdit();
    }
  }

  addProduct(): void {
    if (!this.validateProduct(this.newProduct)) {
      alert('Please enter valid product details');
      return;
    }

    this.productService.addProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.filteredProducts = [...this.products];
        this.extractCategories();
        this.resetNewProductForm();
        this.showAddProductForm = false;
      },
      error: (err) => console.error('Error adding product:', err),
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.showAddProductForm = false;
  }

  updateProduct(): void {
    if (!this.editingProduct) return;

    if (!this.validateProduct(this.editingProduct)) {
      alert('Please enter valid product details');
      return;
    }

    this.productService.updateProduct(this.editingProduct).subscribe({
      next: () => {
        const index = this.products.findIndex(
          (p) => p.id === this.editingProduct!.id
        );
        if (index !== -1) {
          this.products[index] = { ...this.editingProduct! };
          this.filteredProducts = [...this.products];
          this.extractCategories();
        }
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating product:', err),
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter((product) => product.id !== id);
          this.filteredProducts = this.filteredProducts.filter(
            (product) => product.id !== id
          );
          this.extractCategories();
        },
        error: (err) => console.error('Error deleting product:', err),
      });
    }
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }

  private validateProduct(product: Product | Omit<Product, 'id'>): boolean {
    return !!product.name && product.price > 0;
  }

  private resetNewProductForm(): void {
    this.newProduct = {
      name: '',
      price: 0,
      description: '',
      category: '',
      imageUrl: 'assets/images/default-product.jpg',
    };
  }

  ngOnDestroy(): void {
    this.searchTerms.complete();
  }
}
