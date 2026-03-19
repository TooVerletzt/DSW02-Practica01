import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DepartamentosService } from './departamentos.service';
import { Departamento } from '../../shared/models/departamento.model';
import { SessionService } from '../../core/auth/session.service';
import { ApiFeedbackService } from '../../core/http/api-feedback.service';

@Component({
  selector: 'app-departamentos-list-page',
  imports: [RouterLink],
  templateUrl: './departamentos-list.page.html',
  styleUrl: './departamentos-list.page.scss'
})
export class DepartamentosListPage implements OnInit {
  departamentos: Departamento[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;

  constructor(
    private readonly departamentosService: DepartamentosService,
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
    this.departamentosService
      .list(page, this.size)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.departamentos = response.content;
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
    void this.router.navigate(['/departamentos', clave, 'editar']);
  }

  remove(clave: string): void {
    if (!confirm('Deseas eliminar este departamento?')) {
      return;
    }

    this.departamentosService.delete(clave).subscribe({
      next: () => {
        this.feedbackService.showSuccess('Departamento eliminado correctamente');
        this.load();
      },
      error: () => {
        // Error feedback is handled centrally by interceptor.
      }
    });
  }
}
