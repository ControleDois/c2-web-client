import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  constructor(public loadingService: LoadingService) {}
}
