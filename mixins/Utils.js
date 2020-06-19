import jwt from 'jsonwebtoken';
import RibsApi from 'ribs-api';
import ribsFlash from 'ribs-flash-message';
import infos from '~/assets/infos.json';

export default {
  methods: {
    /**
     * method to get jwt
     * @returns {{JsonWebTokenError, TokenExpiredError, sign, verify, decode, NotBeforeError}|*}
     */
    getJwt() {
      if (this.jwt === undefined) {
        this.jwt = jwt;
      }

      return this.jwt;
    },

    /**
     * method to get jwt values
     * @param additionalValues
     * @returns {*|number|PromiseLike<ArrayBuffer>}
     */
    getJwtValues(additionalValues = {}) {
      const values = {
        iat: Math.floor(Date.now() / 1000) - 30,
        token: this.getToken()
      };

      if (Object.keys(additionalValues).length > 0) {
        for (const index in additionalValues) {
          values[index] = additionalValues[index];
        }
      }

      return this.getJwt().sign(values, this.getToken());
    },

    /**
     * method to get Api
     * @returns {RibsApi}
     */
    getApi() {
      if (this.api === undefined) {
        this.api = new RibsApi('your-url', 'external');
      }

      return this.api;
    },

    /**
     * method to get ribs admin api
     * @returns {RibsApi}
     */
    getRibsAdminApi() {
      if (this.ribsAdminApi === undefined) {
        this.ribsAdminApi = new RibsApi('your-url', 'external');
      }

      return this.ribsAdminApi;
    },

    /**
     * metho to get flash message
     * @returns {RibsFlashMessage}
     */
    getFlash() {
      if (this.flash === undefined) {
        this.flash = new ribsFlash();
      }

      return this.flash;
    },

    /**
     * method to get user auth token
     * @returns {any}
     */
    getToken() {
      return localStorage.token;
    },

    /**
     * method to set user auth token
     * @param value
     */
    setToken(value) {
      localStorage.setItem('token', value);
    },

    /**
     * method to update token
     * @param token
     */
    updateTokenIfExist(token) {
      if (token !== '' && token !== undefined) {
        this.setToken(token);
      }
    },

    /**
     * method that return current app version
     * @returns {any}
     */
    getActualVersion() {
      return localStorage.actual_version;
    },

    /**
     * method that define current version
     * @param value
     */
    setActualVersion(value) {
      localStorage.setItem('actual_version', value);
    },

    /**
     * method to test if current version is equal to app_version in config file.
     * if not update app with location.reload
     */
    testUpdateAppVersion() {
      if (process.client) {
        const appVersion = this.getInfos().app_version;
        const actualVersion = this.getActualVersion();
        console.log(appVersion);
        console.log(actualVersion);
        if (appVersion !== actualVersion) {
          this.setActualVersion(appVersion);
          window.location.reload();
        }
      }
    },

    /**
     * method to get json of config and vars
     */
    getInfos() {
      return infos;
    },

    /**
     * method to chane bpody class when open or close popup
     */
    toggleBodyClassForPopup() {
      const body = document.body;
      body.classList.toggle('ribs-popup-body');
    },

    /**
     * method to test if token of user is always valid
     * @param page
     * @returns {boolean}
     */
    testAndUpdateToken(page = null) {
      if (process.client && localStorage.getItem('token') !== null && localStorage.getItem('token') !== '') {
        const jwtInfos = jwt.sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30
        }, this.getToken());

        const context = this;

        this.getRibsAdminApi().post('users/test-token', {'infos': jwtInfos, 'token': this.getToken()}).then((data) => {
          if (data.success === true) {
            this.setToken(data.token);

            if (page === 'login') {
              context.$router.push('/');
            }

            return true;
          } else {
            context.$router.push('/logout');
          }
        }).catch(function () {
          context.$router.push('/logout');
        });

        return true;
      } else if (process.client && page === null && (localStorage.getItem('token') === null || localStorage.getItem('token') === '')) {
        this.$router.push('/logout');
      } else {
        return false;
      }
    },
  }
};
