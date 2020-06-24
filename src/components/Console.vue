<template>
  <div  style="margin:0px 15px 15px 15px; text-align:left">
      <Card>
        <p slot="title">控制台</p>
        <a href="#" slot="extra" @click="run">
            <Icon type="ios-arrow-dropright-circle"></Icon>
            运行回测
        </a>
        
        <p>
            <Table :columns="columns1" :data="data1">
                <template slot-scope="{ row }" slot="operation">
                    <Button type="primary" size="small" @click="download(row)">详细报告</Button>
                    <Button type="error" size="small" @click="deleteThis(row)">删除</Button>
                </template>
            </Table>
         </p>

        <Progress v-show="show_progress"  :percent="progress" :stroke-width="20" status="active" text-inside />

      </Card>
    
  </div>
</template>

<script>
import {getNowTime} from "../utils/utils"
export default {
  name: 'Console',
   props: {
       props_strategy_id: Number,
      value: {
        type: String,
        defalut: ''
      }
   },
   watch: {
       props_strategy_id(val) {
           this.strategy_id = val;
           console.log('props_update: ', val);
           this.getHistoryData();    // 父组件的strategy_id没传进来之前先不要发送请求
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
        strategy_id: 0,
        websocket: null,
        result: {},
        temp_time: "",
        new_backtest: {},
        progress: 45.23,
        show_progress: false,
        indicator_receive_cnt: 0,
        columns1: [
          {
              title: '回测时间',
              key: 'time',
              width: 150
          },
          {
              title: '收益策略',
              key: 'sy',
              width: 85
          },
          {
              title: '年化收益',
              key: 'nsy',
              width: 85
          },
          {
              title: '最大回撤',
              key: 'hc',
              width: 85
          },
          {
              title: '夏普比率',
              key: 'xp',
              width: 85
          },
/*           {
              title: '手续费率',
              key: 'sx'
          }, */
          {
              title: '操作',
              slot: 'operation',
              
          }
      ],
      data1: [],
        /* data1: [
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
            
        ] */
    }
    
  },
  methods: {
      getHistoryData() {
          
          //while(this.strategy_id == 0) {}    // 父组件的strategy_id没传进来之前先不要发送请求
          console.log(this.strategy_id);
          var params = {
            "user_id": sessionStorage.getItem('user'),
            "strategy_id": this.strategy_id,
          }
         this.$axios.post('./api/history', params).then((response) => {
            var res = response.data.data
            this.data1 = res.history_result
            console.log(res);
        }).catch((error) => {
            this.$message.error("回测失败，请稍后重试")
        })
      },
     download(row) {
         console.log(row.backtest_id);
     },
     deleteThis(row) {
         console.log(row.backtest_id);
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
            this.progress = 0;
            this.show_progress = true;
            this.indicator_receive_cnt = 0;
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
        var message = e.data;
        // etc. progress: 0.8996
        if (message.slice(0, 8) == 'progress') {    // 进度
            this.progress = parseFloat((parseFloat(message.slice(10))*100).toFixed(2))
            if (this.progress == 100.00) {
                this.show_progress = false
            }
        }
        else if (message.slice(0, 4) == '策略收益') {
            this.indicator_receive_cnt++
            this.new_backtest.sy = message.slice(6)

        }
        else if (message.slice(0, 5) == '最大回撤率') {
            this.indicator_receive_cnt++
            this.new_backtest.hc = message.slice(7)
            
        }
        else if (message.slice(0, 4) == '年化收益') {
            this.indicator_receive_cnt++
            this.new_backtest.nsy = message.slice(6)
            
        }
        else if (message.slice(0, 4) == '夏普比率') {
            this.indicator_receive_cnt++
            this.new_backtest.xp = message.slice(6)
            
        }

        

        // 下载链接

        if (this.indicator_receive_cnt==4) {
            this.indicator_receive_cnt = 0
            this.new_backtest.time = this.temp_time
            this.data1.push(this.new_backtest)
            console.log();
            
        }

        if (message.slice(0, 11) == 'backtest_id') {
            this.data1[this.data1.length-1].backtest_id = message.slice(13);
            console.log(this.data1[this.data1.lenght-1]);
        }

        

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
