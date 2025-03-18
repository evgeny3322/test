import { defineStore } from 'pinia';

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    activeDropdownId: null as string | null,
  }),

  actions: {
    openDropdown(id: string) {
      this.activeDropdownId = id;
    },

    closeDropdown() {
      this.activeDropdownId = null;
    },

    toggleDropdown(id: string) {
      if (this.activeDropdownId === id) {
        this.closeDropdown();
      } else {
        this.openDropdown(id);
      }
    },

    isDropdownOpen(id: string): boolean {
      return this.activeDropdownId === id;
    },
  },
});
