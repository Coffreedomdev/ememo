
export class EPD {
    ctx: CanvasRenderingContext2D;
    paper: { w: number; h: number; };
    data: any[];
    colorDeep: number;
    cuts: number[];
    delta: { data: any[]; startx: number; starty: number; width: number; height: number; };
    binData: { colorDeep: 2 | 4 | 16; binData: number[]; };
    fontPath: string;
    font;
    icons:{h:24,w:24, data:[]}[] = [];
    browrVersion = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    isMobile = (navigator.userAgent.indexOf("Mobile") > -1);

    constructor(ctx,paper = { w: 264, h: 176 },fontname="24px Arial"){
        this.ctx = ctx;
        this.ctx.font = fontname;
        this.paper = paper;
        this.data = new Array(paper.w).fill(0).map(d=>new Array(paper.h).fill(1));
    };
    clearData(colorDeep=2){
        for (let i=0;i<this.paper.w;i++) for (let j=0;j<this.paper.h;j++) this.data[i][j] =colorDeep-1;
        return this;
    }
// bitmapfonts


    bdfDraw(text:string,x=10,y=this.font?.headers?.fbby||100,inverse=false,wrap=true,fixfont=false){
        if (!this.font)  {console.log('font not load...'); return {x,y}};
        let linelimit = null;
        y = y - this.font.headers.fbby;
        if (wrap) linelimit = this.paper.w-x-10;
        let tt = this.font.draw(text, { linelimit, direction: "lr",mode:fixfont?0:1 }).glow().replace(2,0);
        let h = tt.bindata.length;
        let w = tt.bindata[0].length;
        if (!inverse) tt.replace(0,3).replace(1,0).replace(3,1);
        let fdata =  tt.bindata.map((d) => d.split("").map(d=>parseInt(d)));
        for (let i=0;i<w;i++) for (let j=0;j<h;j++) 
           if (x+i < this.paper.w && y+j < this.paper.h)
            this.data[x+i][y+j] = fdata[j][i];
        this.reDraw(2);
        return ({x:x+w,y:y+h+this.font.headers.fbby});
    }
    bdfTable(s:string[],wrap=false,istitle=true){
        this.clearData();
        // this.bdfDraw(' '.repeat(40),0,24,true,false);
        let starty =24;
        let h = this.font.headers.fbby+2;        
        for (let i=0;i<this.paper.w;i++) for (let j=0;j<h;j++) 
          this.data[i][starty-j+1] = 0;
        s = s.filter(ss=>ss);
        s.forEach((t,i)=>this.bdfDraw(t,3,starty+21*i,i==0 && istitle,wrap))
    }
    bdfList(s:string[],prefix='-'){
        if (!this.font)  {console.log('font not load...'); return this};
        this.clearData();
        let starty =24;
        let h = this.font.headers.fbby+2;        
        for (let i=0;i<this.paper.w;i++) for (let j=0;j<h;j++) 
          this.data[i][starty-j+1] = 0;
        
        s = s.filter(ss=>ss);
        let startx=12;
        s.forEach((t,i)=>{
            if (prefix && (i!=0)) startx = this.bdfDraw(prefix,2,starty,i==0).x - 6;
            starty = this.bdfDraw(t,startx,starty,i==0).y;
        })
        return this;
    }
    
    bdfTest(){
        // this.bdfDraw('wrap: ABCDEFG,abcoef, 1234567890,!@#$%^&*()');
        // this.bdfDraw('no-wrap & inverse, tABCDEFG,abcoef, 1234567890,!@#$%^&*()',10,80,true,false)
        // this.bdfDraw('wrap: ABCDEFG,abcoef, 1234567890,!@#$%^&*()',30,176);
        if (!this.font) return console.log('font not load...');
        let tt = this.font.drawall({ linelimit:260, direction: "lr"  }).glow().replace(2,0);
        let h = tt.bindata.length;
        let w = tt.bindata[0].length;
        tt.replace(0,3).replace(1,0).replace(3,1);
        let fdata =  tt.bindata.map((d) => d.split("").map(d=>parseInt(d)));
        for (let i=0;i<w;i++) for (let j=0;j<h;j++) 
           if (i < this.paper.w && j < this.paper.h)
            this.data[i][j] = fdata[j][i];
        this.reDraw(2);
    }

// bitmapfonts

    draw(str:string, x:number, y:number,fs:string|number = this.ctx.font,fillStyle='black'){
        this.ctx.fillStyle = fillStyle;
        if (this.browrVersion[1] ==="Chrome"){
            if (this.isMobile){//for android
                x = x/72*63;
                y = y/72*62.5;
            }
            else { //for google browser   
                x = x/72*69;
                y = y/72*69;     
            }
        } else { //for iphone 
            x = x/66*72;
            y = y/66*72;  
        }
        if (typeof fs == 'string') this.ctx.font = fs; else this.ctx.font = `${fs}px Arial`;
        let mm = this.ctx.measureText(str);
        this.ctx.fillText(str, x, y+mm.fontBoundingBoxAscent );
        // this.ctx.strokeRect(x,y,mm.width,mm.fontBoundingBoxAscent + mm.fontBoundingBoxDescent);
        // this.ctx.fillRect(0,0,20,20);
        // this.ctx.fillRect(244,0,20,20);
        // this.ctx.fillRect(0,156,20,20);
        // this.ctx.fillRect(244,156,20,20);
        

    };
    getFontWidth(str,fs:string|number = this.ctx.font){
        if (typeof fs == 'string') this.ctx.font = fs;
        else this.ctx.font = `${fs}px Arial`;
        return this.ctx.measureText(str).width;
    };
    loadicons(src='/assets/bfonts.json'){
        return fetch(src)
        .then(r=>r.json()).then(json=>{
            if (Array.isArray(json))
            this.icons = json;
            else {
                Object.keys(json).forEach(n=>{
                    this.icons[n] = json[n];
                });
            };
            console.log('icon load');
            return this;
        });
    };
    iconDraw(names:string|string[],x=100,y=100){
      if (typeof names =='string') names = [names];
      names.reduce((a,name)=>{
        if (!(name in this.icons)) {console.log(`icon ${name} not found!`) ;return a};
        let icon= this.icons[name];
        let starty = a.y - icon.h;
        for (let i=0;i<icon.w;i++) for (let j=0;j<icon.h;j++) 
            if (i+a.x < this.paper.w && j+starty < this.paper.h)
                this.data[i+a.x][j+starty]= icon.data[i][j];
        return {x:a.x+icon.w,y:a.y}
      },{x,y});
      return this;
    };
    iconString(s:string,x=10,y=10,prefix="b"){
        let names = Array.from(s).map(d=>prefix+d);
        this.iconDraw(names,x,y);
    };
    iconDrawRect(content=[1,2,3,4],x=2,y=2,w=252){
        let maxfh = 0;
        let endx = 2;
        let starty = y;
        let txt = [];
        for (let chr of content){
            maxfh = Math.max(maxfh,this.icons[chr].h);
            if (endx+this.icons[chr].w > w){
                starty+= maxfh;
            +this.iconDraw(txt,x,starty);
                maxfh =+this.icons[chr].h;
                txt=[]
                endx = 0;
            }
            else {
                txt.push(chr);
                endx +=+this.icons[chr].w;
            }
        };
        starty+= maxfh;
        this.iconDraw(txt,2,starty);
        this.reDraw(2);
        return this;
    }
    imgDraw(imgN:HTMLImageElement,colorDeep:2|4|16=16,cutpoint=null,sx=0,sy=0,sw=imgN.naturalWidth,sh=imgN.naturalWidth*176/264,tx=0,ty=0,tw=264,th=176){
        // this.ctx.clearRect(tx,ty,tw,th);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(tx,ty,tw,th);
        this.ctx.fillStyle = 'black';
        this.ctx.drawImage(imgN, sx, sy,sw , sh, tx, ty, tw, th);
        this.genGSData(colorDeep,tx,ty,tw,th,cutpoint).reDraw(colorDeep);
        return this;
    };
    sumamryGSData(numbersArr) {
        let zs16 = [0.16, 0.32, 0.49, 0.67, 0.89, 1.15, 1.53];
        let total = 0;
        let tmp = JSON.parse(JSON.stringify(numbersArr));
        tmp.sort(function (a, b) {
            return a - b;
        });
        let medium = tmp[Math.floor(tmp.length / 2)];
        let tt = Math.floor(tmp.length / 16);
        let pp = [];
        for (let i = 1; i < 16; i++) pp.push(tmp[i * tt]);

        let meanVal = total / numbersArr.length;
        let SDprep = 0;
        numbersArr.forEach((d) => {
            SDprep += (d - meanVal) * (d - meanVal);
        });
        let SDresult = Math.sqrt(SDprep / numbersArr.length);
        let p = [];
        for (let i = 6; i > -1; i--) p.push(meanVal - SDresult * zs16[i]);
        p.push(meanVal);
        for (let i = 0; i < 7; i++) p.push(meanVal + SDresult * zs16[i]);
        return {
            max: Math.max.apply(null, numbersArr),
            min: Math.min.apply(null, numbersArr),
            sum: total,
            mean: meanVal,
            stddev: SDresult,
            ap16: p,
            medium: medium,
            p16: pp,
        };
    };

    genGSData(colorDeep:2|4|16 = 16, startx = 0, starty = 0, width = 264, height = 176, cutpoint=null,constrast=100,invert = colorDeep==16 ) {
        let buff = [];
        let byte = 0;
        // this.ctx.filter = `contrast(${constrast}%)`;
        let gdata = this.ctx?.getImageData(startx, starty, width, height).data;
        if (invert && gdata) {
            for (let i = 0; i < width; i++)
                for (let j = 0; j < height; j++) {
                    let p = 4 * (j * width + width - i - 1);
                    let dd = 255 - Math.round( gdata[p] * 0.25 + gdata[p + 1] * 0.3 + gdata[p + 2] * 0.05 + gdata[p + 3] * 0.4 );
                    buff.push(dd);
                }
        } else if (gdata) {
            for (let i = 0; i < width; i++)
                for (let j = 0; j < height; j++) {
                    let p = 4 * (j * width + width - i - 1);
                    let dd = Math.round( gdata[p] * 0.25 + gdata[p + 1] * 0.3 + gdata[p + 2] * 0.05 + gdata[p + 3] * 0.4
                    );
                    buff.push(dd);
                }
        }
        let dataSummary = this.sumamryGSData(buff);
        let lumcut = [cutpoint || dataSummary.medium];
        if (colorDeep > 2) {
            lumcut = [];
            for (let i = 1; i < colorDeep; i++) lumcut.push(i);
            let secPix = (dataSummary.max - dataSummary.min) / colorDeep;
            lumcut = lumcut.map((d) => Math.floor(secPix * d + dataSummary.min) );
        }
        let test = {};
        let data = [];
        buff.forEach((d, idx) => {
            data[idx] = 0;
            for (let i = 0; i < lumcut.length; i++) if (d > lumcut[i]) data[idx] = i + 1;
            if (test[data[idx]]) test[data[idx]]++; else test[data[idx]] = 1;
        });
        for (let k in test) {
            test[k] = ((test[k] / buff.length) * 100).toFixed(1) + "%";
        }
        // console.log({test,lumcut,dataSummary});
        let d2= new Array(width).fill(0).map(d=>new Array(height).fill(0));
        for (let i=0;i<width;i++) for (let j=0;j<height;j++) d2[width-i-1][j] = data[i*height+j]; 
        this.delta = {data:d2,startx,starty,width,height};
        for (let i=startx;i<startx+width;i++) for (let j=starty;j<starty+height;j++) 
           this.data[startx+i][starty+j] = d2[i][j]
        this.colorDeep = colorDeep;
        this.cuts = lumcut;
        return this;
    }
    genGSBinData(colorDeep:2|4|16 = 16, cutpoint=null,invert = true,constrast=100){
        let bufflens = {2:5808,4:11616,16:23232};
        let bitperpixel = {2:8,4:4,16:2};
        let colbits = {2:22,4:44,16:88};
        this.genGSData(colorDeep, 0, 0, 264, 176,cutpoint,constrast,invert);
        let binData= new Array(1+bufflens[colorDeep]) as number[];
        binData[0] = colorDeep;
        
        for (let i=0;i<264;i++)
        for (let j=0;j<colbits[colorDeep];j++){
            let tmp = 0;
            let st = (colbits[colorDeep]-j)*bitperpixel[colorDeep]-1;
            for (let k = 0;k<bitperpixel[colorDeep];k++) tmp = tmp*colorDeep + this.data[i][ st-k];
            binData[i*(colbits[colorDeep])+j+1] =tmp;
        }
        this.binData = {colorDeep,binData};
        return this;
    };
    reDraw(colorDeep:2|4|16=2,data=this.data,){
        // this.ctx.filter = null;
        if (colorDeep==4) return console.log('4 color no ready!');

        if (colorDeep==2){
            this.ctx.clearRect(0,0,264,176);
            for (let i=0;i<264;i++)
            for (let j=0;j<176;j++){
                if (data[i][j]!==1) this.ctx.fillStyle = 'black';
                else this.ctx.fillStyle = 'white';
                this.ctx.fillRect(i,j,1,1);
            }
        }
        else{
            let cl = ['#fff','#eee','#ddd','#ccc','#bbb','#aaa','#999','#888','#777','#666','#555','#444','#333','#222','#111','#000']
            this.ctx.clearRect(0,0,264,176);
            for (let i=0;i<264;i++)
            for (let j=0;j<176;j++){
                this.ctx.fillStyle  = cl[data[i][j]] || '#fff';
                this.ctx.fillRect(i,j,1,1);
            };
        }
        return this;
    }
    reDrawBin(bin:Uint8Array|number[] = this.binData.binData){
        console.log(bin.length);   
        if (bin.length == 5809){
            let ops = [128,64,32,16,8,4,2,1]
            for (let i=1;i< bin.length;i++){
                let dd = bin[i];
                let startx = Math.floor((i-1)/22);
                let starty = ((i-1)%22)*8;
                for(let j=0;j<8;j++) {
                    this.data[startx][175-(starty+j)] = (dd & ops[j]) == ops[j]?0:1;
                }
            };
            this.reDraw(2);
        }
        else if (bin.length == 23233){
            for (let i=1;i< bin.length;i++){
                let startx = Math.floor((i-1)/88);
                let starty = ((i-1)%88)*2;
                this.data[startx][175-starty] = bin[i] >>4;
                this.data[startx][175-(starty+1)] = bin[i]%16;
            };
            this.reDraw(16);
            let agg = {}
            for (let i=0;i<264;i++) for (let j=0;j<176;j++) 
              if (!agg[this.data[i][j]]) agg[this.data[i][j]] =1; else  agg[this.data[i][j]]++
            console.log(agg);  

        }
    };

    postBinTo(uri='/list'){
        fetch(uri,
        {
            body: new Uint8Array(this.binData.binData).buffer, // must match 'Content-Type' header
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'}
        }).then(r=>r.text()).then(console.log);
    }

    drawTxtLine( str = "this is a test!", startx = 0, starty = 0, fs = 48, clear = true, endx = this.paper.w, endy = this.paper.h ) {
        let chkRec = { height: fs + 2, width: this.getFontWidth(str, fs) };
        if (chkRec.height < endy - starty && chkRec.width < endx - startx) {
            if (clear)
                this.ctx?.clearRect(startx, starty+2, chkRec.width, chkRec.height-2);
            this.draw(str, startx, starty + fs, fs);
        } else {
            this.drawTxtLine(str, startx, starty, fs - 1, clear, endx, endy);
        }
    }

    drawTxtＷrap( str = "this is a test!", fs = 24, clear = true, startx = 16, starty = 16, endx = 32, endy = 32 ) {
        let chkRec = { height: fs + 2, width: this.getFontWidth(str, fs) };
        let pww = chkRec.width / str.length;
        let split = Math.floor((endy - starty) / chkRec.height);
        let slen = Math.floor((endx - startx) / pww);
        if (split * slen < str.length)
            this.drawTxtＷrap(str, fs - 1, clear, startx, starty, endx, endy);
        else
            for (
                let i = 0;
                i < split && starty + chkRec.height * (i + 1) - fs < endy;
                i++
            ) {
                this.drawTxtLine(
                    str.substr(i * slen, slen),
                    startx,
                    starty + chkRec.height * i,
                    fs,
                    clear
                );
            }
    }
    
}