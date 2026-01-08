<template>
  <input type="file" ref="fileInput" @change="handleFileChange" />
  <div style="position: relative;width: 100%;height: 100%;">
    <MlCadViewer
      locale="zh"
      :local-file="selectedFileVal"
    />
  </div>
</template>

<script>
import { AcApSettingManager } from '@mlightcad/cad-simple-viewer'
import { MlCadViewer } from '@mlightcad/cad-viewer'

AcApSettingManager.instance.isShowCommandLine = false
AcApSettingManager.instance.isShowToolbar = false
AcApSettingManager.instance.isShowLanguageSelector = false
AcApSettingManager.instance.isShowMainMenu = false
AcApSettingManager.instance.isShowCoordinate = false

export default {
  name: 'App',
  components: {
    MlCadViewer
  },
  props: {
    selectedFile: {
      type: File,
      default: undefined
    }
  },
  data() {
    return {
      selectedFileVal: undefined
    }
  },
  mounted() {
    console.log('selectedFile', this.selectedFile)
    if (this.selectedFile) {
      this.selectedFileVal = this.selectedFile;
    }
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFileVal = file
      }
    }
  }
}

</script>
<style scoped>
  :deep(.ml-status-bar) {
    display: none !important;
  }
</style>

