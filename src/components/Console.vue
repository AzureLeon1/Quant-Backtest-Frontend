<template>
  <div  style="margin:0px 15px 15px 15px; text-align:left">
      <Card>
        <p slot="title">控制台</p>
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
import {getNowTime} from "../utils/utils"
export default {
  name: 'Console',
   props: {
      value: {
        type: String,
        defalut: ''
      },
      strategy_id: {
          default: null
      }
   },
   mounted() {
       console.log(this.strategy_id);
       // TODO: 请求回测数据
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
                backtest_id: '13579',
                time: '2020-06-23 07:55:43',
                sy: '-7.45%',
                nsy: '-1.014%',
                hc: '17.89%',
                xp: '-4.17%',
                sx: '-96.22%'
            },
            {
                backtest_id: '02468',
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
         var params = {
            "user_id": sessionStorage.getItem('user'),
            "strategy_id": this.strategy_id,
            "code": this.value,
            "time": getNowTime(),
            "data_id": 1   // TODO: fix
        }
        this.$axios.post('./api/backtest', params).then((response) => {
            var res = response.data
            console.log(response);
            
            
        }).catch((error) => {
            this.$message.error("回测失败，请稍后重试")
        })
     }
    }
}
</script>


<style scoped>

</style>
