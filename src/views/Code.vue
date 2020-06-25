<template>
  <div>
    <Row><p id="title"> 策略名称：{{strategy_name}}</p></Row>
    <Row>
      <Col span="12">
      <CodeMirror :value.sync="code" @resetCode="onResetToTemplate"></CodeMirror> 
      </Col>
      <Col span="12">
        <Console :value.sync="code" :props_strategy_id="strategy_id" />
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
      console.log('strategy_id in code view: ', this.strategy_id);
      // get old code
      this.getCode();
    }
    else {
      // 创建新策略
      this.show_modal = true
    }
  },
  data() {
    return {
      code: "# -*- coding: utf-8 -*-\n# @Author: youerning\n# @Email: 673125641@qq.com\nimport sys\n# print(sys.path)\n# sys.path.append('../')\nsys.path.append('C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest')\n# print(sys.path)\n\"\"\"\n通过蜡烛图吊颈线及RSI超卖买入, 下周一之前卖出\n\n入场点: 吊颈线加RSI < 20\n出场点:\n    止损: 吊颈线最下方\n    止盈: 阻力位或者RSI > 80\n    截至时间: 下周一之前\n\"\"\"\nimport json\nimport os\nimport sys\nimport talib\nfrom os import path\nfrom datetime import datetime\nfrom nobody.utils import load_hist\nfrom nobody.settings import config\nfrom nobody.utils.utils import load_n_hist\nfrom nobody.utils.utils import read_csv\nfrom nobody.backtest import BackTest\nfrom nobody.reporter import Plotter\n\n\nclass MyBackTest(BackTest):\n    def initialize(self):\n        self.info(\"initialize\")\n        self.loss_threshold = 0.03\n        self.porfit_threshold = 0.05\n\n    def on_tick(self, tick):\n        # 周四全部清仓\n        position = self.ctx.broker.position\n        # print('debug position: \\n', position)\n        if tick.weekday() == 3:\n            # for code in position:\n            for code in list(position.keys()):\n                # print('debug code: ', code)\n                try: \n                    self.ctx.broker.sell_all(code)\n                except:\n                    continue\n            return\n\n        if tick.weekday() != 4:\n            for code in position:\n                pass\n\n        # print(self.ctx['tick_data'])\n        # exit()\n        tick_data = self.ctx[\"tick_data\"]\n        if tick_data == {}: \n            return\n        # print('test: \\n',tick_data['000001.SZ'])\n        sh_index_atr5 = tick_data[\"000001.SZ\"][\"atr5\"]\n        sh_index_atr10 = tick_data[\"000001.SZ\"][\"atr10\"]\n        if sh_index_atr5 >= sh_index_atr10:\n            return\n\n        # print(tick_data)\n        # print(tick_data)\n        # print(tick)\n        # if self._first:\n        #     self.ctx.broker.buy(code, hist.close, 100, ttl=5)\n        #     self._first = False\n        for code, hist in tick_data.items():\n            # if self._first:\n            #     self.ctx.broker.sell(code, hist.close, 1000, ttl=5)\n            #     self.ctx.broker.buy(code, hist.close, 100, ttl=5)\n            #     self._first = False\n            if hist[\"ma10\"] > 1.03 * hist[\"ma20\"]:\n                self.ctx.broker.buy(code, 500)\n\n            if hist[\"ma10\"] < 0.98 * hist[\"ma20\"] and code in self.ctx.broker.position:\n                self.ctx.broker.sell(code, 200)\n\n\nif __name__ == '__main__':\n    feed = {}\n\n    # sh_index_path = path.join(config[\"INDEX_DATA_PATH\"], \"000001.SH.csv\")\n    sh_index_path = path.join(config[\"STOCK_DATA_PATH\"], \"000001.SZ.csv\")\n    # sh_index_path = path.join('../data', \"000001.SZ.csv\")\n    sh_index = read_csv(sh_index_path)\n    sh_index[\"atr5\"] = talib.ATR(sh_index.high, sh_index.low, sh_index.close, 5)\n    sh_index[\"atr10\"] = talib.ATR(sh_index.high, sh_index.low, sh_index.close, 10)\n    sh_index[\"ma5\"] = talib.MA(sh_index.close, 5)\n    sh_index[\"ma10\"] = talib.MA(sh_index.close, 10)\n    feed['000001.SZ'] = sh_index\n\n    for code, hist in load_n_hist(10).items():\n        # print(hist)\n        # exit()\n        hist[\"ma10\"] = talib.MA(hist.close, 10)\n        hist[\"ma20\"] = talib.MA(hist.close, 20)\n        hist[\"atr5\"] = talib.ATR(sh_index.high, sh_index.low, sh_index.close, 5)\n        hist[\"atr10\"] = talib.ATR(hist.high, hist.low, hist.close, 10)\n        hist[\"rsi\"] = talib.RSI(hist.close, 10)\n        feed[code] = hist\n\n    # print(datetime.now())\n    # print(len(feed))\n    if not feed:\n        sys.exit(\"没有没有任何历史数据\")\n    mytest = MyBackTest(feed, trade_cal=sh_index.index)\n    mytest.start()\n    order_lst = mytest.ctx.broker.order_hist_lst\n    if not path.exists(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\"):\n        os.mkdir(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\")\n    with open(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\\\\order_hist.json\", \"w\") as wf:\n        json.dump(order_lst, wf, indent=4, default=str)\n    stats = mytest.stat\n    stats.data.to_csv(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\\\\stat.csv\")\n    print(\"策略收益: {:.3f}%\".format(stats.total_returns * 100))\n    print(\"年化收益: {:.3f}% \".format(stats.annual_return * 100))\n    print(\"最大回撤率: {:.3f}% \".format(stats.max_dropdown * 100))\n    print(\"夏普比率: {:.3f}% \".format(stats.sharpe))\n\n    plotter = Plotter(feed, stats, order_lst)\n    plotter.report(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\\\\report.png\")\n",
      template: "# -*- coding: utf-8 -*-\n# @Author: youerning\n# @Email: 673125641@qq.com\nimport sys\n# print(sys.path)\n# sys.path.append('../')\nsys.path.append('C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest')\n# print(sys.path)\n\"\"\"\n通过蜡烛图吊颈线及RSI超卖买入, 下周一之前卖出\n\n入场点: 吊颈线加RSI < 20\n出场点:\n    止损: 吊颈线最下方\n    止盈: 阻力位或者RSI > 80\n    截至时间: 下周一之前\n\"\"\"\nimport json\nimport os\nimport sys\nimport talib\nfrom os import path\nfrom datetime import datetime\nfrom nobody.utils import load_hist\nfrom nobody.settings import config\nfrom nobody.utils.utils import load_n_hist\nfrom nobody.utils.utils import read_csv\nfrom nobody.backtest import BackTest\nfrom nobody.reporter import Plotter\n\n\nclass MyBackTest(BackTest):\n    def initialize(self):\n        self.info(\"initialize\")\n        self.loss_threshold = 0.03\n        self.porfit_threshold = 0.05\n\n    def on_tick(self, tick):\n        # 周四全部清仓\n        position = self.ctx.broker.position\n        # print('debug position: \\n', position)\n        if tick.weekday() == 3:\n            # for code in position:\n            for code in list(position.keys()):\n                # print('debug code: ', code)\n                try: \n                    self.ctx.broker.sell_all(code)\n                except:\n                    continue\n            return\n\n        if tick.weekday() != 4:\n            for code in position:\n                pass\n\n        # print(self.ctx['tick_data'])\n        # exit()\n        tick_data = self.ctx[\"tick_data\"]\n        if tick_data == {}: \n            return\n        # print('test: \\n',tick_data['000001.SZ'])\n        sh_index_atr5 = tick_data[\"000001.SZ\"][\"atr5\"]\n        sh_index_atr10 = tick_data[\"000001.SZ\"][\"atr10\"]\n        if sh_index_atr5 >= sh_index_atr10:\n            return\n\n        # print(tick_data)\n        # print(tick_data)\n        # print(tick)\n        # if self._first:\n        #     self.ctx.broker.buy(code, hist.close, 100, ttl=5)\n        #     self._first = False\n        for code, hist in tick_data.items():\n            # if self._first:\n            #     self.ctx.broker.sell(code, hist.close, 1000, ttl=5)\n            #     self.ctx.broker.buy(code, hist.close, 100, ttl=5)\n            #     self._first = False\n            if hist[\"ma10\"] > 1.03 * hist[\"ma20\"]:\n                self.ctx.broker.buy(code, 500)\n\n            if hist[\"ma10\"] < 0.98 * hist[\"ma20\"] and code in self.ctx.broker.position:\n                self.ctx.broker.sell(code, 200)\n\n\nif __name__ == '__main__':\n    feed = {}\n\n    # sh_index_path = path.join(config[\"INDEX_DATA_PATH\"], \"000001.SH.csv\")\n    sh_index_path = path.join(config[\"STOCK_DATA_PATH\"], \"000001.SZ.csv\")\n    # sh_index_path = path.join('../data', \"000001.SZ.csv\")\n    sh_index = read_csv(sh_index_path)\n    sh_index[\"atr5\"] = talib.ATR(sh_index.high, sh_index.low, sh_index.close, 5)\n    sh_index[\"atr10\"] = talib.ATR(sh_index.high, sh_index.low, sh_index.close, 10)\n    sh_index[\"ma5\"] = talib.MA(sh_index.close, 5)\n    sh_index[\"ma10\"] = talib.MA(sh_index.close, 10)\n    feed['000001.SZ'] = sh_index\n\n    for code, hist in load_n_hist(10).items():\n        # print(hist)\n        # exit()\n        hist[\"ma10\"] = talib.MA(hist.close, 10)\n        hist[\"ma20\"] = talib.MA(hist.close, 20)\n        hist[\"atr5\"] = talib.ATR(sh_index.high, sh_index.low, sh_index.close, 5)\n        hist[\"atr10\"] = talib.ATR(hist.high, hist.low, hist.close, 10)\n        hist[\"rsi\"] = talib.RSI(hist.close, 10)\n        feed[code] = hist\n\n    # print(datetime.now())\n    # print(len(feed))\n    if not feed:\n        sys.exit(\"没有没有任何历史数据\")\n    mytest = MyBackTest(feed, trade_cal=sh_index.index)\n    mytest.start()\n    order_lst = mytest.ctx.broker.order_hist_lst\n    if not path.exists(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\"):\n        os.mkdir(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\")\n    with open(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\\\\order_hist.json\", \"w\") as wf:\n        json.dump(order_lst, wf, indent=4, default=str)\n    stats = mytest.stat\n    stats.data.to_csv(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\\\\stat.csv\")\n    print(\"策略收益: {:.3f}%\".format(stats.total_returns * 100))\n    print(\"年化收益: {:.3f}% \".format(stats.annual_return * 100))\n    print(\"最大回撤率: {:.3f}% \".format(stats.max_dropdown * 100))\n    print(\"夏普比率: {:.3f}% \".format(stats.sharpe))\n\n    plotter = Plotter(feed, stats, order_lst)\n    plotter.report(\"C:\\\\Users\\\\leon\\\\NET_FINAL\\\\strategy_backtest\\\\report\\\\report.png\")\n",
      strategy_id: 0,
      show_modal: false,
      strategy_name: '',
      formItem: {
        strategy_name: ''
      }
    }
  },
  methods: {
    getCode() {
      var params = {
        strategy_id: this.strategy_id,
      }
      this.$axios.post('./api/code', params).then((response) => {
          var res = response.data
          // TODO: save strategy_id
          console.log(res);
          this.code = res.data.code
      }).catch((error) => {
          this.$notify.error({title: '失败', message: '获取策略代码失败，请重试'})
      })
    },
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
      this.strategy_name = this.formItem.strategy_name;
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
    margin: 20px 18px;
}

</style>