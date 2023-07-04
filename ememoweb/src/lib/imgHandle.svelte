<script lang="ts">
    import { onMount } from "svelte";
    import {EPD} from "./epd";
    let avatar;
    enum status_t { "none", "selected", "selectbr", "selectbl", "selecttr", "selecttl", }
    type box_t = { lastev: number; touches: number; or: number; r: number; w: number; h: number; status: status_t; offset: { x: number; y: number }; pos: { x: number; y: number }; };
    let imgbox: box_t = { lastev: 0, touches: 0, w: 200, h: 200, or: 1, r: 1, status: status_t.none, offset: { x: 0, y: 0 }, pos: { x: 0, y: 0 }, };
    let reslutCanvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let divContainer:HTMLDivElement;
    let epd: EPD;
    let btnselectfile:HTMLInputElement;
    export let display='block';
    export let user = 'test';
    export let mac = 'test';
    export let pageWide = 300;
    let browrVersion = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let msg = {pos:{x:30,y:30,w:40,h:20,ox:0,oy:0,focus:false},value:"",fs:24};
    function msgChange(){
        let lines = msg.value.split("\n");
        let fs = Math.min(Math.max(12,msg.fs),72);
        msg.pos.h = (lines.length+0.5) *(fs+1)*1.1;
        msg.pos.w = lines.reduce((a,b)=>{
            let fw = epd.getFontWidth(b,fs)+b.length+10;
            if (fw>a) return fw;else return a 
        },0)
    }

    function onChange(e) {
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            avatar = e.target.result;
        };
    }
    function resize(e,box) {
        switch (box.status) {
            case status_t.selected:
                box.pos.x += e.screenX - box.offset.x;
                box.pos.y += e.screenY - box.offset.y;
                if (box.pos.y > window.innerWidth * 0.66)
                    box.pos.y = window.innerWidth * 0.66;
                box.offset.x = e.screenX;
                box.offset.y = e.screenY;
                break;
            case status_t.selectbr:
                box.w += e.screenX - box.offset.x;
                box.h += e.screenY - box.offset.y;
                box.offset.x = e.screenX;
                box.offset.y = e.screenY;
                break;
            case status_t.selecttl:
                box.w -= e.screenX - box.offset.x;
                box.h -= e.screenY - box.offset.y;
                box.pos.x += e.screenX - box.offset.x;
                box.pos.y += e.screenY - box.offset.y;
                box.offset.x = e.screenX;
                box.offset.y = e.screenY;
                break;
            case status_t.selecttr:
                box.w += e.screenX - box.offset.x;
                box.h -= e.screenY - box.offset.y;
                // box.pos.x +=  e.screenX - box.offset.x;
                box.pos.y += e.screenY - box.offset.y;
                box.offset.x = e.screenX;
                box.offset.y = e.screenY;
                break;
            case status_t.selectbl:
                box.w -= e.screenX - box.offset.x;
                box.h += e.screenY - box.offset.y;
                box.pos.x += e.screenX - box.offset.x;
                // box.pos.y +=  e.screenY - box.offset.y;
                box.offset.x = e.screenX;
                box.offset.y = e.screenY;
                break;

            default:
                break;
        }
    }
    function resize2(n,box) {
        let r = n / box.touches;
        // if (r>1 && box.h>1024) return;
        box.pos.x = r / 2;
        box.pos.y = r / 3;
        box.r *= 1+ r/box.w;
        box.w += r;
        box.h += 2*r/3;
        box.touches = n;
    }
    function selectType(e, type: status_t,box) {
        box.status = type;
        box.offset.x = e.screenX;
        box.offset.y = e.screenY;
    }
    function dist(e) {
        return Math.sqrt(
            (e[0].screenX - e[1].screenX) * (e[0].screenX - e[1].screenX) +
                (e[0].screenY - e[1].screenY) * (e[0].screenY - e[1].screenY)
        );
    }
    onMount(() => {
        ctx = reslutCanvas.getContext("2d");
        // ctx.letterSpacing = "1px";//safario no support
        epd = new EPD(ctx);

        window['epd'] = epd;
        window['img'] = imgN;
    });
    let imgN: HTMLImageElement;
    function getSnap() {
        console.log({n:imgN.naturalWidth,n2:pageWide})
        let sWidth = imgN.naturalWidth / imgbox.r;
        let sHeight = (sWidth * 176) / 264;
        let sx = 0 - (imgbox.pos.x * imgbox.or) / imgbox.r;
        let sy = 0 - (imgbox.pos.y * imgbox.or) / imgbox.r;
        ctx.clearRect(0, 0, 264, 176);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0,0,264,176);
        ctx.drawImage(imgN, sx, sy, sWidth, sHeight, 0, 0, 264, 176);
    }
    function genGS16(){
        getSnap();
        let lines = msg.value.split('\n');
        lines.forEach((txt,i)=>{
            epd.draw(txt,msg.pos.x,msg.pos.y+1.18*(i)*msg.fs,msg.fs,"black");
        });
        let bb = new FormData();
        bb.append("file", new Blob([new Uint8Array(epd.genGSBinData(16,1).binData.binData)]),"test.png");
        fetch("/draw",
        {
            body: bb, // must match 'Content-Type' header
            method:'POST',
        }).then(r=>r.text()).then(console.log);
    };

    function upload(binSet){
        console.log(`https://coffreedom.com/epd/setEpdSolt?mac=${mac}&user=${user}`);
        fetch(`https://coffreedom.com/epd/setEpdSolt?mac=${mac}&user=${user}`,
        {
            body: JSON.stringify({data:binSet}), // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        }).then(r=>r.text()).then(console.log);
    };
    
</script>

<div style="--pw:{pageWide}px;width:{pageWide}px;overflow:hidden;display:{display};height:100%; background:none;" 
on:mouseup={(e) => {imgbox.status = status_t.none;msg.pos.focus = false; console.log(msg.pos)}} 
on:touchend={(e) => {imgbox.status = status_t.none;msg.pos.focus = false; }} 
>
    <div class="mask" bind:this={divContainer} 
        on:mousedown|stopPropagation|preventDefault={(e) => { selectType(e, status_t.selected,imgbox); }}
        on:mousemove|stopPropagation|preventDefault={e=>{resize(e,imgbox)}}
        on:touchstart|stopPropagation|preventDefault={(e) => {
            if (e.timeStamp - imgbox.lastev < 500) {
                let ww = window.screen.width * 0.9;
                if (imgbox.w > ww) {
                    imgbox.pos.x = 0;
                    imgbox.pos.y = 0;
                } else {
                    imgbox.pos.x = (ww - imgbox.w) / 2;
                    imgbox.pos.y = 0;
                }
            }
            imgbox.lastev = e.timeStamp;
            if (e.touches.length == 1) selectType(e.touches[0], status_t.selected,imgbox);
            else if (e.touches.length == 2) imgbox.touches = dist(e.touches);
        }}
        on:touchmove|stopPropagation|preventDefault={(e) => {
            if (e.touches.length == 1) resize(e.touches[0],imgbox);
            else if (e.touches.length == 2) resize2(dist(e.touches),imgbox);
            imgbox = imgbox;
        }}
    >
        {#if msg.value && browrVersion}
        <textarea class = "txtbox" readonly style="letter-spacing :{browrVersion[1]==='Chrome'?"1px":"-1px"}; background:{msg.pos.focus?"orange":"none"}; cursor:move; padding:0;font-size:{msg.fs}px; left:{msg.pos.x}px;top:{msg.pos.y}px;height:{msg.pos.h}px;width:{msg.pos.w}px;" bind:value={msg.value}
            on:mousedown|stopPropagation|preventDefault={(e) => { 
                    msg.pos.focus = true;
                    msg.pos.ox = e.screenX;
                    msg.pos.oy = e.screenY;
                }}
            on:mousemove|stopPropagation|preventDefault={e=>{
                if (msg.pos.focus){
                    msg.pos.x += e.screenX - msg.pos.ox;
                    msg.pos.y += e.screenY - msg.pos.oy;
                    msg.pos.ox = e.screenX;
                    msg.pos.oy = e.screenY;
                } 
            }}
            on:touchstart|stopPropagation|preventDefault={(e) => {
                    msg.pos.focus = true;
                    msg.pos.ox = e.touches[0].screenX;
                    msg.pos.oy = e.touches[0].screenY;
            }}
            on:touchmove|stopPropagation|preventDefault={(e) => {
                if (msg.pos.focus){
                    msg.pos.x += e.touches[0].screenX - msg.pos.ox;
                    msg.pos.y += e.touches[0].screenY - msg.pos.oy;
                    msg.pos.ox = e.touches[0].screenX;
                    msg.pos.oy = e.touches[0].screenY;
                } 
            }}
            
        
        ></textarea>
        {/if}
        <div class="imgbox" style="top:{imgbox.pos.y}px;left:{imgbox.pos.x}px;width:{imgbox.w}px;height:{imgbox.h}px" >
            <img bind:this={imgN} src={avatar} width={imgbox.w}px alt="" style="filter:grayscale(0.9)"
                on:load={(e) => {
                    imgbox = { lastev: 0, touches: 0, w: 200, h: 200, or: 1, r: 1, status: status_t.none, offset: { x: 0, y: 0 }, pos: { x: 0, y: 0 }, };
                    // if (e.target["width"] / e.target["height"] > 0.66) {
                        imgbox.w = pageWide * 0.81;
                        imgbox.h =
                            (imgbox.w * e.target["height"]) / e.target["width"];
                        imgbox.or = imgN.naturalWidth / imgbox.w;
                        imgbox.r = 1;
                    // } else {
                    //     imgbox.h = pageWide * 0.64;
                    //     imgbox.w = (imgbox.h * e.target["width"]) / e.target["height"];
                    //     imgbox.or = imgN.naturalHeight / imgbox.h;
                    //     imgbox.r = 1;
                    // }
                }}
            />
        </div>
        {#if imgbox.status == status_t.selected}
            <div class="maskgrid" /> <div class="maskgrid" /> <div class="maskgrid" /> 
            <div class="maskgrid" /> <div class="maskgrid" /> <div class="maskgrid" /> 
            <div class="maskgrid" /> <div class="maskgrid" /> <div class="maskgrid" />
        {/if}
    </div>
    <div style="height: 100%;overflow:scroll; background:none;">
        <div style="margin: 30px auto; width:{pageWide*0.75}px;margin:0 auto;background:none;">
            <div style="margin: 0 auto; width:100%;">
                <canvas
                    bind:this={reslutCanvas}
                    width="264"
                    height="176"
                    style="display:none;filter:grayscale(0.9);"
                />
            </div>    
            <div style="display:flex; justify-content:space-between;">
                <button 
                on:mousedown|stopPropagation={e=>{}}
                on:mousedown|stopPropagation={e=>{}}    
                on:click|stopPropagation|preventDefault={()=>{btnselectfile.click();}} >圖片
                </button>
                <button 
                    on:mousedown|stopPropagation={e=>{}}
                    on:click|stopPropagation|preventDefault={e=>{
                        imgbox.pos.x -= 9;
                        imgbox.pos.y -= 6;
                        imgbox.r *= 1+(18/imgbox.w);
                        imgbox.w += 18;
                        imgbox.h += 12;
                        imgbox = imgbox;
                    }} >放大
                </button>
                <button 
                    on:click|stopPropagation|preventDefault={e=>{
                        imgbox.pos.x += 9;
                        imgbox.pos.y += 6;
                        imgbox.r *= 1-(18/imgbox.w);
                        imgbox.w -= 18;
                        imgbox.h -= 12;
                        imgbox = imgbox;
                    }} >縮小
                </button>
        
                <button 
                on:click|stopPropagation|preventDefault={()=>{genGS16()}} >上傳
                </button>
            </div>
            <div style="display:block;margin-top:5px;">
                <textarea style="width: 96%;height:60px; margin:auto; resize:none" bind:value={msg.value}
                    on:keyup={msgChange}
                ></textarea>
                <br>
                <div style="float:right;">
                    字體：
                    <select bind:value={msg.fs} on:change={msgChange}>
                        <option>12</option> <option>13</option> <option>14</option> <option>15</option> <option>16</option> <option>17</option> <option>18</option> <option>19</option> <option>20</option>
                        <option>21</option> <option>22</option> <option>23</option> <option>24</option> <option>25</option> <option>26</option> <option>27</option> <option>28</option> <option>29</option> <option>30</option>
                        <option>31</option> <option>32</option> <option>33</option> <option>34</option> <option>35</option> <option>36</option> <option>37</option> <option>38</option> <option>39</option>
                        <option>40</option> <option>41</option> <option>42</option>
                    </select>
                    <!-- <input type="number" bind:value={msg.fs} max=72 min=12 on:change={msgChange}> -->
                </div>
                <button class='sbtn' on:click|stopPropagation|preventDefault={e=>{msg.pos.y-=3}} >上</button>
                <button class='sbtn' on:click|stopPropagation|preventDefault={e=>{msg.pos.y+=3}} >下</button>
                <button class='sbtn' on:click|stopPropagation|preventDefault={e=>{msg.pos.x-=5}} >左</button>
                <button class='sbtn' on:click|stopPropagation|preventDefault={e=>{msg.pos.x+=5}} >右</button>
    
            </div>
            <!-- <p style="margin:0 auto; margin-top:20px;text-align:center; color:#888888">推薦解析度 264 * 176</p> -->
            <div style="display:none ;">
                <input on:change={onChange} type="file" accept=".png,.gif,.jpg" bind:this={btnselectfile}/>
            </div>
        </div>
        <div style="height:200px;background:none;"></div>        
    </div>
</div>



<style>
    img {
        border: 1px solid none;
    }
    .imgbox{
        position: absolute;
        z-index: 1;
    }
    .txtbox{
        font-feature-settings: "kern";
        font-weight: 400;
        position: absolute;
        border: none;
        resize: none;
        font-family: 'Arial';
        line-height: 1.2;
        letter-spacing : 1px;
        z-index: 2;
        opacity: 0.6;
    }


    button{
        border:none;
        border-radius:50%;
        height:calc(var(--pw) * 0.18);
        width:calc(var(--pw) * 0.18); 
        font-size:large;
        color:white;
        cursor: pointer;
        padding: 0px;
        background:#FF8800;
    }
    .sbtn{
        /* font-size: smaller; */
        padding: 0px;
        height:calc(var(--pw) * 0.09);
        width:calc(var(--pw) * 0.09); 
    }

    .mask {
        --px: 100px;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        margin: 0px auto;
        height: calc(var(--pw) * 0.54);
        width: calc(var(--pw) * 0.81);
        overflow: hidden;
        border: 2px solid #ccc;
        z-index: 2;
        margin-bottom: 20px; 
        top:10px;
    }
    .maskgrid {
        height: calc(33.33% - 1px);
        width: calc(33.33% - 1px);
        background: none;
        border: 0.5px solid #ccc;
        z-index: 2;
    }
    canvas {
        margin:0 auto;
        margin-top:10px;
        display:block; 
    }
</style>
