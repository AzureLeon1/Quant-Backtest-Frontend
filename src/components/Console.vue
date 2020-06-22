<template>
  <div  style="margin: 50px 15px 15px 15px; text-align:left">
      <Card>
        <p slot="title">Console </p>
        <a href="#" slot="extra" @click="run">
            <Icon type="ios-arrow-dropright-circle"></Icon>
            编译运行
        </a>
        
        <p>
            <Table :columns="columns1" :data="data1">
                <template slot-scope="{ row }" slot="report">
                    <Button type="primary" size="small" @click="download(row)">下载</Button>
                </template>
            </Table>
         </p>
      </Card>
    
  </div>
</template>

<script>
export default {
  name: 'Console',
   props: {
      value: {
        type: String,
        defalut: ''
      }
   },
  data () {
    return {
      columns1: [
          {
              title: '回测时间',
              key: 'time',
              width: 150
          },
          {
              title: '收益策略',
              key: 'sy'
          },
          {
              title: '年化收益',
              key: 'nsy'
          },
          {
              title: '最大回撤',
              key: 'hc'
          },
          {
              title: '夏普比率',
              key: 'xp',
          },
          {
              title: '手续费率',
              key: 'sx'
          },
          {
              title: '详细报告',
              slot: 'report'
          }
      ],
        data1: [
            {
                strategy_id: '13579',
                time: '2020-06-23 07:55:43',
                sy: '-7.45%',
                nsy: '-1.014%',
                hc: '17.89%',
                xp: '-4.17%',
                sx: '-96.22%'
            },
            {
                strategy_id: '02468',
                time: '2020-06-23 07:55:43',
                sy: '-7.45%',
                nsy: '-1.014%',
                hc: '17.89%',
                xp: '-4.17%',
                sx: '-96.22%'
            },
            
        ]
    }
    
  },
  methods: {
     download(row) {
         console.log(row.strategy_id);
     },
     run() {
         console.log('run!');
         console.log(this.value);
     }
    }
}
</script>


<style scoped>

</style>
