import { bindable, observable, autoinject } from 'aurelia-framework';

interface DropdownItem {
  text: string;
  children?: DropdownItem[];
}

@autoinject
export class DropdownTree {
  @bindable items: DropdownItem[] = [];
  @observable filter: string = '';
  showList: boolean = false;

  filteredItems: DropdownItem[] = [];
  element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  bind() {
    this.filteredItems = this.items;
  }

  filterChanged(newValue: string) {
    if (!newValue) {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.map(item => ({
        ...item,
        children: item.children?.filter(child => child.text.toLowerCase().includes(newValue.toLowerCase()))
      })).filter(item => item.text.toLowerCase().includes(newValue.toLowerCase()) || (item.children && item.children.length > 0));
    }
  }

  inputFocused() {
    this.showList = true;
  }

  checkFocus(event: Event) {
    if (!this.element.contains(event.target as Node)) {
      this.showList = false;
    }
  }

  selectItem(item: DropdownItem) {
    this.filter = item.text;
    this.showList = false;

    const event = new CustomEvent('value-selected', {
        detail: { value: item },
        bubbles: true
    });
    this.element.dispatchEvent(event);
}

  attached() {
    document.addEventListener('click', (event) => this.checkFocus(event));
  }

  detached() {
    document.removeEventListener('click', (event) => this.checkFocus(event));
  }
}
