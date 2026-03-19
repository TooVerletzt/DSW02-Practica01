import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentosService } from './departamentos.service';
import { ApiFeedbackService } from '../../core/http/api-feedback.service';
import { DepartamentoPayload } from '../../shared/models/departamento.model';

@Component({
  selector: 'app-departamento-form-page',
  imports: [ReactiveFormsModule],
  templateUrl: './departamento-form.page.html',
  styleUrl: './departamento-form.page.scss'
})
export class DepartamentoFormPage implements OnInit {
  clave: string | null = null;
  saving = false;
  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly departamentosService: DepartamentosService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly feedbackService: ApiFeedbackService
  ) {
    this.form = this.fb.nonNullable.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.clave = this.route.snapshot.paramMap.get('clave');

    if (this.clave) {
      this.departamentosService.getByClave(this.clave).subscribe((departamento) => {
        this.form.patchValue({ nombre: departamento.nombre });
      });
    }
  }

  get isEditMode(): boolean {
    return !!this.clave;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving) {
      return;
    }

    this.saving = true;
    const value = this.form.getRawValue();
    const payload: DepartamentoPayload = {
      nombre: value.nombre.trim()
    };

    const operation$ = this.isEditMode
      ? this.departamentosService.update(this.clave!, payload)
      : this.departamentosService.create(payload);

    operation$.subscribe({
      next: () => {
        this.saving = false;
        this.feedbackService.showSuccess(this.isEditMode ? 'Departamento actualizado' : 'Departamento creado');
        void this.router.navigate(['/departamentos']);
      },
      error: () => {
        this.saving = false;
      }
    });
  }
}
