import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EmpleadosService } from './empleados.service';
import { Empleado } from '../../shared/models/empleado.model';
import { SessionService } from '../../core/auth/session.service';
import { ApiFeedbackService } from '../../core/http/api-feedback.service';

@Component({
  selector: 'app-empleados-list-page',
  imports: [RouterLink],
  templateUrl: './empleados-list.page.html',
  styleUrl: './empleados-list.page.scss'
})
export class EmpleadosListPage implements OnInit {
  empleados: Empleado[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;

  constructor(
    private readonly empleadosService: EmpleadosService,
    private readonly sessionService: SessionService,
    private readonly feedbackService: ApiFeedbackService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get isAdmin(): boolean {
    return this.sessionService.hasRole('ADMIN');
  }

  load(page = this.page): void {
    this.loading = true;
    this.empleadosService
      .list(page, this.size)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.empleados = response.content;
          this.page = response.number;
          this.totalPages = response.totalPages;
        },
        error: () => {
          // Error feedback is handled centrally by interceptor.
        }
      });
  }

  prevPage(): void {
    if (this.page > 0) {
      this.load(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.load(this.page + 1);
    }
  }

  edit(clave: string): void {
    void this.router.navigate(['/empleados', clave, 'editar']);
  }

  remove(clave: string): void {
    if (!confirm('Deseas eliminar este empleado?')) {
      return;
    }

    this.empleadosService.delete(clave).subscribe({
      next: () => {
        this.feedbackService.showSuccess('Empleado eliminado correctamente');
        this.load();
      },
      error: () => {
        // Error feedback is handled centrally by interceptor.
      }
    });
  }
}
