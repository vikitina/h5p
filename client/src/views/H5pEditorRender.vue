<template>
  <div>
    <div>{{ file }}</div>
    <h5p-editor
      id="editor"
      ref = "editor"
    ></h5p-editor>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { H5PEditorComponent } from '@lumieducation/h5p-webcomponents'
import { ContentService, IContentListEntry, IContentService } from '../services/ContentService'

window.customElements.define('h5p-editor', H5PEditorComponent)
const contentService = new ContentService('/h5p')

@Component({
  components: {}
  // ,
  // beforeRouteEnter (to, from, next) {
  //   file = to.params.fileName
  //   next()
  // }
})

export default class H5pEditorRender extends Vue {
  private file = ''

  async mounted () {
    this.file = 'https://mundo-sodix-dev.fwu.de/api/mundo/download/SODIX-0001031560'
    // this.file = 'https://admintool-sodix-dev.fwu.de/api/content/data/SODIX-0001031560.h5p'
    const response = await contentService.upload(this.file) as any
    const modelLoad = () => response.model
    const editor = (document.querySelector('#editor') as any)!
    editor.setAttribute('content-id', response.contentId)
    editor.loadContentCallback = modelLoad
  }
}
</script>
