const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

const transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.qq.com', // 服务 由于我用的163邮箱
    port: 465, // smtp端口 默认无需改动
    secure: true,
    auth: {
      user: 'xxxxxx@qq.com', // 用户名
      pass: 'xxxxxx' // SMTP授权码
    }
}));

const randomFns=()=> { // 生成6位随机数
    let code = ""
    for(let i= 0;i<6;i++){
        code += parseInt(Math.random()*10)
    }
    return code 
}

var code_dict = {}

module.exports = {
    transport,
    randomFns,
    code_dict
};
