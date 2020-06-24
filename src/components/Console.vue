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
   created() {
      // this.initWebSocket();
   },
   mounted() {
       console.log(this.strategy_id);
       // TODO: 请求回测数据
   },
   destroyed() {
      //this.websock.close() //离开路由之后断开websocket连接
    },
  data () {
    return {
        websocket: null,
        result: {},
        temp_time: "",
        new_backtest: {},
        progress: null,
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
/*           {
              title: '手续费率',
              key: 'sx'
          }, */
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
         /* console.log('run!');
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
        }) */


        // 先把code用http请求发送过去，然后再用websocket进行回测
         console.log('run!');
         console.log(this.value);
         this.temp_time = getNowTime()
         var params = {
            "user_id": sessionStorage.getItem('user'),
            "strategy_id": this.strategy_id,
            "code": this.value,
            "time": this.temp_time,
            "data_id": 1   // TODO: fix
        }
        this.$axios.post('./api/backtest', params).then((response) => {
            var res = response.data
            console.log(res);
            this.new_backtest = {};
            this.initWebSocket();
        }).catch((error) => {
            this.$message.error("回测失败，请稍后重试")
        }) 
        
     },
     initWebSocket(){ //初始化weosocket
        //const wsuri = "ws://localhost/api/wsbacktest?nickName=" + "leon";
        //this.temp_time = getNowTime()
        var user_id = sessionStorage.getItem("user");
        const wsuri = "ws://localhost:44370/api/wsbacktest?&strategy_id=" + this.strategy_id + "&time=" + this.temp_time + "&user_id=" + user_id;
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
     },
      websocketonopen(){ //连接建立之后执行send方法发送数据
/*         let actions = {"test":"12345"};
        this.websocketsend(JSON.stringify(actions)); */
        console.log("opened");
      },
      websocketonerror(){//连接建立失败重连
      console.log("error");
        this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
      console.log(e.data);
      //console.log(JSON.parse(e.data));
        //this.result = JSON.parse(e.data);
        //this.result.time = this.temp_time
        //this.data1.push(this.result)
        console.log("message");
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
    }
}
</script>


<style scoped>

</style>
