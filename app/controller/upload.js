const Controller = require('egg').Controller;
const fs = require('fs');
const mkdirp = require('mkdirp')
const path = require('path');

class UploadController extends Controller {
    async saveFile() {
        const { ctx } = this
        // 需要前往 config/config.default.js 设置 config.multipart 的 mode 属性为 file
        let file = ctx.request.files[0]
    
        // 声明存放资源的路径
        let uploadDir = ''
        try {
            const f = fs.readFileSync(file.filepath);
            // const dir = path.join(this.config.uploadDir, '2022');
            // console.log(dir)
            // await mkdirp(dir)
            uploadDir = path.join(this.config.uploadDir, file.filename)
            console.log(file, 'egg-upload');
            fs.writeFileSync(uploadDir, f);
        } catch (error) {
            console.log(error, 'file-error')
        }
        
        ctx.body = {
            code: 200,
            msg: '上传成功',
            data: uploadDir.replace(/app/g, ''),
        }
    }
}

module.exports = UploadController