<template>
    <div>
        <p class="title">欢迎登录量化交易策略研究平台</p>
        <div class="form">
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">登 录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
            }
        }
    },

    methods: {
        submitForm(formName) {
            console.log(this.$refs[formName]);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        "user": this.form.userName,
                        "password": this.form.password,
                    }
                    this.$axios.post('./api/Login', this.param(params)).then((response) => {
                        var res = response.data
                        console.log(response);
                        if (res=="success") {
                            sessionStorage.setItem('user', this.form.userName)
                            //this.$router.push({name: 'Standard'})
                        }
                        else {
                            this.$message.error("密码或用户名错误，请重试")
                        }
                        
                    }).catch((error) => {
                        this.$message.error("密码或用户名错误，请重试")
                    })
                } 
                else {
                    return false
                }
            })
        },

        param(json) {
            return Object.keys(json).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
            }).join('&')
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
        font-size: 40px;
        font-family: 'Times New Roman', Times, serif
    }
</style>
