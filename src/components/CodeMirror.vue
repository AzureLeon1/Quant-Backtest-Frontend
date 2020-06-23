<template>
  <div style="margin: 0px 0px 15px 0px">
    <Row type="flex" justify="space-between" class="header">
      <Col :span=12>
      <div>
        <span>语言:</span>
        <Select :value="language" @on-change="onLangChange" class="adjust">
          <Option v-for="item in languages" :key="item" :value="item">{{item}}
          </Option>
        </Select>

        <Tooltip content="重设返回默认代码设置" placement="top" style="margin-left: 10px">
          <Button icon="md-refresh" @click="onResetClick"></Button>
        </Tooltip>

        <Tooltip content="上传文件" placement="top" style="margin-left: 10px">
          <Button icon="md-cloud-upload" @click="onUploadFile"></Button>
        </Tooltip>

        <input type="file" id="file-uploader" style="display: none" @change="onUploadFileDone">

      </div>
      </Col>
      <Col :span=12>
      <div class="fl-right">
        <span>主题:</span>
        <Select :value="theme" @on-change="onThemeChange" class="adjust">
          <Option v-for="item in themes" :key="item.label" :value="item.value">{{item.label}}
          </Option>
        </Select>
      </div>
      </Col>
    </Row>
    <codemirror style="text-align: left" :value="value" :options="options" @change="onEditorCodeChange" ref="myEditor">

    </codemirror>
  </div>
</template>
<script>
  // import utils from '@/utils/utils'
  import { codemirror } from 'vue-codemirror-lite'

  // theme
  import 'codemirror/theme/monokai.css'
  import 'codemirror/theme/solarized.css'
  import 'codemirror/theme/material.css'

  // mode
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/python/python.js'

  // active-line.js
  import 'codemirror/addon/selection/active-line.js'

  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/indent-fold.js'

  // matchBracket
  import 'codemirror/addon/edit/matchbrackets.js'
  import 'codemirror/addon/edit/closebrackets.js'

  export default {
    name: 'CodeMirror',
    components: {
      codemirror
    },
    props: {
      value: {
        type: String,
        defalut: ''
      }
      /* value: {
        type: String,
        default: 's = input().split()\nprint(int(s[0]) + int(s[1]))'
      },
      languages: {
        type: Array,
        default: () => {
         return ['Python3']
        }
      },
      language: {
        type: String,
        default: 'Python3'
      },
      theme: {
        type: String,
        default: 'material'
      } */
    },
    data () {
      return {
        //value: 's = input().split()\nprint(int(s[0]) + int(s[1]))',
        languages: ['Python3'],
        language: 'Python3',
        theme: 'material',
        
        options: {
          // codemirror options
          tabSize: 4,
          indentUnit: 4,
          mode: 'text/x-python',
          theme: 'material',
          lineNumbers: true,
          line: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          // 代码折叠
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          lineWrapping: true,
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        },
        mode: {
          'Python3': 'text/x-python'
        },
        themes: [
          {label: 'Monokai', value: 'monokai'},
          {label: 'Solarized', value: 'solarized'},
          {label: 'Material', value: 'material'}
        ],
        template: {
          'Python3': 's = input().split()\nprint(int(s[0]) + int(s[1]))'
        }
      }
    },
    mounted () {
      this.editor.setOption('mode', this.mode[this.language])
      this.editor.setOption('theme', 'material')
      // utils.getLanguages().then(languages => {
      //   let mode = {}
      //   languages.forEach(lang => {
      //     mode[lang.name] = lang.content_type
      //   })
      //   this.mode = mode
      //   this.editor.setOption('mode', this.mode[this.language])
      // })

      this.editor.setOption('mode', 'text/x-python')
      this.editor.focus()
    },
    methods: {
      onEditorCodeChange (newCode) {
        //this.value = newCode
        this.$emit('update:value', newCode)
      },
      onLangChange (newVal) {
        this.editor.setOption('mode', this.mode[newVal])
        //this.$emit('changeLang', newVal)
      },
      onThemeChange (newTheme) {
        this.editor.setOption('theme', newTheme)
        //this.$emit('changeTheme', newTheme)
      },
      onResetClick () {
        this.$emit('resetCode')
      },
      onUploadFile () {
        document.getElementById('file-uploader').click()
      },
      onUploadFileDone () {
        let f = document.getElementById('file-uploader').files[0]
        let fileReader = new window.FileReader()
        let self = this
        fileReader.onload = function (e) {
          var text = e.target.result
          self.editor.setValue(text)
          document.getElementById('file-uploader').value = ''
        }
        fileReader.readAsText(f, 'UTF-8')
      }
    },
    computed: {
      editor () {
        // get current editor object
        return this.$refs.myEditor.editor
      }
    },
    watch: {
      'theme' (newVal, oldVal) {
        this.editor.setOption('theme', newVal)
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    margin: 5px 5px 15px 5px;
    .adjust {
      width: 150px;
      margin-left: 10px;
    }
    .fl-right {
      float: right;
    }
  }
</style>

<style>
  .CodeMirror {
    height: auto !important;
    margin-left:20px;
  }
  .CodeMirror-scroll {
    
    min-height: 520px;
    max-height: 1000px;
  }
</style>
