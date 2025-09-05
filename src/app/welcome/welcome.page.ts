import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {
  userName: string | null = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user?.nombre ?? user?.email ?? 'Invitado';
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
