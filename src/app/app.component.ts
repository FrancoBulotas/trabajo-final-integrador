import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent implements OnInit {
  todos: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.supabaseService.checkConnection();
    await this.loadUsuarios();
  }

  async loadUsuarios() {
    const { data, error } = await this.supabaseService.getUsuarios();
    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      this.todos = data;
    }
  }
}
