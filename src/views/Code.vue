<template>
  <div>
    我的策略
    <Row>
      <Col span="12">
      <CodeMirror :value.sync="code" @resetCode="onResetToTemplate"></CodeMirror> 
      </Col>
      <Col span="12">
        <Console :value.sync="code" />
      </Col>
    </Row>

    
  </div>
</template>

<script>
  import CodeMirror from '@/components/CodeMirror.vue'
  import Console from '@/components/Console.vue'

export default {
  name: 'Code',
  components: {
    CodeMirror,
    Console
  },
  data() {
    return {
      code: 's = input().split()\nprint(int(s[0]) + int(s[1]))',
      template: 's = input().split()\nprint(int(s[0]) + int(s[1]))'
    }
  },
  methods: {
    updateValue(value) {
      console.log(value);
      this.code = value
    },
    onResetToTemplate() {
      this.$Modal.confirm({
          content: '确定要重置代码吗？',
          onOk: () => {
         this.code = this.template
        }
      })
    }
  }
}
</script>
