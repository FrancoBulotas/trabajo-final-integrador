import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

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
    await this.initNativeUI();
  }

  async loadUsuarios() {
    const { data, error } = await this.supabaseService.getUsuarios();
    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      this.todos = data;
    }
  }

  private async initNativeUI() {
    if (Capacitor.getPlatform() !== 'web') {
      // que la status bar NO pise el contenido
      await StatusBar.setOverlaysWebView({ overlay: false });
      // fondo claro para la status bar
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      // iconos oscuros (se ven bien sobre fondo claro)
      await StatusBar.setStyle({ style: Style.Dark });
    }
  }
}
