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

    <Modal
        v-model="show_modal"
        title="Common Modal dialog box title"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="formItem" :label-width="80">
        <FormItem label="策略名称">
            <Input v-model="formItem.strategy_name" placeholder="请输入策略名称"></Input>
        </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
  import CodeMirror from '@/components/CodeMirror.vue'
  import Console from '@/components/Console.vue'
  import {getNowTime} from "../utils/utils"

export default {
  name: 'Code',
  components: {
    CodeMirror,
    Console
  },
  mounted() {
    if (this.$route.params.type == 'old') {
      this.strategy_id = this.$route.params.strategy_id
      console.log(this.strategy_id);
    }
    else {
      // 创建新策略
      this.show_modal = true
      var params = {
        user_id: sessionStorage.getItem('user'),
        strategy_name: this.formItem.strategy_name,
        create_time: getNowTime(),
        // strategy code is empty
      }
      this.$axios.post('./api/strategy', params).then((response) => {
          var res = response.data
          // TODO: save strategy_id
          console.log(res);
      }).catch((error) => {
          this.$notify.error({title: '失败', message: '出现未知错误，请重试'})
      })
    }
  },
  data() {
    return {
      code: 's = input().split()\nprint(int(s[0]) + int(s[1]))',
      template: 's = input().split()\nprint(int(s[0]) + int(s[1]))',
      strategy_id: '',
      show_modal: false,
      formItem: {
        strategy_name: ''
      }
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
    },
    ok () {
        
        this.$Message.info('Clicked ok');
    },
    cancel () {
        this.$Message.info('取消创建，返回策略列表');
         this.$router.push({name: 'MyStrategy'})
    }
  }
}
</script>
