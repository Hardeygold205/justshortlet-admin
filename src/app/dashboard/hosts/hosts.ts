import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hosts',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './hosts.html',
  styleUrl: '../guests/guests.css',
})
export class Hosts implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  hosts = signal<User[]>([]);
  isLoading = signal<boolean>(true);

  showEditModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);
  selectedUser = signal<User | null>(null);
  userToDelete = signal<User | null>(null);

  actionLoading = signal<boolean>(false);
  actionError = signal<string | null>(null);

  editForm: FormGroup = this.fb.group({
    role: ['GUEST', Validators.required],
    status: ['ACTIVE', Validators.required],
  });

  getAvatarUrl(user: User): string {
    if (user.profile?.avatarUrl) {
      return user.profile.avatarUrl;
    }

    const firstName = user.profile?.firstName || '';
    const lastName = user.profile?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || user.email || 'Host';

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=171717&color=fafafa`;
  }

  ngOnInit(): void {
    this.loadHosts();
  }

  loadHosts(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.hosts.set(res.users.filter((u) => u.role === 'HOST'));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  openEdit(user: User): void {
    this.selectedUser.set(user);
    this.editForm.patchValue({
      role: user.role,
      status: user.status || 'ACTIVE',
    });
    this.actionError.set(null);
    this.showEditModal.set(true);
  }

  openDelete(user: User): void {
    this.userToDelete.set(user);
    this.actionError.set(null);
    this.showDeleteModal.set(true);
  }

  closeModals(): void {
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
    this.userToDelete.set(null);
  }

  submitEdit(): void {
    const user = this.selectedUser();
    if (!user || this.editForm.invalid) return;

    this.actionLoading.set(true);
    this.actionError.set(null);

    this.userService
      .updateUserRoleOrStatus(user.id, this.editForm.value)
      .subscribe({
        next: () => {
          this.actionLoading.set(false);
          this.closeModals();
          this.loadHosts();
        },
        error: (err) => {
          this.actionError.set(err.error?.message || 'Failed to update user');
          this.actionLoading.set(false);
        },
      });
  }

  confirmDelete(): void {
    const user = this.userToDelete();
    if (!user) return;

    this.actionLoading.set(true);
    this.actionError.set(null);

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.closeModals();
        this.loadHosts();
      },
      error: (err) => {
        this.actionError.set(err.error?.message || 'Failed to delete user');
        this.actionLoading.set(false);
      },
    });
  }
}
