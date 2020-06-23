<template>
  <div>
    <Row><p id="title"> 策略名称：{{strategy_name}}</p></Row>
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
        title="请输入策略名称"
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
      this.strategy_name = this.$route.params.strategy_name
      console.log(this.strategy_id);
    }
    else {
      // 创建新策略
      this.show_modal = true
    }
  },
  data() {
    return {
      code: 's = input().split()\nprint(int(s[0]) + int(s[1]))',
      template: 's = input().split()\nprint(int(s[0]) + int(s[1]))',
      strategy_id: '',
      show_modal: false,
      strategy_name: '',
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
          this.strategy_id = res.data.strategy_id
          console.log(this.strategy_id);
          this.$Message.info('Clicked ok');
          this.strategy_id = this.formItem.strategy_name
      }).catch((error) => {
          this.$notify.error({title: '失败', message: '出现未知错误，请重试'})
      })
    },
    cancel () {
        this.$Message.info('取消创建，返回策略列表');
         this.$router.push({name: 'MyStrategy'})
    }
  }
}
</script>
<style scoped>


#title {
    text-align: left;
    font-size: 24px;
    font-weight: 400;
    margin: 20px 20px;
}

</style>