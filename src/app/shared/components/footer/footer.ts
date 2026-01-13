import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

  currentYear: number = new Date().getFullYear();

  metodosPago=[
    { 
      name: 'Diners Club', 
      icon: 'assets/Payment/plin.png'
    },
    { 
      name: 'American Express', 
      icon: 'assets/Payment/masterCard.png'
    },
    { 
      name: 'Mastercard', 
      icon: 'assets/Payment/yape.png'
    },
    { 
      name: 'Visa', 
      icon: 'assets/Payment/visa.png'
    }
  ]

  redesSociales = [
  { name: 'Facebook', icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/ingenieriaglobalperu/' },
  { name: 'Instagram', icon: 'fab fa-instagram', href: 'https://www.instagram.com/ingenieriaglobal_grupoig/?hl=es-la' },
  { name: 'LinkedIn', icon: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/company/ingenieria-global-grupo-ig?originalSubdomain=pe' },
  { name: 'Twitter', icon: 'fab fa-x-twitter', href: '' },
  { name: 'YouTube', icon: 'fab fa-youtube', href: '' }
  ];

}
