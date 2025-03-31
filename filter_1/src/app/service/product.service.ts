import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  searchProducts(term: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products.filter((product) =>
          product.name.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filterProducts(filters: any): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) => this.applyFilters(products, filters))
    );
  }

  private applyFilters(products: Product[], filters: any): Product[] {
    return products.filter((product) => {
      // Name filter
      if (
        filters.name &&
        !product.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }

      // Price range filter
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      return true;
    });
  }
}
