/*
 * @Author: jyt yutao.jiang@hand-china.com
 * @Date: 2025-12-30 13:03:39
 * @LastEditors: jyt yutao.jiang@hand-china.com
 * @LastEditTime: 2025-12-30 13:03:50
 * @FilePath: \cad-viewer-example-main\build-static.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// build-static.js
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// 1. 构建项目
console.log('正在构建项目...')
execSync('npm run build', { stdio: 'inherit' })

// 2. 修改 dist/index.html
const distDir = './dist'
const indexPath = path.join(distDir, 'index.html')

let html = fs.readFileSync(indexPath, 'utf-8')

// 2.1 移除 type="module"
html = html.replace(/type="module"/g, '')
html = html.replace(/type="module"\s+crossorigin/g, '')

// 2.2 添加 CDN 版本的 Vue（因为我们将 Vue 外部化了）
const vueCDN = '<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>'
html = html.replace('</head>', `  ${vueCDN}\n  </head>`)

// 2.3 修改脚本路径
html = html.replace(/\/assets\//g, './assets/')

// 2.4 添加加载完成的检查
const checkScript = `
<script>
  // 等待所有资源加载
  window.addEventListener('load', function() {
    if (window.app) {
      console.log('应用加载成功');
    } else {
      console.error('应用加载失败');
      // 尝试重新加载资源
      setTimeout(function() {
        location.reload();
      }, 1000);
    }
  });
</script>
`

html = html.replace('</body>', `${checkScript}\n</body>`)

fs.writeFileSync(indexPath, html, 'utf-8')
console.log('已修改 index.html')

// 3. 修复 worker 文件引用
const jsFiles = fs.readdirSync(path.join(distDir, 'assets'))
  .filter(file => file.endsWith('.js'))

jsFiles.forEach(file => {
  const filePath = path.join(distDir, 'assets', file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  // 修复 worker 路径
  content = content.replace(
    /new Worker\(["']([^"']+)["']\)/g,
    function(match, workerPath) {
      // 确保 worker 路径是相对的
      if (workerPath.startsWith('/')) {
        return `new Worker('.' + '${workerPath}')`
      } else if (!workerPath.startsWith('.')) {
        return `new Worker('./assets/${workerPath}')`
      }
      return match
    }
  )
  
  // 修复 import.meta.url
  content = content.replace(
    /import\.meta\.url/g,
    "window.location.href"
  )
  
  fs.writeFileSync(filePath, content, 'utf-8')
})

console.log('构建完成！现在可以双击 dist/index.html 运行')