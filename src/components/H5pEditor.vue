<template>
  <div>
    <button
      @click = "saveContent"
    >Save content</button>
    <h5p-editor 
      id="editor"
      ref = "editor"
      v-bind:content-id = "contentId"
    ></h5p-editor>
  </div>
 
</template>

<script lang="ts">
  import { H5PPlayerComponent, H5PEditorComponent } from '@lumieducation/h5p-webcomponents';
  import { ContentService, IContentListEntry, IContentService } from '../services/ContentService';

  window.customElements.define('h5p-editor', H5PEditorComponent);
  let editor: any = null;

  const contentService = new ContentService('/h5p');
 export default{

   data(){
     return{
      contentId: 'new'
      //contentId: '2263888188',

     }
   },

   mounted(){
     console.log('here');
     const cID = '2263888188';
     //const cID = undefined;
     //const cID = this.contentId;
     const modelLoad = async () => await contentService.getEdit();
    //  const modelSave = async () => await (contentService as any).save();
     editor = (document.querySelector("#editor") as any)!;
     editor.loadContentCallback = modelLoad ;
    //  editor.saveContentCallback = modelSave ;


   },
    methods: {
      async saveContent () {
        // const modelSave = async () => await (contentService as any).save();
        editor.saveContentCallback = this.saveContentCallbackWrapper ;

      try {
        return await editor.save(undefined);
      } catch(err) {
        console.log('error --- ', err);
      };
    },

      saveContentCallbackWrapper (
        contentId: string,
        requestBody: {
          library: string;
          params: any;
        }
        ): Promise<{
          contentId: string;
          metadata: any;
        }> {
          return (contentService as any).save(contentId, requestBody);
      }
    }
 }
</script>

<style>
.h5p-hub .h5p-hub-client-drop-down .h5p-hub-selected {
    color: red;
}
</style>

       //contentId: '3355505403'