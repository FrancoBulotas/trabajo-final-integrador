
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  loading = false;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    // Si ya hay sesión, entrar directo a /tabs
    const { data } = await this.supabase.getUser();
    if (data.user) {
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
  }

  async login() {
    this.loading = true;
    try {
      await this.supabase.signIn(this.email, this.password);
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (err: any) {
      alert(err.message || 'Error al iniciar sesión');
    } finally {
      this.loading = false;
    }
  }
}
