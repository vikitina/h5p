<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <H5pEditor 
      />
  </div>
</template>

<script lang="ts">
import {  Vue } from 'vue-property-decorator';
import H5pEditor from './components/H5pEditor.vue';



export default {
  name: 'App',
  data(){
    return{
    
    }
  },
  components: {
    H5pEditor
  }

}
</script>

<style>

</style>
