import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../menu';

type Language = 'ar' | 'en' | 'de';
type ItemField = 'name' | 'description' | 'category';

@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.css']
})
export class MenuCardComponent {
  @Input() item!: MenuItem;
  @Input() language: Language = 'ar';
  @Output() itemClick = new EventEmitter<MenuItem>();

  itemField(field: ItemField): string {
    const key = `${field}_${this.language}` as keyof MenuItem;
    return this.item[key] || this.item[`${field}_ar` as keyof MenuItem] || '';
  }

  get name(): string {
    return this.itemField('name');
  }

  get description(): string {
    return this.itemField('description');
  }

  get category(): string {
    return this.itemField('category');
  }

  onCardClick(): void {
    this.itemClick.emit(this.item);
  }

  onKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      this.onCardClick();
    }
  }
}