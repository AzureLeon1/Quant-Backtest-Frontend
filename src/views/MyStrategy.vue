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
    </Table>
  </div>
</template>

<script>
export default {
  name: 'MyStrategy',
  components: {

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
                key: 'modify_time'
            },
            {
                title: '历史回测次数',
                key: 'times'
            }
        ],
        table_data: [
            {
                strategy_id: 1,
                name: '小市值策略',
                create_time: '2020-06-02 16:35:22',
                modify_time: '2020-06-03 13:55:11',
                times: 3
            },
            {
                strategy_id: 2,
                name: '双均线策略',
                create_time: '2020-06-02 16:35:22',
                modify_time: '2020-06-03 13:55:11',
                times: 2
            },
            {
                strategy_id: 3,
                name: '银行股轮动策略',
                create_time: '2020-06-02 16:35:22',
                modify_time: '2020-06-03 13:55:11',
                times: 1
            },
            {
                strategy_id: 4,
                name: '低价估值选股策略',
                create_time: '2020-06-02 16:35:22',
                modify_time: '2020-06-03 13:55:11',
                times: 5
            },
        ]

    }
  },
  methods: {
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
      }

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
    font-size: 18px;
    font-weight: 400;
}

</style>