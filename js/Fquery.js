/**
 * Created by Administrator on 2016/8/4.
 */
function myAddEvent(obj,sEv,fn){
    if(obj.attachEvent){
        obj.attachEvent("on"+sEv,function(){
            if(false==fn.call(obj)){
                event.cancelBubble = true;
                return false;
            };

        });
    }else{
        obj.addEventListener(sEv,function(ev){
            if(false==fn.call(obj)){
                ev.cancelBubble = true;
                ev.preventDefault();
            };

        },false);
    }
}
function getByClass(oParent,sClass){
    var aEle = oParent.getElementsByTagName("*");
    var aResult = [];
    var i = 0;
    for(i = 0;i<aEle.length;i++){
        if(aEle[i].className==sClass){
            aResult.push(aEle[i]);
        }
    }
    return aResult;

}
function getStyle(obj,attr){
    if(obj.currentStyle){
        return currentStyle(attr);
    }else{
        return getComputedStyle(obj,false)[attr];
    }
}
function getIndex(obj){
    var aBrother = obj.parentNode.children;
    var i = 0;
    for(i = 0;i<aBrother.length;i++){
        if(aBrother[i]==obj){
            return i;
        }
    }
}
function Fquery(vArg){
    /*v开头的参数可以代表任意类型，因为是任意类型，因此在传入参数后的第一步就是判断传进来的参数的类型，这里用switch实现*/
    //用来保存选中的元素
    this.elements = [];
    switch(typeof vArg){
        case ("function"):
            /*window.onload = vArg;*/
            myAddEvent(window,"load",vArg)
            break;
        case ("string"):
            /*选择器仅仅是用来选择元素如果不加后续操作没有任何效果*/
            switch (vArg.charAt(0)){
                case ("#"):
                    var obj = document.getElementById(vArg.substring(1));
                    this.elements.push(obj);
                    //Id
                    break;
                case("."):
                    this.elements =getByClass(document,vArg.substring(1));
                    //class
                    break;
                default:
                    this.elements =document.getElementsByTagName(vArg);
                     //tagName
            }
            break;
        case ("object"):
            this.elements.push(vArg);
    }

}
Fquery.prototype.click = function(fn){
    var i = 0;
    for(i = 0;i<this.elements.length;i++){
        myAddEvent(this.elements[i],"click",fn);
    }
    return this;
}
Fquery.prototype.show = function(){
    var i = 0;
    for(i = 0;i<this.elements.length;i++){
        this.elements[i].style.display = 'block';
    }
    return this;
}
Fquery.prototype.hide = function(){
    var i = 0;
    for(i = 0;i<this.elements.length;i++){
        this.elements[i].style.display = 'none';
    }
    return this;
}
Fquery.prototype.hover = function(fnOver,fnOut){
    var i = 0;
    for(i = 0;i<this.elements.length;i++){
        myAddEvent(this.elements[i],"mouseover",fnOver);
        myAddEvent(this.elements[i],"mouseout",fnOut);
    }
    return this;
}
/*$("div").css("background","red"),设置样式,$("div").css("background"),获取样式*/
Fquery.prototype.css = function(attr,value){
    if(arguments.length==2){
        //设置样式
        var i = 0 ;
        for(i = 0;i<this.elements.length;i++){
            this.elements[i].style.attr = value;
        }
    }else{
        //组元素只能获取第一个元素的样式
        //但是style只能获取行间样式
//this,在什么情况下会改变指向，四种情况，行间，套一层，定时器，绑定事件
        //函数调用的真正写法比如show()，全写是show.call(),call和真正的函数调用还是有一定的区别的，它本身可以穿一个参数，传入的东西就是this，的指向，如果函数原本就有参数，原本的参数会向后自然排序，apply();也可以达到call()的效果，他有两个参数，第一个参数是this，第二个参数是一个数组，数组内存的是函数原本带的参数，这两个方法的区别仅仅在于参数的传递方法上
        /*return this.elements[0].style[attr];*/
        if(typeof attr =="string"){
            return getStyle(this.elements[0],attr);
        }else{
            var t = 0;
            for(t = 0;t<this.elements.length;t++){
                var i = '';
                for(i in attr){
                    this.elements[t].style[i] = attr[i];
                }
            }

        }

    }
    return this;
}
Fquery.prototype.attr = function(attr,value){
    if(arguments==2){
        var i = 0;
        for(i = 0;i<this.elements.length;i++){
            this.elements[i][attr] = value;
        }
        return this;
    }else{
        return this.elements[0][attr];
    }

}
Fquery.prototype.toggle = function(){
    var count = 0;
    var i = 0;
    var isArguments = arguments;
    for(i = 0;i<this.elements.length;i++){
        addToggle(this.elements[i]);
        function addToggle(obj){
            var count = 0;
            myAddEvent(obj,"click",function(){
                isArguments[count++%isArguments.length].call(obj);
            })
        }
    }
    return this;
}
Fquery.prototype.eq = function(n){
    return $f(this.elements[n]);
}
Fquery.prototype.find = function(str){
    var i = 0;
    var aResult = [];
    for(i = 0;i<this.elements.length;i++){
        switch(str.charAt(0)){
            case ".":
               var aEle =  getByClass(this.elements(i),str.substring(1));
                aResult = aResult.concat(aEle);
                break;
            default:
                this.elements[i].getElementsByTagName(str);
                aResult = aResult.concat(aEle);
        }
    }
    var newResult = $f();
    newResult.element =aResult;
    return newResult;
}
Fquery.prototype.index = function(){

    return getIndex(this.elements[0]);

}
/*原生js里的阻止冒泡事件，obj.bind("contextmenu",function(){}),contextmenu可以给加任意事件
*
* 阻止冒泡的写法obj.bind("contextmenu",function(){
*           return false;
* })
* */

Fquery.prototype.bind = function(sEv,fn){
    var i = 0;
    for(i = 0;i<this.elements.length;i++){
        /*此时在函数内写return false是不起阻止冒泡作用的*/
        myAddEvent(this.elements[i],sEv,fn)
    }
}
Fquery.prototype.extent = function(name,fn){
/*添加函数的名字，和这个函数具体要执行的功能，这样就实现了一个插件的功能*/
    Fquery.prototype[name] = fn;
}
function $f(vArg){
    return new Fquery(vArg);
}