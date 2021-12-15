
import { GetContrastYIQ, HEX2RGB, RGB2HSL  } from './res/js/Uitls.js'

const App = new Vue({
    el: '#app',
    data() {
        return {
            ColorList: [],
            type: 'rgb',
            Notification: null,
            CurrentEvent: null,
        }
    },
    watch: {
        // 颜色模式改变后保存到本地存储
        type(type) {
            localStorage['type'] = type
        }
    },
    methods: {
        // 吸取颜色 Handler
        async Dropper(e) {
            let { sRGBHex } = await new EyeDropper().open()
            this.AddColor(sRGBHex)
        },
        // 复制颜色值到剪贴板
        async Copy(text) {
            await navigator.clipboard.writeText(text)
            this.Message(`\r\n色值已复制到剪贴板：${text}\r\n`)
        },
        // 消息提醒
        Message(message) {
            this.Notification && this.Notification.close()
            this.Notification = new window.Notification('', {
                body: message, 
                icon: 'res/icon/logo.png'
            });
        },
        /** 添加颜色到颜色列表 */
        AddColor(sRGBHex) {
            // let hex = sRGBHex.replace('#','')
            let Index = this.ColorList.findIndex(item => item.html===sRGBHex)
            Index>=0 && this.ColorList.splice(Index,1)
            this.ColorList.unshift({
                hex: sRGBHex,
                html: sRGBHex,
                rgb: `rgb(${HEX2RGB(sRGBHex)})`,
                rgba: `rgba(${HEX2RGB(sRGBHex)},1.0)`,
                hsl: `hsl(${RGB2HSL(HEX2RGB(sRGBHex))})`,
                hsla: `hsla(${RGB2HSL(HEX2RGB(sRGBHex))},1.0)`,
                reverse: GetContrastYIQ(sRGBHex.replace('#','')),
            })
            this.SaveData()
        },
        // 允许拖动元素放入到垃圾箱
        allowDrop(ev){
            ev.preventDefault();
        },
        // 拖动色块
        drag(ev,index) {
            ev.dataTransfer.setData("Text",index);
            // 设置色块拖动时样式
            let crt = document.querySelector('#DragImage')
            let { cssText } = ev.target.style
            crt.style.cssText = cssText
            ev.dataTransfer.setDragImage(crt, 0, 0);
            ev.target.style.opacity = '0';
        },
        // 放入到垃圾箱
        drop(ev) {
            var data=ev.dataTransfer.getData("Text");
            this.ColorList.splice(Number(data),1);
            this.SaveData()
            ev.preventDefault();
            ev.target.className = ''
        },
        // 拖动元素进入垃圾箱区域
        dragenter(ev) {
            ev.target.className = 'active'
        },
        // 拖动元素离开垃圾箱区域
        dragleave(ev) {
            ev.target.className = ''
        },
        // 拖放结束，未放入垃圾箱
        dragend(ev){
            ev.target.style.opacity = '';
        },
        /** 本地存储 */
        SaveData() {
            localStorage['historyData'] = JSON.stringify(this.ColorList)
        }
    },
    mounted() {
        let { 
            historyData, //颜色列表历史数据
            type,        //颜色类型
         } = localStorage
        historyData && (this.ColorList = JSON.parse(historyData) )
        type && (this.type = type )


    }
})
// NWJS环境下 绑定 Ctrl+M  快捷键
// 缺陷： 只在窗口激活状态下有效
if(typeof nw !== 'undefined') {
    var option = {
        key : "Ctrl+M",
    };
    var shortcut = new nw.Shortcut(option);
    nw.App.registerGlobalHotKey(shortcut);
    chrome.debugger.attach({ tabId: 2 }, "1.2", function() {})
    shortcut.on('active', async function() {
        chrome.tabs.update(2, {selected:true});
        chrome.debugger.sendCommand({ tabId: 2 }, "Input.dispatchMouseEvent", {
            type: "mousePressed", x: 0, y: 0, button: "left", clickCount: 1
        },res=>{
            console.log(res,5555);
        })
        let { sRGBHex } = await new EyeDropper().open()
        App.AddColor(sRGBHex)
    });
}


