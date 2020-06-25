<template>
  <div id="MyStrategy" >
    <p id="title"> 我的策略列表</p>
    <Divider />
    <Button type="primary" icon="md-add" @click="createStrategy">新建策略</Button>

    <br><br>

    <Table :columns="columns" :data="table_data">
        <template slot-scope="{ row }" slot="name">
            <a href="#" slot="extra" @click="toStrategy(row)">
            <Icon type="md-document" />
            {{ row.name }}
            </a>
            
        </template>
        <template slot-scope="{ row }" slot="operation">
                    <Button type="error" size="small" @click="deleteThis(row)">删除</Button>
                </template>
    </Table>
  </div>
</template>

<script>
export default {
  name: 'MyStrategy',
  components: {

  },
  mounted() {
      this.getData();
  },
  data() {
    return {
        columns: [
            
            {
                title: '名称',
                slot: 'name'
            },
            {
                title: '创建时间',
                key: 'create_time'
            },
            {
                title: '最后修改时间',
                key: 'last_modify_time'
            },
            {
                title: '历史回测次数',
                key: 'times'
            },
            {
              title: '操作',
              slot: 'operation',
            }
          
        ],
        table_data: [],
        /* table_data: [
            {
                strategy_id: 1,
                name: '小市值策略',
                create_time: '2020-06-02 16:35:22',
                last_modify_time: '2020-06-03 13:55:11',
                times: 3
            },
            {
                strategy_id: 2,
                name: '双均线策略',
                create_time: '2020-06-02 16:35:22',
                last_modify_time: '2020-06-03 13:55:11',
                times: 2
            },
            {
                strategy_id: 3,
                name: '银行股轮动策略',
                create_time: '2020-06-02 16:35:22',
                last_modify_time: '2020-06-03 13:55:11',
                times: 1
            },
            {
                strategy_id: 4,
                name: '低价估值选股策略',
                create_time: '2020-06-02 16:35:22',
                last_modify_time: '2020-06-03 13:55:11',
                times: 5
            },
        ] */

    }
  },
  methods: {
      getData() {
          var params = {
                "user_id": sessionStorage.getItem('user'),
            }
            this.$axios.post('./api/all_strategy', params).then((response) => {
                        var res = response.data.data
                        console.log(res);
                        this.table_data = res.strategys
                        console.log(this.table_data);
                    }).catch((error) => {
                        this.$notify.error({title: '失败', message: '出现未知错误，请重试'})
                    })
      },
      createStrategy() {
          var params = {
              type: 'new',
          }
          this.$router.push({name: 'Code', params: params})
      },
      toStrategy(row) {
          var params = {
              type: 'old',
              strategy_id: row.strategy_id,
              strategy_name: row.name
          }
          this.$router.push({name: 'Code', params: params})
      },
      deleteThis(row) {
         console.log(row.strategy_id);
         this.$Modal.confirm({
            title: "确认删除",
            content: "即将删除该策略及其全部相关回测记录",
            onOk: () => {
                this.$axios.delete('./api/strategy/'+row.strategy_id).then((response) => {
                    var res = response.data
                    console.log(res);
                    if (res.code == 200) {
                        this.$message.success("删除成功")
                        this.table_data.splice(this.table_data.findIndex(item => item.strategy_id === row.strategy_id), 1)
                    }

                }).catch((error) => {
                    this.$message.error("删除失败，请稍后重试")
                })
            },
            onCancel: () => {
                this.$Message.info('取消')
            }
        });
         
     },

  },
  computed: {

  }
}
</script>

<style>
#MyStrategy {
    width: 60%;
    justify-items: center;
    display:block;
    margin:30px auto;
    text-align: left;
}

#title {
    text-align: left;
    font-size: 24px;
    font-weight: 400;
    margin: 20px 18px;
}

</style>