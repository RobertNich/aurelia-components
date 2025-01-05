import { autoinject, bindable, computedFrom, observable } from 'aurelia-framework';

// Just realised <slot> does not work in if.bind or repeat.for :(

@autoinject
export class Datagrid {
  @bindable data: any[] = [];
  @bindable columns: { field: string; label: string }[] = [];
  @bindable itemsPerPage = 10;

  @observable currentPage = 1;
  @observable sortColumn: string | null = null;
  @observable sortDirection: 'asc' | 'desc' | null = null;

  @computedFrom("data", "sortColumns", "currentPage")
  get paginatedData() {
    let sortedData = [...this.data];

    if (this.sortColumn) {
      sortedData.sort((a, b) => {
        const valueA = a[this.sortColumn as keyof typeof a];
        const valueB = b[this.sortColumn as keyof typeof b];

        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return sortedData.slice(start, end);
  }

  @computedFrom("data.length", "itemsPerPage")
  get totalPages() {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  @computedFrom("totalPages")
  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
