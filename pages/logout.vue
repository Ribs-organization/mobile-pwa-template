<template>
    <div>

    </div>
</template>

<script>
  export default {
    created() {
      this.$router.push('/login');
    },
    mounted() {
      localStorage.removeItem('token');
    }
  }
</script>
