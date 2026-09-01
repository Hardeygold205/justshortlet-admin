import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Property,
  PropertyFilterParams,
  PropertyPagination,
  PropertyStatus,
  PropertyType,
  UpdatePropertyStatusDto,
} from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './properties.html',
  styleUrl: './properties.css',
})
export class Properties implements OnInit {
  private propertyService = inject(PropertyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = signal<boolean>(true);
  properties = signal<Property[]>([]);
  pagination = signal<PropertyPagination>({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  filters = signal<PropertyFilterParams>({
    page: 1,
    limit: 10,
    status: undefined,
    city: '',
    type: '',
    hostId: '',
  });

  selectedPropertyForStatus = signal<Property | null>(null);
  newStatus = signal<'PUBLISHED' | 'REJECTED' | 'SUSPENDED' | 'ARCHIVED'>(
    'PUBLISHED',
  );
  rejectionReason = signal<string>('');
  isUpdatingStatus = signal<boolean>(false);

  propertyTypes: PropertyType[] = [
    'APARTMENT',
    'HOUSE',
    'DUPLEX',
    'STUDIO',
    'PENTHOUSE',
    'VILLA',
    'OTHER',
  ];

  statuses: PropertyStatus[] = [
    'DRAFT',
    'PENDING_REVIEW',
    'PUBLISHED',
    'REJECTED',
    'SUSPENDED',
    'ARCHIVED',
  ];

  filterStatus: PropertyStatus | undefined = undefined;
  filterType: PropertyType | '' = '';
  filterCity = '';
  filterHostId = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      const page = queryParams['page'] ? Number(queryParams['page']) : 1;
      this.filterStatus = queryParams['status'] || undefined;
      this.filterType = queryParams['type'] || '';
      this.filterCity = queryParams['city'] || '';
      this.filterHostId = queryParams['hostId'] || '';

      this.filters.set({
        page,
        limit: 10,
        status: this.filterStatus,
        city: this.filterCity,
        type: this.filterType,
        hostId: this.filterHostId,
      });
      this.fetchProperties();
    });
  }

  fetchProperties(): void {
    this.isLoading.set(true);
    this.propertyService.getAdminProperties(this.filters()).subscribe({
      next: (res) => {
        this.properties.set(res.data.properties);
        this.pagination.set(res.data.pagination);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  applyFilters(): void {
    this.filters.set({
      page: 1,
      limit: 10,
      status: this.filterStatus,
      city: this.filterCity,
      type: this.filterType,
      hostId: this.filterHostId,
    });
    this.syncQueryParamsAndFetch();
  }

  resetFilters(): void {
    this.filterStatus = undefined;
    this.filterType = '';
    this.filterCity = '';
    this.filterHostId = '';
    this.filters.set({
      page: 1,
      limit: 10,
      status: undefined,
      city: '',
      type: '',
      hostId: '',
    });
    this.syncQueryParamsAndFetch();
  }

  changePage(page: number): void {
    this.filters.update((f) => ({ ...f, page }));
    this.syncQueryParamsAndFetch();
  }

  private syncQueryParamsAndFetch(): void {
    const queryParams: any = {};
    const f = this.filters();
    if (f.status) queryParams.status = f.status;
    if (f.city) queryParams.city = f.city;
    if (f.type) queryParams.type = f.type;
    if (f.hostId) queryParams.hostId = f.hostId;
    if (f.page && f.page > 1) queryParams.page = f.page;

    this.router.navigate([], { queryParams, relativeTo: this.route });
  }

  openStatusModal(property: Property): void {
    this.selectedPropertyForStatus.set(property);
    this.newStatus.set(
      property.status === 'PENDING_REVIEW'
        ? 'PUBLISHED'
        : (property.status as any),
    );
    this.rejectionReason.set('');
  }

  closeStatusModal(): void {
    this.selectedPropertyForStatus.set(null);
  }

  updateStatus(): void {
    const prop = this.selectedPropertyForStatus();
    if (!prop) return;

    if (this.newStatus() === 'REJECTED' && !this.rejectionReason().trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    const payload: UpdatePropertyStatusDto = {
      status: this.newStatus(),
      rejectionReason:
        this.newStatus() === 'REJECTED' ? this.rejectionReason() : undefined,
    };

    this.isUpdatingStatus.set(true);
    this.propertyService.updatePropertyStatus(prop.id, payload).subscribe({
      next: () => {
        this.isUpdatingStatus.set(false);
        this.closeStatusModal();
        this.fetchProperties();
      },
      error: (err) => {
        this.isUpdatingStatus.set(false);
        alert(err?.error?.message || 'Failed to update property status');
      },
    });
  }
}
