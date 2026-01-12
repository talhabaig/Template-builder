<template>
  <div class="home">
    <TemplateEditor />
  </div>
</template>

<script>
import TemplateEditor from '@/components/editor/TemplateEditor.vue'

export default {
  name: 'HomeView',
  components: {
    TemplateEditor
  }
}
</script>

<style scoped>
.home {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
