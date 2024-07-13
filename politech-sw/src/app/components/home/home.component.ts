import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentSlide = 0;

  nextSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    this.currentSlide = (this.currentSlide + 1) % slides.length;
    this.updateSlidePosition();
  }

  prevSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;
    this.updateSlidePosition();
  }

  updateSlidePosition() {
    const slides = document.querySelectorAll('.carousel-item');
    slides.forEach((slide, index) => {
      (slide as HTMLElement).style.transform = `translateX(-${this.currentSlide * 100}%)`;
    });
  }
}

