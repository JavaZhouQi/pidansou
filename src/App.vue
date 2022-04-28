<template>
  <router-view/>
</template>

<script>
export default {
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
};
</script>

<style>

</style>
