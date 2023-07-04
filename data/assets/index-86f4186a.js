var vt=Object.defineProperty;var wt=(n,e,t)=>e in n?vt(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var P=(n,e,t)=>(wt(n,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerpolicy&&(l.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?l.credentials="include":s.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(s){if(s.ep)return;s.ep=!0;const l=t(s);fetch(s.href,l)}})();function xe(){}function at(n){return n()}function $e(){return Object.create(null)}function ke(n){n.forEach(at)}function ft(n){return typeof n=="function"}function ut(n,e){return n!=n?e==e:n!==e||n&&typeof n=="object"||typeof n=="function"}let Fe;function et(n,e){return Fe||(Fe=document.createElement("a")),Fe.href=e,n===Fe.href}function yt(n){return Object.keys(n).length===0}function u(n,e){n.appendChild(e)}function E(n,e,t){n.insertBefore(e,t||null)}function X(n){n.parentNode&&n.parentNode.removeChild(n)}function p(n){return document.createElement(n)}function ct(n){return document.createTextNode(n)}function z(){return ct(" ")}function S(n,e,t,o){return n.addEventListener(e,t,o),()=>n.removeEventListener(e,t,o)}function T(n){return function(e){return e.preventDefault(),n.call(this,e)}}function A(n){return function(e){return e.stopPropagation(),n.call(this,e)}}function k(n,e,t){t==null?n.removeAttribute(e):n.getAttribute(e)!==t&&n.setAttribute(e,t)}function bt(n){return Array.from(n.childNodes)}function Be(n,e){n.value=e??""}function w(n,e,t,o){t===null?n.style.removeProperty(e):n.style.setProperty(e,t,o?"important":"")}function tt(n,e){for(let t=0;t<n.options.length;t+=1){const o=n.options[t];if(o.__value===e){o.selected=!0;return}}n.selectedIndex=-1}function xt(n){const e=n.querySelector(":checked")||n.options[0];return e&&e.__value}let Ye;function Xe(n){Ye=n}function kt(){if(!Ye)throw new Error("Function called outside component initialization");return Ye}function Ct(n){kt().$$.on_mount.push(n)}const ye=[],be=[],Le=[],nt=[],Dt=Promise.resolve();let qe=!1;function St(){qe||(qe=!0,Dt.then(ht))}function Ie(n){Le.push(n)}const Ge=new Set;let we=0;function ht(){if(we!==0)return;const n=Ye;do{try{for(;we<ye.length;){const e=ye[we];we++,Xe(e),zt(e.$$)}}catch(e){throw ye.length=0,we=0,e}for(Xe(null),ye.length=0,we=0;be.length;)be.pop()();for(let e=0;e<Le.length;e+=1){const t=Le[e];Ge.has(t)||(Ge.add(t),t())}Le.length=0}while(ye.length);for(;nt.length;)nt.pop()();qe=!1,Ge.clear(),Xe(n)}function zt(n){if(n.fragment!==null){n.update(),ke(n.before_update);const e=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,e),n.after_update.forEach(Ie)}}const Pe=new Set;let Mt;function pt(n,e){n&&n.i&&(Pe.delete(n),n.i(e))}function Xt(n,e,t,o){if(n&&n.o){if(Pe.has(n))return;Pe.add(n),Mt.c.push(()=>{Pe.delete(n),o&&(t&&n.d(1),o())}),n.o(e)}else o&&o()}function Yt(n){n&&n.c()}function dt(n,e,t,o){const{fragment:s,after_update:l}=n.$$;s&&s.m(e,t),o||Ie(()=>{const r=n.$$.on_mount.map(at).filter(ft);n.$$.on_destroy?n.$$.on_destroy.push(...r):ke(r),n.$$.on_mount=[]}),l.forEach(Ie)}function _t(n,e){const t=n.$$;t.fragment!==null&&(ke(t.on_destroy),t.fragment&&t.fragment.d(e),t.on_destroy=t.fragment=null,t.ctx=[])}function jt(n,e){n.$$.dirty[0]===-1&&(ye.push(n),St(),n.$$.dirty.fill(0)),n.$$.dirty[e/31|0]|=1<<e%31}function mt(n,e,t,o,s,l,r,h=[-1]){const _=Ye;Xe(n);const c=n.$$={fragment:null,ctx:[],props:l,update:xe,not_equal:s,bound:$e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(_?_.$$.context:[])),callbacks:$e(),dirty:h,skip_bound:!1,root:e.target||_.$$.root};r&&r(c.root);let m=!1;if(c.ctx=t?t(n,e.props||{},(d,g,...x)=>{const D=x.length?x[0]:g;return c.ctx&&s(c.ctx[d],c.ctx[d]=D)&&(!c.skip_bound&&c.bound[d]&&c.bound[d](D),m&&jt(n,d)),g}):[],c.update(),m=!0,ke(c.before_update),c.fragment=o?o(c.ctx):!1,e.target){if(e.hydrate){const d=bt(e.target);c.fragment&&c.fragment.l(d),d.forEach(X)}else c.fragment&&c.fragment.c();e.intro&&pt(n.$$.fragment),dt(n,e.target,e.anchor,e.customElement),ht()}Xe(_)}class gt{$destroy(){_t(this,1),this.$destroy=xe}$on(e,t){if(!ft(t))return xe;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(t),()=>{const s=o.indexOf(t);s!==-1&&o.splice(s,1)}}$set(e){this.$$set&&!yt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}class Et{constructor(e,t={w:264,h:176},o="24px Arial"){P(this,"ctx");P(this,"paper");P(this,"data");P(this,"colorDeep");P(this,"cuts");P(this,"delta");P(this,"binData");P(this,"fontPath");P(this,"font");P(this,"icons",[]);P(this,"browrVersion",navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[]);P(this,"isMobile",navigator.userAgent.indexOf("Mobile")>-1);this.ctx=e,this.ctx.font=o,this.paper=t,this.data=new Array(t.w).fill(0).map(s=>new Array(t.h).fill(1))}clearData(e=2){for(let t=0;t<this.paper.w;t++)for(let o=0;o<this.paper.h;o++)this.data[t][o]=e-1;return this}bdfDraw(e,t=10,o=(_=>(_=(h=>(h=this.font)==null?void 0:h.headers)())==null?void 0:_.fbby)()||100,s=!1,l=!0,r=!1){if(!this.font)return console.log("font not load..."),{x:t,y:o};let c=null;o=o-this.font.headers.fbby,l&&(c=this.paper.w-t-10);let m=this.font.draw(e,{linelimit:c,direction:"lr",mode:r?0:1}).glow().replace(2,0),d=m.bindata.length,g=m.bindata[0].length;s||m.replace(0,3).replace(1,0).replace(3,1);let x=m.bindata.map(D=>D.split("").map(C=>parseInt(C)));for(let D=0;D<g;D++)for(let C=0;C<d;C++)t+D<this.paper.w&&o+C<this.paper.h&&(this.data[t+D][o+C]=x[C][D]);return this.reDraw(2),{x:t+g,y:o+d+this.font.headers.fbby}}bdfTable(e,t=!1,o=!0){this.clearData();let s=24,l=this.font.headers.fbby+2;for(let r=0;r<this.paper.w;r++)for(let h=0;h<l;h++)this.data[r][s-h+1]=0;e=e.filter(r=>r),e.forEach((r,h)=>this.bdfDraw(r,3,s+21*h,h==0&&o,t))}bdfList(e,t="-"){if(!this.font)return console.log("font not load..."),this;this.clearData();let o=24,s=this.font.headers.fbby+2;for(let r=0;r<this.paper.w;r++)for(let h=0;h<s;h++)this.data[r][o-h+1]=0;e=e.filter(r=>r);let l=12;return e.forEach((r,h)=>{t&&h!=0&&(l=this.bdfDraw(t,2,o,h==0).x-6),o=this.bdfDraw(r,l,o,h==0).y}),this}bdfTest(){if(!this.font)return console.log("font not load...");let e=this.font.drawall({linelimit:260,direction:"lr"}).glow().replace(2,0),t=e.bindata.length,o=e.bindata[0].length;e.replace(0,3).replace(1,0).replace(3,1);let s=e.bindata.map(l=>l.split("").map(r=>parseInt(r)));for(let l=0;l<o;l++)for(let r=0;r<t;r++)l<this.paper.w&&r<this.paper.h&&(this.data[l][r]=s[r][l]);this.reDraw(2)}draw(e,t,o,s=this.ctx.font,l="black"){this.ctx.fillStyle=l,this.browrVersion[1]==="Chrome"?this.isMobile?(t=t/72*63,o=o/72*62.5):(t=t/72*69,o=o/72*69):(t=t/66*72,o=o/66*72),typeof s=="string"?this.ctx.font=s:this.ctx.font=`${s}px Arial`;let r=this.ctx.measureText(e);this.ctx.fillText(e,t,o+r.fontBoundingBoxAscent)}getFontWidth(e,t=this.ctx.font){return typeof t=="string"?this.ctx.font=t:this.ctx.font=`${t}px Arial`,this.ctx.measureText(e).width}loadicons(e="/assets/bfonts.json"){return fetch(e).then(t=>t.json()).then(t=>(Array.isArray(t)?this.icons=t:Object.keys(t).forEach(o=>{this.icons[o]=t[o]}),console.log("icon load"),this))}iconDraw(e,t=100,o=100){return typeof e=="string"&&(e=[e]),e.reduce((s,l)=>{if(!(l in this.icons))return console.log(`icon ${l} not found!`),s;let r=this.icons[l],h=s.y-r.h;for(let _=0;_<r.w;_++)for(let c=0;c<r.h;c++)_+s.x<this.paper.w&&c+h<this.paper.h&&(this.data[_+s.x][c+h]=r.data[_][c]);return{x:s.x+r.w,y:s.y}},{x:t,y:o}),this}iconString(e,t=10,o=10,s="b"){let l=Array.from(e).map(r=>s+r);this.iconDraw(l,t,o)}iconDrawRect(e=[1,2,3,4],t=2,o=2,s=252){let l=0,r=2,h=o,_=[];for(let c of e)l=Math.max(l,this.icons[c].h),r+this.icons[c].w>s?(h+=l,+this.iconDraw(_,t,h),l=+this.icons[c].h,_=[],r=0):(_.push(c),r+=+this.icons[c].w);return h+=l,this.iconDraw(_,2,h),this.reDraw(2),this}imgDraw(e,t=16,o=null,s=0,l=0,r=e.naturalWidth,h=e.naturalWidth*176/264,_=0,c=0,m=264,d=176){return this.ctx.fillStyle="white",this.ctx.fillRect(_,c,m,d),this.ctx.fillStyle="black",this.ctx.drawImage(e,s,l,r,h,_,c,m,d),this.genGSData(t,_,c,m,d,o).reDraw(t),this}sumamryGSData(e){let t=[.16,.32,.49,.67,.89,1.15,1.53],o=0,s=JSON.parse(JSON.stringify(e));s.sort(function(g,x){return g-x});let l=s[Math.floor(s.length/2)],r=Math.floor(s.length/16),h=[];for(let g=1;g<16;g++)h.push(s[g*r]);let _=o/e.length,c=0;e.forEach(g=>{c+=(g-_)*(g-_)});let m=Math.sqrt(c/e.length),d=[];for(let g=6;g>-1;g--)d.push(_-m*t[g]);d.push(_);for(let g=0;g<7;g++)d.push(_+m*t[g]);return{max:Math.max.apply(null,e),min:Math.min.apply(null,e),sum:o,mean:_,stddev:m,ap16:d,medium:l,p16:h}}genGSData(e=16,t=0,o=0,s=264,l=176,r=null,h=100,_=e==16){var a;let c=[],m=(a=this.ctx)==null?void 0:a.getImageData(t,o,s,l).data;if(_&&m)for(let b=0;b<s;b++)for(let f=0;f<l;f++){let v=4*(f*s+s-b-1),I=255-Math.round(m[v]*.25+m[v+1]*.3+m[v+2]*.05+m[v+3]*.4);c.push(I)}else if(m)for(let b=0;b<s;b++)for(let f=0;f<l;f++){let v=4*(f*s+s-b-1),I=Math.round(m[v]*.25+m[v+1]*.3+m[v+2]*.05+m[v+3]*.4);c.push(I)}let d=this.sumamryGSData(c),g=[r||d.medium];if(e>2){g=[];for(let f=1;f<e;f++)g.push(f);let b=(d.max-d.min)/e;g=g.map(f=>Math.floor(b*f+d.min))}let x={},D=[];c.forEach((b,f)=>{D[f]=0;for(let v=0;v<g.length;v++)b>g[v]&&(D[f]=v+1);x[D[f]]?x[D[f]]++:x[D[f]]=1});for(let b in x)x[b]=(x[b]/c.length*100).toFixed(1)+"%";let C=new Array(s).fill(0).map(b=>new Array(l).fill(0));for(let b=0;b<s;b++)for(let f=0;f<l;f++)C[s-b-1][f]=D[b*l+f];this.delta={data:C,startx:t,starty:o,width:s,height:l};for(let b=t;b<t+s;b++)for(let f=o;f<o+l;f++)this.data[t+b][o+f]=C[b][f];return this.colorDeep=e,this.cuts=g,this}genGSBinData(e=16,t=null,o=!0,s=100){let l={2:5808,4:11616,16:23232},r={2:8,4:4,16:2},h={2:22,4:44,16:88};this.genGSData(e,0,0,264,176,t,s,o);let _=new Array(1+l[e]);_[0]=e;for(let c=0;c<264;c++)for(let m=0;m<h[e];m++){let d=0,g=(h[e]-m)*r[e]-1;for(let x=0;x<r[e];x++)d=d*e+this.data[c][g-x];_[c*h[e]+m+1]=d}return this.binData={colorDeep:e,binData:_},this}reDraw(e=2,t=this.data){if(e==4)return console.log("4 color no ready!");if(e==2){this.ctx.clearRect(0,0,264,176);for(let o=0;o<264;o++)for(let s=0;s<176;s++)t[o][s]!==1?this.ctx.fillStyle="black":this.ctx.fillStyle="white",this.ctx.fillRect(o,s,1,1)}else{let o=["#fff","#eee","#ddd","#ccc","#bbb","#aaa","#999","#888","#777","#666","#555","#444","#333","#222","#111","#000"];this.ctx.clearRect(0,0,264,176);for(let s=0;s<264;s++)for(let l=0;l<176;l++)this.ctx.fillStyle=o[t[s][l]]||"#fff",this.ctx.fillRect(s,l,1,1)}return this}reDrawBin(e=this.binData.binData){if(console.log(e.length),e.length==5809){let t=[128,64,32,16,8,4,2,1];for(let o=1;o<e.length;o++){let s=e[o],l=Math.floor((o-1)/22),r=(o-1)%22*8;for(let h=0;h<8;h++)this.data[l][175-(r+h)]=(s&t[h])==t[h]?0:1}this.reDraw(2)}else if(e.length==23233){for(let o=1;o<e.length;o++){let s=Math.floor((o-1)/88),l=(o-1)%88*2;this.data[s][175-l]=e[o]>>4,this.data[s][175-(l+1)]=e[o]%16}this.reDraw(16);let t={};for(let o=0;o<264;o++)for(let s=0;s<176;s++)t[this.data[o][s]]?t[this.data[o][s]]++:t[this.data[o][s]]=1;console.log(t)}}postBinTo(e="/list"){fetch(e,{body:new Uint8Array(this.binData.binData).buffer,method:"POST",cache:"no-cache",headers:{"user-agent":"Mozilla/4.0 MDN Example","content-type":"application/json"}}).then(t=>t.text()).then(console.log)}drawTxtLine(e="this is a test!",t=0,o=0,s=48,l=!0,r=this.paper.w,h=this.paper.h){var c;let _={height:s+2,width:this.getFontWidth(e,s)};_.height<h-o&&_.width<r-t?(l&&((c=this.ctx)==null||c.clearRect(t,o+2,_.width,_.height-2)),this.draw(e,t,o+s,s)):this.drawTxtLine(e,t,o,s-1,l,r,h)}drawTxtＷrap(e="this is a test!",t=24,o=!0,s=16,l=16,r=32,h=32){let _={height:t+2,width:this.getFontWidth(e,t)},c=_.width/e.length,m=Math.floor((h-l)/_.height),d=Math.floor((r-s)/c);if(m*d<e.length)this.drawTxtＷrap(e,t-1,o,s,l,r,h);else for(let g=0;g<m&&l+_.height*(g+1)-t<h;g++)this.drawTxtLine(e.substr(g*d,d),s,l+_.height*g,t,o)}}function lt(n){let e,t,o,s;return{c(){e=p("textarea"),k(e,"class","txtbox svelte-5hb4rz"),e.readOnly=!0,k(e,"style",t="letter-spacing :"+(n[10][1]==="Chrome"?"1px":"-1px")+"; background:"+(n[7].pos.focus?"orange":"none")+"; cursor:move; padding:0;font-size:"+n[7].fs+"px; left:"+n[7].pos.x+"px;top:"+n[7].pos.y+"px;height:"+n[7].pos.h+"px;width:"+n[7].pos.w+"px;")},m(l,r){E(l,e,r),Be(e,n[7].value),o||(s=[S(e,"input",n[16]),S(e,"mousedown",A(T(n[17]))),S(e,"mousemove",A(T(n[18]))),S(e,"touchstart",A(T(n[19]))),S(e,"touchmove",A(T(n[20])))],o=!0)},p(l,r){r[0]&128&&t!==(t="letter-spacing :"+(l[10][1]==="Chrome"?"1px":"-1px")+"; background:"+(l[7].pos.focus?"orange":"none")+"; cursor:move; padding:0;font-size:"+l[7].fs+"px; left:"+l[7].pos.x+"px;top:"+l[7].pos.y+"px;height:"+l[7].pos.h+"px;width:"+l[7].pos.w+"px;")&&k(e,"style",t),r[0]&128&&Be(e,l[7].value)},d(l){l&&X(e),o=!1,ke(s)}}}function ot(n){let e,t,o,s,l,r,h,_,c,m,d,g,x,D,C,a,b;return{c(){e=p("div"),t=z(),o=p("div"),s=z(),l=p("div"),r=z(),h=p("div"),_=z(),c=p("div"),m=z(),d=p("div"),g=z(),x=p("div"),D=z(),C=p("div"),a=z(),b=p("div"),k(e,"class","maskgrid svelte-5hb4rz"),k(o,"class","maskgrid svelte-5hb4rz"),k(l,"class","maskgrid svelte-5hb4rz"),k(h,"class","maskgrid svelte-5hb4rz"),k(c,"class","maskgrid svelte-5hb4rz"),k(d,"class","maskgrid svelte-5hb4rz"),k(x,"class","maskgrid svelte-5hb4rz"),k(C,"class","maskgrid svelte-5hb4rz"),k(b,"class","maskgrid svelte-5hb4rz")},m(f,v){E(f,e,v),E(f,t,v),E(f,o,v),E(f,s,v),E(f,l,v),E(f,r,v),E(f,h,v),E(f,_,v),E(f,c,v),E(f,m,v),E(f,d,v),E(f,g,v),E(f,x,v),E(f,D,v),E(f,C,v),E(f,a,v),E(f,b,v)},d(f){f&&X(e),f&&X(t),f&&X(o),f&&X(s),f&&X(l),f&&X(r),f&&X(h),f&&X(_),f&&X(c),f&&X(m),f&&X(d),f&&X(g),f&&X(x),f&&X(D),f&&X(C),f&&X(a),f&&X(b)}}}function At(n){let e,t,o,s,l,r,h,_,c,m,d,g,x,D,C,a,b,f,v,I,Ce,ie,je,Y,B,Ee,Ae,We,re,Te,y,G,q,V,H,U,J,K,Q,Z,$,ee,te,ne,le,oe,se,i,j,W,O,N,ae,fe,ue,ce,he,pe,de,_e,me,ge,Ve,De,He,Se,Ue,ze,Je,Me,Ke,Oe,ve,Qe,Re,Ne,Ze,F=n[7].value&&n[10]&&lt(n),L=n[3].status==n[9].selected&&ot();return{c(){e=p("div"),t=p("div"),F&&F.c(),o=z(),s=p("div"),l=p("img"),_=z(),L&&L.c(),c=z(),m=p("div"),d=p("div"),g=p("div"),x=p("canvas"),D=z(),C=p("div"),a=p("button"),a.textContent="圖片",b=z(),f=p("button"),f.textContent="放大",v=z(),I=p("button"),I.textContent="縮小",Ce=z(),ie=p("button"),ie.textContent="上傳",je=z(),Y=p("div"),B=p("textarea"),Ee=z(),Ae=p("br"),We=z(),re=p("div"),Te=ct(`字體：
                    `),y=p("select"),G=p("option"),G.textContent="12",q=p("option"),q.textContent="13",V=p("option"),V.textContent="14",H=p("option"),H.textContent="15",U=p("option"),U.textContent="16",J=p("option"),J.textContent="17",K=p("option"),K.textContent="18",Q=p("option"),Q.textContent="19",Z=p("option"),Z.textContent="20",$=p("option"),$.textContent="21",ee=p("option"),ee.textContent="22",te=p("option"),te.textContent="23",ne=p("option"),ne.textContent="24",le=p("option"),le.textContent="25",oe=p("option"),oe.textContent="26",se=p("option"),se.textContent="27",i=p("option"),i.textContent="28",j=p("option"),j.textContent="29",W=p("option"),W.textContent="30",O=p("option"),O.textContent="31",N=p("option"),N.textContent="32",ae=p("option"),ae.textContent="33",fe=p("option"),fe.textContent="34",ue=p("option"),ue.textContent="35",ce=p("option"),ce.textContent="36",he=p("option"),he.textContent="37",pe=p("option"),pe.textContent="38",de=p("option"),de.textContent="39",_e=p("option"),_e.textContent="40",me=p("option"),me.textContent="41",ge=p("option"),ge.textContent="42",Ve=z(),De=p("button"),De.textContent="上",He=z(),Se=p("button"),Se.textContent="下",Ue=z(),ze=p("button"),ze.textContent="左",Je=z(),Me=p("button"),Me.textContent="右",Ke=z(),Oe=p("div"),ve=p("input"),Qe=z(),Re=p("div"),et(l.src,r=n[2])||k(l,"src",r),k(l,"width",h=n[3].w+"px"),k(l,"alt",""),w(l,"filter","grayscale(0.9)"),k(l,"class","svelte-5hb4rz"),k(s,"class","imgbox svelte-5hb4rz"),w(s,"top",n[3].pos.y+"px"),w(s,"left",n[3].pos.x+"px"),w(s,"width",n[3].w+"px"),w(s,"height",n[3].h+"px"),k(t,"class","mask svelte-5hb4rz"),k(x,"width","264"),k(x,"height","176"),w(x,"display","none"),w(x,"filter","grayscale(0.9)"),k(x,"class","svelte-5hb4rz"),w(g,"margin","0 auto"),w(g,"width","100%"),k(a,"class","svelte-5hb4rz"),k(f,"class","svelte-5hb4rz"),k(I,"class","svelte-5hb4rz"),k(ie,"class","svelte-5hb4rz"),w(C,"display","flex"),w(C,"justify-content","space-between"),w(B,"width","96%"),w(B,"height","60px"),w(B,"margin","auto"),w(B,"resize","none"),G.__value="12",G.value=G.__value,q.__value="13",q.value=q.__value,V.__value="14",V.value=V.__value,H.__value="15",H.value=H.__value,U.__value="16",U.value=U.__value,J.__value="17",J.value=J.__value,K.__value="18",K.value=K.__value,Q.__value="19",Q.value=Q.__value,Z.__value="20",Z.value=Z.__value,$.__value="21",$.value=$.__value,ee.__value="22",ee.value=ee.__value,te.__value="23",te.value=te.__value,ne.__value="24",ne.value=ne.__value,le.__value="25",le.value=le.__value,oe.__value="26",oe.value=oe.__value,se.__value="27",se.value=se.__value,i.__value="28",i.value=i.__value,j.__value="29",j.value=j.__value,W.__value="30",W.value=W.__value,O.__value="31",O.value=O.__value,N.__value="32",N.value=N.__value,ae.__value="33",ae.value=ae.__value,fe.__value="34",fe.value=fe.__value,ue.__value="35",ue.value=ue.__value,ce.__value="36",ce.value=ce.__value,he.__value="37",he.value=he.__value,pe.__value="38",pe.value=pe.__value,de.__value="39",de.value=de.__value,_e.__value="40",_e.value=_e.__value,me.__value="41",me.value=me.__value,ge.__value="42",ge.value=ge.__value,n[7].fs===void 0&&Ie(()=>n[34].call(y)),w(re,"float","right"),k(De,"class","sbtn svelte-5hb4rz"),k(Se,"class","sbtn svelte-5hb4rz"),k(ze,"class","sbtn svelte-5hb4rz"),k(Me,"class","sbtn svelte-5hb4rz"),w(Y,"display","block"),w(Y,"margin-top","5px"),k(ve,"type","file"),k(ve,"accept",".png,.gif,.jpg"),w(Oe,"display","none "),w(d,"margin","30px auto"),w(d,"width",n[1]*.75+"px"),w(d,"margin","0 auto"),w(d,"background","none"),w(Re,"height","200px"),w(Re,"background","none"),w(m,"height","100%"),w(m,"overflow","auto"),w(m,"background","none"),w(e,"--pw",n[1]+"px"),w(e,"width",n[1]+"px"),w(e,"overflow","hidden"),w(e,"display",n[0]),w(e,"height","100%"),w(e,"background","none")},m(M,R){E(M,e,R),u(e,t),F&&F.m(t,null),u(t,o),u(t,s),u(s,l),n[21](l),u(t,_),L&&L.m(t,null),n[23](t),u(e,c),u(e,m),u(m,d),u(d,g),u(g,x),n[28](x),u(d,D),u(d,C),u(C,a),u(C,b),u(C,f),u(C,v),u(C,I),u(C,Ce),u(C,ie),u(d,je),u(d,Y),u(Y,B),Be(B,n[7].value),u(Y,Ee),u(Y,Ae),u(Y,We),u(Y,re),u(re,Te),u(re,y),u(y,G),u(y,q),u(y,V),u(y,H),u(y,U),u(y,J),u(y,K),u(y,Q),u(y,Z),u(y,$),u(y,ee),u(y,te),u(y,ne),u(y,le),u(y,oe),u(y,se),u(y,i),u(y,j),u(y,W),u(y,O),u(y,N),u(y,ae),u(y,fe),u(y,ue),u(y,ce),u(y,he),u(y,pe),u(y,de),u(y,_e),u(y,me),u(y,ge),tt(y,n[7].fs),u(Y,Ve),u(Y,De),u(Y,He),u(Y,Se),u(Y,Ue),u(Y,ze),u(Y,Je),u(Y,Me),u(d,Ke),u(d,Oe),u(Oe,ve),n[39](ve),u(m,Qe),u(m,Re),Ne||(Ze=[S(l,"load",n[22]),S(t,"mousedown",A(T(n[24]))),S(t,"mousemove",A(T(n[25]))),S(t,"touchstart",A(T(n[26]))),S(t,"touchmove",A(T(n[27]))),S(a,"mousedown",A(Tt)),S(a,"mousedown",A(Ot)),S(a,"click",A(T(n[29]))),S(f,"mousedown",A(Rt)),S(f,"click",A(T(n[30]))),S(I,"click",A(T(n[31]))),S(ie,"click",A(T(n[32]))),S(B,"input",n[33]),S(B,"keyup",n[11]),S(y,"change",n[34]),S(y,"change",n[11]),S(De,"click",A(T(n[35]))),S(Se,"click",A(T(n[36]))),S(ze,"click",A(T(n[37]))),S(Me,"click",A(T(n[38]))),S(ve,"change",n[12]),S(e,"mouseup",n[40]),S(e,"touchend",n[41])],Ne=!0)},p(M,R){M[7].value&&M[10]?F?F.p(M,R):(F=lt(M),F.c(),F.m(t,o)):F&&(F.d(1),F=null),R[0]&4&&!et(l.src,r=M[2])&&k(l,"src",r),R[0]&8&&h!==(h=M[3].w+"px")&&k(l,"width",h),R[0]&8&&w(s,"top",M[3].pos.y+"px"),R[0]&8&&w(s,"left",M[3].pos.x+"px"),R[0]&8&&w(s,"width",M[3].w+"px"),R[0]&8&&w(s,"height",M[3].h+"px"),M[3].status==M[9].selected?L||(L=ot(),L.c(),L.m(t,null)):L&&(L.d(1),L=null),R[0]&128&&Be(B,M[7].value),R[0]&128&&tt(y,M[7].fs),R[0]&2&&w(d,"width",M[1]*.75+"px"),R[0]&2&&w(e,"--pw",M[1]+"px"),R[0]&2&&w(e,"width",M[1]+"px"),R[0]&1&&w(e,"display",M[0])},i:xe,o:xe,d(M){M&&X(e),F&&F.d(),n[21](null),L&&L.d(),n[23](null),n[28](null),n[39](null),Ne=!1,ke(Ze)}}}function st(n,e){switch(e.status){case 1:e.pos.x+=n.screenX-e.offset.x,e.pos.y+=n.screenY-e.offset.y,e.pos.y>window.innerWidth*.66&&(e.pos.y=window.innerWidth*.66),e.offset.x=n.screenX,e.offset.y=n.screenY;break;case 2:e.w+=n.screenX-e.offset.x,e.h+=n.screenY-e.offset.y,e.offset.x=n.screenX,e.offset.y=n.screenY;break;case 5:e.w-=n.screenX-e.offset.x,e.h-=n.screenY-e.offset.y,e.pos.x+=n.screenX-e.offset.x,e.pos.y+=n.screenY-e.offset.y,e.offset.x=n.screenX,e.offset.y=n.screenY;break;case 4:e.w+=n.screenX-e.offset.x,e.h-=n.screenY-e.offset.y,e.pos.y+=n.screenY-e.offset.y,e.offset.x=n.screenX,e.offset.y=n.screenY;break;case 3:e.w-=n.screenX-e.offset.x,e.h+=n.screenY-e.offset.y,e.pos.x+=n.screenX-e.offset.x,e.offset.x=n.screenX,e.offset.y=n.screenY;break}}function Wt(n,e){let t=n/e.touches;e.pos.x=t/2,e.pos.y=t/3,e.r*=1+t/e.w,e.w+=t,e.h+=2*t/3,e.touches=n}function it(n,e,t){t.status=e,t.offset.x=n.screenX,t.offset.y=n.screenY}function rt(n){return Math.sqrt((n[0].screenX-n[1].screenX)*(n[0].screenX-n[1].screenX)+(n[0].screenY-n[1].screenY)*(n[0].screenY-n[1].screenY))}const Tt=n=>{},Ot=n=>{},Rt=n=>{};function Ft(n,e,t){let o;var s=(i=>(i[i.none=0]="none",i[i.selected=1]="selected",i[i.selectbr=2]="selectbr",i[i.selectbl=3]="selectbl",i[i.selecttr=4]="selecttr",i[i.selecttl=5]="selecttl",i))(s||{});let l={lastev:0,touches:0,w:200,h:200,or:1,r:1,status:0,offset:{x:0,y:0},pos:{x:0,y:0}},r,h,_,c,m,{display:d="block"}=e,{user:g="test"}=e,{mac:x="test"}=e,{pageWide:D=300}=e,C=navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[],a={pos:{x:30,y:30,w:40,h:20,ox:0,oy:0,focus:!1},value:"",fs:24};function b(){let i=a.value.split(`
`),j=Math.min(Math.max(12,a.fs),72);t(7,a.pos.h=(i.length+.5)*(j+1)*1.1,a),t(7,a.pos.w=i.reduce((W,O)=>{let N=c.getFontWidth(O,j)+O.length+10;return N>W?N:W},0),a)}function f(i){let j=i.target.files[0],W=new FileReader;W.readAsDataURL(j),W.onload=O=>{t(2,o=O.target.result)}}Ct(()=>{h=r.getContext("2d"),c=new Et(h),window.epd=c,window.img=v});let v;function I(){console.log({n:v.naturalWidth,n2:D});let i=v.naturalWidth/l.r,j=i*176/264,W=0-l.pos.x*l.or/l.r,O=0-l.pos.y*l.or/l.r;h.clearRect(0,0,264,176),h.fillStyle="#FFF",h.fillRect(0,0,264,176),h.drawImage(v,W,O,i,j,0,0,264,176)}function Ce(){I(),a.value.split(`
`).forEach((W,O)=>{c.draw(W,a.pos.x,a.pos.y+1.18*O*a.fs,a.fs,"black")});let j=new FormData;j.append("file",new Blob([new Uint8Array(c.genGSBinData(16,1).binData.binData)]),"test.png"),fetch("/draw",{body:j,method:"POST"}).then(W=>W.text()).then(console.log)}function ie(){a.value=this.value,t(7,a)}const je=i=>{t(7,a.pos.focus=!0,a),t(7,a.pos.ox=i.screenX,a),t(7,a.pos.oy=i.screenY,a)},Y=i=>{a.pos.focus&&(t(7,a.pos.x+=i.screenX-a.pos.ox,a),t(7,a.pos.y+=i.screenY-a.pos.oy,a),t(7,a.pos.ox=i.screenX,a),t(7,a.pos.oy=i.screenY,a))},B=i=>{t(7,a.pos.focus=!0,a),t(7,a.pos.ox=i.touches[0].screenX,a),t(7,a.pos.oy=i.touches[0].screenY,a)},Ee=i=>{a.pos.focus&&(t(7,a.pos.x+=i.touches[0].screenX-a.pos.ox,a),t(7,a.pos.y+=i.touches[0].screenY-a.pos.oy,a),t(7,a.pos.ox=i.touches[0].screenX,a),t(7,a.pos.oy=i.touches[0].screenY,a))};function Ae(i){be[i?"unshift":"push"](()=>{v=i,t(8,v)})}const We=i=>{t(3,l={lastev:0,touches:0,w:200,h:200,or:1,r:1,status:s.none,offset:{x:0,y:0},pos:{x:0,y:0}}),t(3,l.w=D*.81,l),t(3,l.h=l.w*i.target.height/i.target.width,l),t(3,l.or=v.naturalWidth/l.w,l),t(3,l.r=1,l)};function re(i){be[i?"unshift":"push"](()=>{_=i,t(5,_)})}const Te=i=>{it(i,s.selected,l)},y=i=>{st(i,l)},G=i=>{if(i.timeStamp-l.lastev<500){let j=window.screen.width*.9;l.w>j?(t(3,l.pos.x=0,l),t(3,l.pos.y=0,l)):(t(3,l.pos.x=(j-l.w)/2,l),t(3,l.pos.y=0,l))}t(3,l.lastev=i.timeStamp,l),i.touches.length==1?it(i.touches[0],s.selected,l):i.touches.length==2&&t(3,l.touches=rt(i.touches),l)},q=i=>{i.touches.length==1?st(i.touches[0],l):i.touches.length==2&&Wt(rt(i.touches),l),t(3,l)};function V(i){be[i?"unshift":"push"](()=>{r=i,t(4,r)})}const H=()=>{m.click()},U=i=>{t(3,l.pos.x-=9,l),t(3,l.pos.y-=6,l),t(3,l.r*=1+18/l.w,l),t(3,l.w+=18,l),t(3,l.h+=12,l),t(3,l)},J=i=>{t(3,l.pos.x+=9,l),t(3,l.pos.y+=6,l),t(3,l.r*=1-18/l.w,l),t(3,l.w-=18,l),t(3,l.h-=12,l),t(3,l)},K=()=>{Ce()};function Q(){a.value=this.value,t(7,a)}function Z(){a.fs=xt(this),t(7,a)}const $=i=>{t(7,a.pos.y-=3,a)},ee=i=>{t(7,a.pos.y+=3,a)},te=i=>{t(7,a.pos.x-=5,a)},ne=i=>{t(7,a.pos.x+=5,a)};function le(i){be[i?"unshift":"push"](()=>{m=i,t(6,m)})}const oe=i=>{t(3,l.status=s.none,l),t(7,a.pos.focus=!1,a),console.log(a.pos)},se=i=>{t(3,l.status=s.none,l),t(7,a.pos.focus=!1,a)};return n.$$set=i=>{"display"in i&&t(0,d=i.display),"user"in i&&t(14,g=i.user),"mac"in i&&t(15,x=i.mac),"pageWide"in i&&t(1,D=i.pageWide)},[d,D,o,l,r,_,m,a,v,s,C,b,f,Ce,g,x,ie,je,Y,B,Ee,Ae,We,re,Te,y,G,q,V,H,U,J,K,Q,Z,$,ee,te,ne,le,oe,se]}class Lt extends gt{constructor(e){super(),mt(this,e,Ft,At,ut,{display:0,user:14,mac:15,pageWide:1},null,[-1,-1])}}function Pt(n){let e,t;return e=new Lt({}),{c(){Yt(e.$$.fragment)},m(o,s){dt(e,o,s),t=!0},p:xe,i(o){t||(pt(e.$$.fragment,o),t=!0)},o(o){Xt(e.$$.fragment,o),t=!1},d(o){_t(e,o)}}}function Bt(n){return[]}class It extends gt{constructor(e){super(),mt(this,e,Bt,Pt,ut,{})}}new It({target:document.getElementById("app")});
