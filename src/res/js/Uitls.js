
// RGB转十六进制
export function RGB2Hex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}
// 十六进制转RGB
export function HEX2RGB(a) {
    if (a == ""){
        return ""
    }
    a=a.substring(1);
    a=a.toLowerCase();
    let b=new Array();
    for(let x=0;x<3;x++){
        b[0]=a.substr(x*2,2);
        b[3]="0123456789abcdef";
        b[1]=b[0].substr(0,1);
        b[2]=b[0].substr(1,1);
        b[20+x]=b[3].indexOf(b[1])*16+b[3].indexOf(b[2]);
    }
    //return "rgb(" +  b[20]+","+b[21]+","+b[22] + ")";
    return `${b[20]},${b[21]},${b[22]}`
}
// 颜色翻转
export function ColorReverse(OldColorValue){
    var OldColorValue = '0x'+OldColorValue.replace(/#/g,"");
    var str='000000'+(0xFFFFFF-OldColorValue).toString(16);
    return '#' + str.substring(str.length-6,str.length);
}

/** RGB转HSL */
export function RGB2HSL(rgb){
    let [r,g,b] = rgb.split(',');
	r=r/255;
	g=g/255;
	b=b/255;
	var min=Math.min(r,g,b);
	var max=Math.max(r,g,b);
	var l=(min+max)/2;
	var difference = max - min;
	var h,s,l;
	if(max==min){
		h=0;
		s=0;
	}else{
		s=l>0.5?difference/(2.0-max-min):difference/(max+min);
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	s=Math.round(s*100);
	l=Math.round(l*100);
	return [h,s+'%',l+'%'].join();
}

/** RGB转HSV */
export function RGB2HSV(rgb){
    let [r,g,b] = rgb.split(',');
	r=r/255;
	g=g/255;
	b=b/255;
	var h,s,v;
	var min=Math.min(r,g,b);
	var max=v=Math.max(r,g,b);
	var l=(min+max)/2;
	var difference = max-min;
	
	if(max==min){
		h=0;
	}else{
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	if(max==0){
		s=0;
	}else{
		s=1-min/max;
	}
	s=Math.round(s*100);
	v=Math.round(v*100);
	return [h,s,v].join();
}

/** 通过背景颜色计算适合显示的文字颜色 */
export function GetContrastYIQ(hexcolor) {
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}