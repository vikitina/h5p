<template>
  <div>
    <h5p-editor 
      id="editor"
      v-bind:content-id = "contentId"
    ></h5p-editor>
  </div>
 
</template>

<script lang="ts">
  import { H5PPlayerComponent, H5PEditorComponent } from '@lumieducation/h5p-webcomponents';
  import { ContentService, IContentListEntry, IContentService } from '../services/ContentService';

  window.customElements.define('h5p-editor', H5PEditorComponent);


  const contentService = new ContentService('/h5p');
 export default{

   data(){
     return{
       contentId: 'new'
     }
   },

   mounted(){
     console.log('here');
     //const cID = '3355505403';
     const cID = undefined;
     //const cID = this.contentId;
     const model = async () => await contentService.getEdit();
     const editor = (document.querySelector("#editor") as any)!;
     editor.loadContentCallback = model ;
     editor.saveContentCallback = model ;

   },
   props: ['loadContentCallback'],


 }
  
</script>

<style>
.h5p-hub .h5p-hub-client-drop-down .h5p-hub-selected {
    color: red;
}
</style>

       //contentId: '3355505403'