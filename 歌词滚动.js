/** 
 * 解析字符串
 * 得到一个数组对象
 * {time:时间, words:歌词} 
*/
function parseLrc(){
    var lines = lrc.split('\n');
    var result = [];//对象数组
    for(var i = 0; i<lines.length; i++){
        var str = lines[i];
        var parts = str.split(']');
        var timeStr = parts[0].substring(1);
        var obj = {time:parseTime(timeStr),
            words:parts[1]};
        result.push(obj);
    }
    return result;
}
 /**
  * 时间字符串解析为数字（秒）
  * @param {*} timeStr 输入时间字符串
  * @returns 输出结果（秒）
  */
function parseTime(timeStr) {
    var parts =  timeStr.split(':');
    return +parts[0]*60 + +parts[1];
}

var lrcData = parseLrc();
//获取需要的 dom
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.main ul'),
    main:document.querySelector('.main')
}

/**
 * 计算出高亮歌词下标
 */
function findIndex(){
    var curTime = doms.audio.currentTime;//播放器当前时间
    var advance = 0.25; // 提前250毫秒，单位秒
    var index = 0;
    for (var i = 0; i < lrcData.length; i++) {
        if (curTime >= lrcData[i].time - advance) {
            index = i;
        } else {
            break;
        }
    }
    return index;
}

//界面
/**
 * 创建歌词li
 */
function createLrcElements(){
    var frag = document.createDocumentFragment();
    for (var i = 0; i < lrcData.length; i++){
        var li = document.createElement('li');
        li.textContent = lrcData[i].words;
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}

createLrcElements();

//容器高度
var mainHeight = doms.main.clientHeight;
//li高度
var liHeight = doms.ul.children[0].clientHeight;
//最大偏移量
var maxOffset = doms.ul.clientHeight - mainHeight;

/**
 * 设置ul的偏移量
 */
function setOffset(){
    var index = findIndex();
    var offset = liHeight * index + liHeight / 2 - mainHeight / 2;
    if (offset < 0 ){
        offset = 0;
    }
    if (offset > maxOffset){
        offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;
     // 先移除所有li的active类
    Array.from(doms.ul.children).forEach(li => li.classList.remove('active'));
    var li = doms.ul.children[index];
    if (li){
        li.classList.add('active');
    }
}

//高频更新，实现歌与词的同步
function update() {
    setOffset();
    requestAnimationFrame(update);
}

doms.audio.addEventListener('play', () => {
    requestAnimationFrame(update);
});






