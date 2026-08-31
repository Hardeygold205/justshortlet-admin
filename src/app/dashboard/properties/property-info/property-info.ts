import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule, CurrencyPipe, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import {
  Property,
  UpdatePropertyStatusDto,
} from '../../../models/property.model';
import { FormsModule } from '@angular/forms';

export interface PropertyImage {
  id: string;
  propertyId: string;
  uploadId: string;
  sortOrder: number;
  isCover: boolean;
  caption?: string | null;
  upload?: { url: string; thumbnailUrl?: string | null };
}

@Component({
  selector: 'app-property-info',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './property-info.html',
  styleUrl: './property-info.css',
})
export class PropertyInfo implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);
  private location = inject(Location);

  isLoading = signal<boolean>(true);
  property = signal<Property | null>(null);

  showStatusModal = signal<boolean>(false);
  newStatus = signal<'PUBLISHED' | 'REJECTED' | 'SUSPENDED' | 'ARCHIVED'>(
    'PUBLISHED',
  );
  rejectionReason = signal<string>('');
  isUpdatingStatus = signal<boolean>(false);

  selectedImageIndex = signal<number | null>(null);

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('propertyId');
    if (propertyId) {
      this.fetchProperty(propertyId);
    }
  }

  goBack(): void {
    this.location.back();
  }

  openLightbox(index: number): void {
    this.selectedImageIndex.set(index);
  }

  closeLightbox(): void {
    this.selectedImageIndex.set(null);
  }

  nextImage(imagesLength: number, event?: Event): void {
    event?.stopPropagation();
    const current = this.selectedImageIndex();
    if (current !== null) {
      this.selectedImageIndex.set((current + 1) % imagesLength);
    }
  }

  prevImage(imagesLength: number, event?: Event): void {
    event?.stopPropagation();
    const current = this.selectedImageIndex();
    if (current !== null) {
      this.selectedImageIndex.set((current - 1 + imagesLength) % imagesLength);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const index = this.selectedImageIndex();
    if (index === null) return;

    const images = this.property()?.images || [];
    if (!images.length) return;

    if (event.key === 'ArrowRight') {
      this.nextImage(images.length);
    } else if (event.key === 'ArrowLeft') {
      this.prevImage(images.length);
    } else if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }

  fetchProperty(id: string): void {
    this.isLoading.set(true);
    this.propertyService.getPropertyById(id).subscribe({
      next: (property) => {
        this.property.set(property);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  openStatusModal(): void {
    const current = this.property()?.status;
    this.newStatus.set(
      current === 'PENDING_REVIEW' ? 'PUBLISHED' : (current as any),
    );
    this.showStatusModal.set(true);
  }

  closeStatusModal(): void {
    this.showStatusModal.set(false);
  }

  updateStatus(): void {
    const prop = this.property();
    if (!prop) return;

    if (this.newStatus() === 'REJECTED' && !this.rejectionReason().trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    const dto: UpdatePropertyStatusDto = {
      status: this.newStatus(),
      rejectionReason:
        this.newStatus() === 'REJECTED' ? this.rejectionReason() : undefined,
    };

    this.isUpdatingStatus.set(true);
    this.propertyService.updatePropertyStatus(prop.id, dto).subscribe({
      next: (res) => {
        this.property.set(res.data);
        this.isUpdatingStatus.set(false);
        this.closeStatusModal();
      },
      error: (err) => {
        this.isUpdatingStatus.set(false);
        alert(err?.error?.message || 'Failed to update property status');
      },
    });
  }
}
