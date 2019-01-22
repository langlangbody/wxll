#!/usr/bin/env node

var fs = require('fs')
var moment = require('moment');
var inquirer = require('inquirer');
var path = require('path')
let file = [];
var questions = [{
    type: 'input',
    name: 'author',
    message: "author (创建者)",
    default: function () {
      return '';
    }
  },
  {
    type: 'input',
    name: 'name',
    message: "File name created (创建的文件名)",
    default: function () {
      return 'Index';
    }
  },
  {
    type: 'input',
    name: 'template',
    message: "Clone file name（克隆的文件名）",
    default: function () {
      return 'Template';
    }
  },
  {
    type: 'input',
    name: 'src',
    message: "Generated folder location(生成的文件夹位置)",
    default: function () {
      return 'src/view';
    }
  }
];
/**
 * @name answers
 * @param answers.name  File name created
 * @param answers.template Clone file name
 * @param answers.src Generated folder location
 */
inquirer.prompt(questions).then(answers => {
  fs.readdir(answers.template, function (err, list) {
    if (!list) {
      console.err("读取文件失败")
    } else {
      let config = Object.assign({}, answers)
      config.src = config.src+'/'
      config.fileList = list.map(str => {
        return `${answers.template}/${str}`
      })
      creatCpt(config)
    }
  })
});


let exists = function (config) {
  return new Promise((res, rej) => {
    (async function () {
      for (let a of [config.name]) {
        fs.existsSync(config.src+ a) ? config.src = `${config.src}${a}/` : await mkdir(config, a);
      }
      res(config.src);
    })()
  })
}

// 创建文件夹
let mkdir = function (config, a) {
  return new Promise((res, rej) => {
    fs.mkdir(config.src + a, (err) => {
      if (err) rej(err);
      config.src = `${config.src}${a}/`
      res(config.src);
    });
  })
}

//读取模板文件内容，并替换为目标组件
let readFile = function (config) {
  return new Promise((res) => {
    for (let a of config.fileList) {
      let text = fs.readFileSync(a).toString();
      text = text.replace(/time/g, moment().format('YYYY/MM/DD,hh:mm:ss a'))
        .replace(/xllTemp/g, config.name.toLowerCase())
        .replace(/Xteam/g, config.name)
        .replace(/xll/g, config.author)
      file.push(text)
    }
    res(file);
  })
}


//生成文件，并填入之前读取的文件内容
let writeFile = function (config, file) {

  return new Promise((res, rej) => {
    (async function () {
      let reCaptcha = /\.(js|ts|tsx|vue)$/
      let writes = function () {
        switch (config.fileList.length) {
          case 3:
            return config.fileList.map(function (item) {
              if (reCaptcha.test(item)) {
                let d = item.split('/')
                return d[1]
              } else {
                let d = item.split('.')
                return [`${config.name.toLowerCase()}.${d[1]}`]
              }
            })
            break;
          case 2:
            return config.fileList.map(function (item) {
              if (reCaptcha.test(item)) {
                return item
              } else {
                let d = item.split('.')
                return [`${config.name.toLowerCase()}.${d[1]}`]
              }
            })
            break;
          case 1:
            let d = config.fileList[0].split('.')
            return [`${config.name.toLowerCase()}.${d[1]}`]
            break;
        }
      }
      let files = function (a) {
        switch (config.fileList.length) {
          case 3:
            return a == writes[0] ? file[0] : a == writes[1] ? file[1] : file[2]
            break;
          case 2:
            return a == writes[0] ? file[0] : a == writes[1] ? file[1] : ''
            break;
          case 1:
            return file[0]
            break;
        }
      }
      for (let a of writes()) {
        await fs.writeFile(`${config.src}${a}`,
          files(a),
          (err) => {
            if (err) rej(err)
          })
      }
      res('succ');
    })()
  })
}





async function creatCpt(config) {
  try {
    await exists(config);
    await readFile(config)
    await writeFile(config, await readFile(config));
    return console.log(`Successfully created ${config.name} component`)
  } catch (err) {
    console.error(err);
  }
}