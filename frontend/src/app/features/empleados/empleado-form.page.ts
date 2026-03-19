import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from './empleados.service';
import { ApiFeedbackService } from '../../core/http/api-feedback.service';
import { DepartamentosService } from '../departamentos/departamentos.service';
import { Departamento } from '../../shared/models/departamento.model';
import { EmpleadoPayload } from '../../shared/models/empleado.model';

@Component({
  selector: 'app-empleado-form-page',
  imports: [ReactiveFormsModule],
  templateUrl: './empleado-form.page.html',
  styleUrl: './empleado-form.page.scss'
})
export class EmpleadoFormPage implements OnInit {
  clave: string | null = null;
  departamentos: Departamento[] = [];
  saving = false;
  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly empleadosService: EmpleadosService,
    private readonly departamentosService: DepartamentosService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly feedbackService: ApiFeedbackService
  ) {
    this.form = this.fb.nonNullable.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      role: ['USER', [Validators.required]],
      departamentoClave: ['']
    });
  }

  ngOnInit(): void {
    this.clave = this.route.snapshot.paramMap.get('clave');
    this.loadDepartamentos();

    if (this.clave) {
      this.empleadosService.getByClave(this.clave).subscribe((empleado) => {
        this.form.patchValue({
          nombre: empleado.nombre,
          direccion: empleado.direccion,
          telefono: empleado.telefono,
          email: empleado.email,
          role: empleado.role,
          departamentoClave: empleado.departamentoClave ?? ''
        });
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
    const payload: EmpleadoPayload = {
      nombre: value.nombre.trim(),
      direccion: value.direccion.trim(),
      telefono: value.telefono.trim(),
      email: value.email.trim(),
      password: value.password,
      role: value.role as 'ADMIN' | 'USER',
      departamentoClave: value.departamentoClave.trim() || null
    };

    const operation$ = this.isEditMode
      ? this.empleadosService.update(this.clave!, payload)
      : this.empleadosService.create(payload);

    operation$.subscribe({
      next: () => {
        this.saving = false;
        this.feedbackService.showSuccess(this.isEditMode ? 'Empleado actualizado' : 'Empleado creado');
        void this.router.navigate(['/empleados']);
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  private loadDepartamentos(): void {
    this.departamentosService.list(0, 100, 'clave,asc').subscribe({
      next: (page) => {
        this.departamentos = page.content;
      },
      error: () => {
        this.departamentos = [];
      }
    });
  }
}
