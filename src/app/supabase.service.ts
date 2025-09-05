import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async checkConnection() {
    const { data, error } = await this.supabase.from('usuarios').select('*').limit(1);
    if (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
      return false;
    }
    console.log('✅ Conexión correcta a Supabase. Ejemplo de dato:', data);
    return true;
  }

  getClient() {
    return this.supabase;
  }
  // --- Auth ---
  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  getUser() {
    return this.supabase.auth.getUser();
  }

  // --- Ejemplo de consulta (ajustá a tu tabla real) ---
  getUsuarios() {
    return this.supabase.from('usuarios').select('*');
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data; // devuelve user + session (si no está habilitada la confirmación por email)
  }

  async createProfile(userId: string, fullName: string, email: string) {
    const { error } = await this.supabase.from('usuarios').insert({
      id: userId,
      nombre: fullName,
      email: email
    });

    if (error) throw error;
  }
}
