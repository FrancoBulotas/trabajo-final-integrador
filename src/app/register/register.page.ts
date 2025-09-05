import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  // ---------- Reactive Form ----------
  form = new FormGroup({
    fullName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  // UI state
  submitted = false;
  loading = false;
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' | 'warning' = 'success';

  constructor(private supabase: SupabaseService, private router: Router) {}

  // Helpers
  get f() {
    return this.form.controls;
  }
  showError(ctrl: keyof RegisterPage['form']['controls'], key?: string) {
    const c = this.form.get(ctrl as string);
    if (!c) return false;
    const touched = this.submitted || c.touched || c.dirty;
    return key ? (touched && c.hasError(key)) : (touched && c.invalid);
  }
  private toast(message: string, color: 'success' | 'danger' | 'warning') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  // ---------- Actions ----------
  async register() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toast('Revisá los campos del formulario', 'warning');
      return;
    }

    this.loading = true;
    const { fullName, email, password } = this.form.getRawValue();

    try {
      // 1) Crear usuario en Supabase Auth
      const { user } = await this.supabase.signUp(email!, password!);
      if (!user) throw new Error('No se pudo crear el usuario');

      // 2) Crear fila en tabla "usuarios"
      await this.supabase.createProfile(user.id, fullName!, email!);

      this.toast('✅ Usuario registrado correctamente', 'success');
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (err: any) {
      this.toast('❌ Error al registrarse: ' + (err?.message ?? 'Desconocido'), 'danger');
    } finally {
      this.loading = false;
    }
  }

  async quickLogin(email: string, password: string) {
    if (this.loading) return;
    this.loading = true;
    try {
      const { data } = await this.supabase.signIn(email, password);
      if (!data?.user) throw new Error('Login fallido');

      // Traer perfil
      const { data: perfil, error: pErr } = await this.supabase
        .getClient()
        .from('usuarios')
        .select('id,nombre,email,rol')
        .eq('id', data.user.id)
        .maybeSingle();
      if (pErr) throw pErr;

      localStorage.setItem('user', JSON.stringify(perfil ?? { id: data.user.id, email: data.user.email }));
      this.router.navigateByUrl('/welcome', { replaceUrl: true });
    } catch (err: any) {
      this.toast('❌ Error en acceso rápido: ' + (err?.message ?? 'Desconocido'), 'danger');
    } finally {
      this.loading = false;
    }
  }
}
