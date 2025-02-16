// store.ts
import {defineStore} from 'pinia';

interface Account {
  label: string | null;
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
  loginError?: string | null;
  passwordError?: string | null;
  labelError?: string | null;
  passwordVisible: boolean | null;
}

export const useAccountStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    loadAccounts() {
      const storedAccounts = localStorage.getItem('accounts');
      if (storedAccounts) {
        this.accounts = JSON.parse(storedAccounts);
      }
    },
    saveAccounts() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts));
    },
    addAccount() {
      this.accounts.push({
        label: null,
        type: 'Локальная',
        login: '',
        password: null,
        passwordVisible: false
      });
      this.saveAccounts();
    },
    removeAccount(index: number) {
      this.accounts.splice(index, 1);
      this.saveAccounts();
    },
    updateAccount(index: number, account: Account) {
      console.log('Updating account at index:', index, 'with data:', account);
      this.accounts[index] = account;
      this.saveAccounts();
    },
  },
});
