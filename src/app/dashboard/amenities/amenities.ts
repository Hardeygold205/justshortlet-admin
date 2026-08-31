import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmenityService } from '../../services/amenity.service';
import { Amenity, CreateAmenityDto } from '../../models/amenity.model';

@Component({
  selector: 'app-amenities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './amenities.html',
  styleUrl: './amenities.css',
})
export class Amenities implements OnInit {
  private amenityService = inject(AmenityService);

  isLoading = signal<boolean>(true);
  amenities = signal<Amenity[]>([]);

  // Modal State
  isModalOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  editingId = signal<string | null>(null);
  isSaving = signal<boolean>(false);

  // Form State
  formData = signal<CreateAmenityDto>({
    name: '',
    slug: '',
    category: 'Basic',
    icon: 'wind',
  });

  categories = [
    'Basic',
    'Entertainment',
    'Kitchen',
    'Outdoor',
    'Safety',
    'Other',
  ];

  ngOnInit(): void {
    this.fetchAmenities();
  }

  fetchAmenities(): void {
    this.isLoading.set(true);
    this.amenityService.getAllAmenities().subscribe({
      next: (res) => {
        this.amenities.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.formData.set({ name: '', slug: '', category: 'Basic', icon: 'wind' });
    this.isModalOpen.set(true);
  }

  openEditModal(amenity: Amenity): void {
    this.isEditing.set(true);
    this.editingId.set(amenity.id);
    this.formData.set({
      name: amenity.name,
      slug: amenity.slug,
      category: amenity.category,
      icon: amenity.icon,
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onNameChange(): void {
    if (!this.isEditing()) {
      const generatedSlug = this.formData()
        .name.toLowerCase()
        .trim()
        .replace(/\s+/g, '-');
      this.formData.update((f) => ({ ...f, slug: generatedSlug }));
    }
  }

  saveAmenity(): void {
    const data = this.formData();
    if (!data.name || !data.slug || !data.category) {
      alert('Please fill out all required fields.');
      return;
    }

    this.isSaving.set(true);

    if (this.isEditing() && this.editingId()) {
      this.amenityService.updateAmenity(this.editingId()!, data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.fetchAmenities();
        },
        error: (err) => {
          this.isSaving.set(false);
          alert(err?.error?.message || 'Failed to update amenity');
        },
      });
    } else {
      this.amenityService.createAmenity(data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.fetchAmenities();
        },
        error: (err) => {
          this.isSaving.set(false);
          alert(err?.error?.message || 'Failed to create amenity');
        },
      });
    }
  }

  deleteAmenity(amenity: Amenity): void {
    if (confirm(`Are you sure you want to delete "${amenity.name}"?`)) {
      this.amenityService.deleteAmenity(amenity.id).subscribe({
        next: () => this.fetchAmenities(),
        error: (err) =>
          alert(err?.error?.message || 'Failed to delete amenity'),
      });
    }
  }
}
