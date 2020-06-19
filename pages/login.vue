<template>
    <div class="login">
        <div  v-bind:class="{active: loading}">
            <div class="loading">
                Chargement...
            </div>
        </div>

        <div v-bind:class="{active: !loading, 'login-form': !loading}" id="login-form">
            <form action="" class="ribs-form">
                <img src="~/assets/images/ribs.png" alt="">
                <h1 class="mb2">App name</h1>

                <div class="ribs-container-fluid">
                    <div class="form-group">
                        <label>Pseudo</label>
                        <input type="text" name="pseudo" class="form-control" v-model="pseudo">
                    </div>

                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" name="password" class="form-control" v-model="password">
                    </div>

                    <button type="submit" class="ribs-button" v-on:click.stop.prevent="submit">Connexion</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    layout: 'login',
    mixins: [Utils],
    data() {
      return {
        pseudo: null,
        password: null,
        loading: true,
      }
    },
    methods: {
      /**
       * method to submit login form
       * @returns {Q.Promise<unknown>}
       */
      submit() {
        return this.getRibsAdminApi().post('users/authenticate', {
          'username': this.pseudo,
          'password': this.password
        })
        .then((data) => {
          if (data.success === true) {
            this.setToken(data.token);

            this.$router.push('/');
            return;
          } else {
            this.getFlash().append(data.error_message, 'error');
            return;
          }
        })
        .catch(() => {
          this.getFlash().append('Une erreur est survenue. Merci de réessayer dans un instant', 'error');
          return;
        });
      },
    },
    mounted() {
      const testToken = this.testAndUpdateToken('login');
      if (!testToken) {
        this.loading = false;
      }
    },
    created() {
      this.testUpdateAppVersion();
    }
  }
</script>
