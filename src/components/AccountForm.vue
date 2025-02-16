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
          v-model="account.label"
          label="Метка"
          :counter="50"
          :error-messages="getErrorMessages(index, 'label')"
          @blur="validateAccount(index)"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="account.type"
          :items="accountTypes"
          label="Тип записи"
          @change="validateAccount(index)"
        />
      </v-col>
      <v-col class="login_field" :cols="account.type === 'Локальная' ? 2 : 4">
        <v-text-field
          v-model="account.login"
          label="Логин"
          :rules="loginRules"
          :counter="100"
          required
          :error-messages="getErrorMessages(index, 'login')"
          @blur="validateAccount(index)"
        />
      </v-col>
      <v-col v-if="account.type === 'Локальная'" cols="2">
        <v-text-field
          v-model="account.password"
          label="Пароль"
          :append-inner-icon="account.passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="togglePasswordVisibility(index)"
          :rules="passwordRules"
          :counter="100"
          required
          :error-messages="getErrorMessages(index, 'password')"
          :type="account.passwordVisible ? 'text' : 'password'"
          @blur="validateAccount(index)"
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

const accountStore = useAccountStore();
const accountTypes = ['LDAP', 'Локальная'];

const visible = ref(false)

type ValidationRule = (value: string) => true | string;

const loginRules: ValidationRule[] = [
  value => {
    if (value) return true;
    return 'Логин обязателен.';
  },
];

const passwordRules: ValidationRule[] = [
  value => {
    if (value) return true;
    return 'Пароль обязателен.';
  },
];

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

const validateAccount = (index: number) => {
  const accountStore = useAccountStore();
  const account = accountStore.accounts[index];
  let hasError = false;

  if (!account.login) {
    hasError = true;
    account.loginError = 'Логин обязателен для заполнения';
  } else {
    account.loginError = '';
  }

  if (account.type === 'Локальная' && !account.password) {
    hasError = true;
    account.passwordError = 'Пароль обязателен для заполнения';
  } else {
    account.passwordError = '';
  }

  if (!hasError) {
    accountStore.updateAccount(index, {
      ...account,
      label: account.label ? account.label.split(';').map(item => ({ text: item.trim() })) : null,
    });
  }
};

const getErrorMessages = (index: number, field: string) => {
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
