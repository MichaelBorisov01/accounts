<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="account-title">
          Учетные записи
        </h1>
        <v-btn @click="addAccount">
          +
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      v-for="(account, index) in accounts"
      :key="index"
      class="account-row"
    >
      <v-col>
        <v-text-field
          v-model="formattedLabels[index]"
          label="Метка"
          :counter="50"
          :error-messages="getErrorMessages(index, 'label')"
          @blur="updateAccount(index, account)"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="account.type"
          :items="accountTypes"
          label="Тип записи"
          @update:menu="updateAccount(index, account)"
        />
      </v-col>
      <v-col
        class="login_field"
        :cols="account.type === 'Локальная' ? 2 : 4"
      >
        <v-text-field
          v-model="account.login"
          label="Логин"
          :counter="100"
          :error-messages="getErrorMessages(index, 'login')"
          @blur="validateLogin(index)"
        />
      </v-col>
      <v-col
        v-if="account.type === 'Локальная'"
        cols="2"
      >
        <v-text-field
          v-model="account.password"
          label="Пароль"
          :append-inner-icon="account.passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :counter="100"
          :error-messages="getErrorMessages(index, 'password')"
          :type="account.passwordVisible ? 'text' : 'password'"
          @click:append-inner="togglePasswordVisibility(index)"
          @blur="validatePassword(index)"
        />
      </v-col>
      <v-col>
        <v-btn
          icon
          @click="removeAccount(index)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup lang="ts">
import {computed} from 'vue';
import {useAccountStore} from '@/stores/accounts';

let accountStore = useAccountStore();
const accountTypes = ['LDAP', 'Локальная'];

const addAccount = () => {
  accountStore.addAccount();
  const newAccount = accountStore.accounts[accountStore.accounts.length - 1];
  newAccount.passwordVisible = false;
};

const removeAccount = (index: number) => {
  accountStore.removeAccount(index);
};

const togglePasswordVisibility = (index: number) => {
  const account = accountStore.accounts[index];
  account.passwordVisible = !account.passwordVisible;
};


const validateLogin = (index: number) => {
  const accountStore = useAccountStore();
  const account = accountStore.accounts[index];

  account.loginError = '';

  if (!account.login) {
    account.loginError = 'Логин обязателен для заполнения';
  }

  if (!account.loginError) {
    updateAccount(index, account);
  }
};

const validatePassword = (index: number) => {
  const accountStore = useAccountStore();
  const account = accountStore.accounts[index];

  account.passwordError = '';

  if (account.type === 'Локальная' && !account.password) {
    account.passwordError = 'Пароль обязателен для заполнения';
  }
  if (!account.passwordError) {
    updateAccount(index, account);
  }
};

const updateAccount = (index: number, account: any) => {
  console.log('updateAccount');

  const updatedLabel = formattedLabels.value[index]
    ? formattedLabels.value[index].split(';').map(item => ({ text: item.trim() }))
    : null;

  accountStore.updateAccount(index, {
    ...account,
    label: updatedLabel,
    type: account.type,
  });
};

const formattedLabels = computed(() => {
  return accounts.value.map(account => {
    if (Array.isArray(account.label)) {
      return account.label.map(item => item.text).join('; ');
    }
    return account.label || '';
  });
});

const getErrorMessages = (index: number, field: string) => {
  const account = accountStore.accounts[index];
  if (field === 'login') {
    return account.loginError ? [account.loginError] : [];
  }
  if (field === 'password') {
    return account.passwordError ? [account.passwordError] : [];
  }
  return [];
};

const accounts = computed(() => accountStore.accounts);
</script>

<style scoped>
.account-row {
  display: flex;
}

.account-title {
  display: inline;
  margin-right: 15px;
}

.login_field {
  flex-grow: 1;
}
</style>
