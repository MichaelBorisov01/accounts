// store.ts
import {defineStore} from 'pinia';

interface Account {
  label: string | null;
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
  loginError: string | null;
  passwordError: string | null;
  passwordVisible: boolean | null;
}

export const useAccountStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount() {
      this.accounts.push({
        label: null,
        type: 'Локальная',
        login: '',
        password: null,
        loginError: null,
        passwordError: null,
        passwordVisible: false
      });
    },
    removeAccount(index: number) {
      this.accounts.splice(index, 1);
    },
    updateAccount(index: number, account: Account) {
      this.accounts[index] = account;
    },
  },
});
