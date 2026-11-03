import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { ToastContainer } from '../../shared/components/toast-container/toast-container';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    Header,
    Footer,
    ToastContainer
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})

export class PublicLayout { }