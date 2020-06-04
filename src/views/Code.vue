<template>
  <div>
    <!-- <CodeMirror :value.sync="code"
      :languages="problem.languages"
      :language="language"
      :theme="theme"
      @resetCode="onResetToTemplate"
      @changeTheme="onChangeTheme"
      @changeLang="onChangeLang">
    </CodeMirror> -->
    test
    <CodeMirror></CodeMirror>
  </div>
</template>

<script>
  import CodeMirror from '@/components/CodeMirror.vue'

export default {
  name: 'Code',
  components: {
    CodeMirror
  }
}
</script>
