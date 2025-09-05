import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  // Reactive form
  form = new FormGroup({
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
  loading = false;
  showPassword = false;
  submitted = false;

  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' | 'warning' = 'success';

  constructor(private supabase: SupabaseService, private router: Router) {}

  private toast(msg: string, color: 'success' | 'danger' | 'warning' = 'success') {
    this.toastMessage = msg;
    this.toastColor = color;
    this.showToast = true;
  }

  get f() {
    return this.form.controls;
  }

  showError(ctrl: keyof LoginPage['form']['controls'], key?: string) {
    const c = this.form.get(ctrl as string);
    if (!c) return false;
    const touched = this.submitted || c.touched || c.dirty;
    return key ? (touched && c.hasError(key)) : (touched && c.invalid);
  }

  async ngOnInit() {
    // opcional: comprobar sesión
  }

  async login() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toast('Completá los campos correctamente', 'warning');
      return;
    }

    this.loading = true;
    try {
      const { email, password } = this.form.getRawValue();

      // 1) Autenticación
      const { data, error } = await this.supabase.signIn(email!, password!);
      if (error || !data?.user) throw error || new Error('No se pudo autenticar');

      const user = data.user;

      // 2) Perfil (tabla "usuarios")
      const { data: perfil, error: perfilErr } = await this.supabase
        .getClient()
        .from('usuarios')
        .select('id,nombre,email')
        .eq('id', user.id)
        .maybeSingle();

      if (perfilErr) throw perfilErr;

      const payload = perfil ?? { id: user.id, email: user.email, nombre: 'Usuario' };
      localStorage.setItem('user', JSON.stringify(payload));

      this.toast('¡Bienvenido/a!', 'success');
      this.router.navigateByUrl('/welcome', { replaceUrl: true });
    } catch (err: any) {
      this.toast(err?.message || 'Error al iniciar sesión', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async quickLogin(email: string, password: string) {
    if (this.loading) return;
    this.submitted = true;
    this.form.patchValue({ email, password });
    await this.login();
  }
}
