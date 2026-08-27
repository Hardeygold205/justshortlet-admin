import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './admins.html',
  styleUrl: './admins.css',
})
export class Admins implements OnInit {
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);

  admins = signal<User[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  showCreateModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);

  selectedAdmin = signal<User | null>(null);
  adminToDelete = signal<User | null>(null);

  actionLoading = signal<boolean>(false);
  actionError = signal<string | null>(null);

  createForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['ADMIN', Validators.required],
    firstName: [''],
    lastName: [''],
  });

  editForm: FormGroup = this.fb.group({
    role: ['ADMIN', Validators.required],
    status: ['ACTIVE', Validators.required],
  });

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load admins');
        this.isLoading.set(false);
      },
    });
  }

  openCreate(): void {
    this.createForm.reset({ role: 'ADMIN' });
    this.actionError.set(null);
    this.showCreateModal.set(true);
  }

  openEdit(admin: User): void {
    this.selectedAdmin.set(admin);
    this.editForm.patchValue({
      role: admin.role,
      status: admin.status || 'ACTIVE',
    });
    this.actionError.set(null);
    this.showEditModal.set(true);
  }

  openDeleteModal(admin: User): void {
    this.adminToDelete.set(admin);
    this.actionError.set(null);
    this.showDeleteModal.set(true);
  }

  closeModals(): void {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.selectedAdmin.set(null);
    this.adminToDelete.set(null);
  }

  submitCreate(): void {
    if (this.createForm.invalid) return;
    this.actionLoading.set(true);
    this.actionError.set(null);

    this.adminService.createAdmin(this.createForm.value).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.closeModals();
        this.loadAdmins();
      },
      error: (err) => {
        this.actionError.set(err.error?.message || 'Failed to create admin');
        this.actionLoading.set(false);
      },
    });
  }

  submitEdit(): void {
    const admin = this.selectedAdmin();
    if (!admin || this.editForm.invalid) return;
    this.actionLoading.set(true);
    this.actionError.set(null);

    this.adminService.updateAdmin(admin.id, this.editForm.value).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.closeModals();
        this.loadAdmins();
      },
      error: (err) => {
        this.actionError.set(err.error?.message || 'Failed to update admin');
        this.actionLoading.set(false);
      },
    });
  }

  confirmDelete(): void {
    const admin = this.adminToDelete();
    if (!admin) return;
    this.actionLoading.set(true);
    this.actionError.set(null);

    this.adminService.deleteAdmin(admin.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.closeModals();
        this.loadAdmins();
      },
      error: (err) => {
        this.actionError.set(err.error?.message || 'Failed to delete admin');
        this.actionLoading.set(false);
      },
    });
  }
}
