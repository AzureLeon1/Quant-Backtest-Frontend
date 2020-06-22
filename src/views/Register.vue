<template>
    <div>
        <p class="title">注册账号</p>
        <div class="form">
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName" />
                </el-form-item>
                <el-form-item label="请输入密码" prop="password">
                    <el-input v-model="form.password" show-password />
                </el-form-item>
                <el-form-item label="请再次输入密码" prop="confirm">
                    <el-input v-model="form.confirm" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">注 册</el-button>
                    <el-button type="primary" @click="back()">返回登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "Register",
    data() {
        var validatePass1 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else if (value.length < 4) {
                callback(new Error('密码长度必须大于4位'))
            } else {
                if (this.form.checkPass !== '') {
                    this.$refs.form.validateField('checkPass')
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            form: {
                userName: '',
                password: '',
                confirm: ''
            },
            rules: {
                userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{validator: validatePass1, trigger: 'blur'}],
                confirm: [{validator: validatePass2, trigger: 'blur'}]
            }
        }
    },

    methods: {
        back() {
            this.$router.push({name: 'Login'})
        },
        submitForm(formName) {
            var params = {
                "user": this.form.userName,
                "password": this.form.password
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post('./api/register', params).then((response) => {
                        var res = response.data
                        switch(res) {
                            case 'userExist':
                                this.$message({
                                    message: '用户名已存在！',
                                    type: 'warning'
                                })
                                break
                            case 'fail':
                                this.$message.error('注册失败，请重试')
                                break
                            default:
                                this.$message({
                                    message: '注册成功！',
                                    type: 'success'
                                })
                        }
                        this.$refs[formName].resetFields()
                    }).catch((error) => {
                        this.$notify.error({title: '失败', message: '出现未知错误，请重试'})
                        this.$refs[formName].resetFields()
                    })
                } else {
                    return false
                }
            });
        }
    }
}
</script>

<style scoped>
    .form {
        width: 500px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 2%
    }

    .title {
        margin-left: auto;
        margin-right: auto;
        margin-top: 10%;
        padding-bottom: 60px;
        font-size: 36px;
        font-family: 'Times New Roman', Times, serif
    }
</style>