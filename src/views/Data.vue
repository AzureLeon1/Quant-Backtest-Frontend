<template>
  <div id="Data">
    <p id="title"> 我的回测数据</p>
    <Divider />
    <Button type="primary" icon="md-add" @click="uploadData">上传数据</Button>

    <br><br>

    <Table :columns="columns" :data="table_data">
        <template slot-scope="{ row }" slot="name">
            <a href="#" slot="extra" @click="toStrategy(row)">
            <Icon type="md-document" />
            {{ row.name }}
            </a>   
        </template>
        <template slot-scope="{ row }" slot="operation">
            <Button :disabled="row.data_id==null" type="primary" size="small" @click="download(row)">下载</Button>
            <Button :disabled="row.data_type=='公开数据'" type="error" size="small" @click="deleteThis(row)">删除</Button>
        </template>
    </Table>

    <Modal
        v-model="show_modal"
        title="请输入数据信息"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="uploadParam" :label-width="80">
        <FormItem label="数据名称">
            <Input v-model="uploadParam.data_name" placeholder="请输入数据名称"></Input>
        </FormItem>
        <FormItem label="起始时间">
            <DatePicker format="yyyy-MM" @on-change="uploadParam.start_time=$event" v-model="uploadParam.start_time" type="month" placeholder="选择年月" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
            <DatePicker format="yyyy-MM" @on-change="uploadParam.end_time=$event" v-model="uploadParam.end_time" type="month" placeholder="选择年月" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="选择文件">
            <Upload :on-success="succ" :data="uploadParam" :disabled="uploadParam.data_name=='' || uploadParam.start_time =='' || uploadParam.end_time==''" action="//localhost:44370/api/data/upload">
                <Button icon="ios-cloud-upload-outline">选择CSV文件</Button>
            </Upload>
        </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
  import {getNowTime} from "../utils/utils"

export default {
  name: 'Data',
  components: {
  },
  mounted() {
    this.getData()
  },
  watch: {
/*     uploadData() {
        return 
    }, */
  },
  data() {
    return {
        
        show_modal: false,
        columns: [
            
            {
                title: '数据名称',
                key: 'data_name'
            },
            {
                title: '数据类型',
                key: 'data_type'
            },
            {
                title: '起始时间',
                key: 'start_time'
            },
            {
                title: '终止时间',
                key: 'end_time'
            },
            {
              title: '操作',
              slot: 'operation',
            }
          
        ],
        table_data: [],
        formItem: {
            
        },
        uploadParam: {
            user_id:sessionStorage.getItem("user"),
            data_name: '',
            start_time: '',
            end_time: ''
        },
      
    }
  },
  methods: {
      getData() {
          var params = {
                "user_id": sessionStorage.getItem('user'),
            }
            this.$axios.post('./api/data', params).then((response) => {
                var res = response.data.data
                console.log(res);
                this.table_data = res.datas
                this.table_data.forEach(element => {
                    if (element.data_type == 0) {
                        element.data_type = "公开数据"
                    }
                    else {
                        element.data_type = "私有数据"
                    }
                });
                console.log(this.table_data);
            }).catch((error) => {
                this.$notify.error({title: '失败', message: '出现未知错误，请重试'})
            })
      },
      uploadData() {
          this.show_modal = true;
      },
      ok () {
      /* this.strategy_name = this.formItem.strategy_name;
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
          this.$notify.error({title: '上传失败', message: '出现未知错误，请重试'})
      }) */
    },
    cancel () {
        this.$Message.info('取消上传');
    },
    succ(res) {
        console.log(res);

        var new_data = {
            data_name: this.uploadParam.data_name,
            data_type: '私有数据',
            start_time: this.uploadParam.start_time,
            end_time: this.uploadParam.end_time,
            data_id: res
        }
        this.table_data.push(new_data)

        this.show_modal = false
        this.uploadParam.data_name=''
        this.uploadParam.start_time=''
        this.uploadParam.end_time=''

    },
    download(row) {
         var fileDownload = require('js-file-download')
         console.log(row.data_id);
         var params = {
            "data_id": row.data_id,
          }
        this.$axios.post('./api/data/download', params, {responseType: 'arraybuffer'}).then((response) => {
        //this.$axios.get('./api/report/download', {responseType: 'arraybuffer'}).then((response) => {
            console.log(response);
            //var fileName = row.backtest_id + ".docx"
            var fileName = row.data_name + ".csv"
            console.log(fileName);
            fileDownload(response.data, fileName)
            this.$notify({title: '提示', message: '下载成功', type: 'success'})
            //this.disable = false
        }).catch((error) => {
            this.$message.error("下载失败，请稍后重试")
        })

     },
     deleteThis(row) {
         console.log(row.data_id);
         this.$axios.delete('./api/data/'+row.data_id).then((response) => {
            var res = response.data
            console.log(res);
            if (res.code == 200) {
                this.$message.success("删除成功")
                this.table_data.splice(this.table_data.findIndex(item => item.data_id === row.data_id), 1)
            }

        }).catch((error) => {
            this.$message.error("删除失败，请稍后重试")
        })
     },
    
  }
}
</script>
<style scoped>

#Data {
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
    margin: 20px 20px;
}

</style>