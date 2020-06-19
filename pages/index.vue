<template>
  <div>
    <div id="app-version">V {{ actualVersion }}</div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    components: {
    },
    data() {
      return {
        actualVersion: null,
      }
    },
    mixins: [Utils],
    methods: {

    },
    created() {
      this.testAndUpdateToken();
      this.testUpdateAppVersion();

      if (process.client) {
        this.actualVersion = this.getActualVersion();
      }
    }
  }
</script>
