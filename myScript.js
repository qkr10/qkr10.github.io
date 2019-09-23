var h1Ele, textNode, bodyEle
window.onload = function() {
    h1Ele = document.createElement('h1')
    textNode = document.createTextNode('asdf')
    bodyEle = document.getElementById('space')
    h1Ele.appendChild(textNode)
    bodyEle.appendChild(h1Ele)
}