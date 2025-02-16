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
      <v-col>
        <v-text-field
          v-model="account.login"
          label="Логин"
          :error-messages="getErrorMessages(index, 'login')"
          @blur="validateAccount(index)"
        />
      </v-col>
      <v-col v-if="account.type === 'Локальная'">
        <v-text-field
          v-model="account.password"
          label="Пароль"
          :error-messages="getErrorMessages(index, 'password')"
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

const addAccount = () => {
  accountStore.addAccount();
};

const removeAccount = (index: number) => {
  accountStore.removeAccount(index);
};

const validateAccount = (index: number) => {
  const account = accountStore.accounts[index];
};

const getErrorMessages = (index: number, field: string) => {
  return [];
};

const accounts = computed(() => accountStore.accounts);
</script>

<style scoped>
.account-row {
  display: flex;
  align-items: center;
}

.account-title {
  display: inline;
  margin-right: 15px;
}
</style>
