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
    我的策略
    <Row>
      <Col span="12">
      <CodeMirror></CodeMirror> 
      </Col>
      <Col span="12"> </Col>
    </Row>
    
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
