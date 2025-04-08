import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  @Input () progress: number = 0;
  @Input () message: string = '';
  @Input () isLoading: boolean = false;
  @Input () isError: boolean = false;
  @Input () isSuccess: boolean = false;
  @Input () isWarning: boolean = false;

}
