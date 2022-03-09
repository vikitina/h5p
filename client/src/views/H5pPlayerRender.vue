<template>
  <div>
    <div>{{ file }}</div>
    <h5p-player
      id="player"
      ref = "player"
    ></h5p-player>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { H5PPlayerComponent } from '@lumieducation/h5p-webcomponents'
import { ContentService, IContentListEntry, IContentService } from '../services/ContentService'

window.customElements.define('h5p-player', H5PPlayerComponent)
const contentService = new ContentService('/h5p')

@Component({
  components: {}
  // ,
  // beforeRouteEnter (to, from, next) {
  //   file = to.params.fileName
  //   next()
  // }
})

export default class H5pPlayerRender extends Vue {
  private file = ''

  async mounted () {
    this.file = 'https://mundo-sodix-dev.fwu.de/api/mundo/download/SODIX-0001031560'
    // this.file = 'https://admintool-sodix-dev.fwu.de/api/content/data/SODIX-0001031560.h5p'
    const response = await contentService.play(this.file) as any
    const modelLoad = () => response.model
    const player = (document.querySelector('#player') as any)!
    player.setAttribute('content-id', response.contentId)
    player.loadContentCallback = modelLoad
  }
}
</script>
