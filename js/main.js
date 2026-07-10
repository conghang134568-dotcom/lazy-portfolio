/* ============================================
   Design Portfolio — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // ===== 手机端间距修正（UA 检测 + viewport=1280，仅真手机生效）=====
    const isPhone = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    if (isPhone) {
        const gal = document.querySelector('.top-gallery');
        if (gal) gal.style.height = '45vh';
        // overlay 放大 20%
        const overlay = document.querySelector('.gallery-cap-overlay');
        if (overlay) overlay.style.width = '48%';
        // 等封面定位完成后，收窄年份与封面间距 + 精确项目区高度
        setTimeout(() => {
            const grid = document.querySelector('.editorial-grid');
            if (!grid) return;
            const shift = window.innerHeight * 0.06;
            const covers = grid.querySelectorAll('.grid-project-img');
            covers.forEach(c => {
                const t = parseFloat(c.style.top);
                if (t) c.style.top = (t - shift) + 'px';
            });
            // 项目文字同步上移
            const info = grid.querySelector('.grid-project-info');
            if (info) {
                const it = parseFloat(info.style.top);
                if (it) info.style.top = (it - shift) + 'px';
            }
            let maxBottom = 0;
            const gr = grid.getBoundingClientRect();
            covers.forEach(c => {
                const b = c.getBoundingClientRect().bottom - gr.top;
                if (b > maxBottom) maxBottom = b;
            });
            if (maxBottom > 0) grid.style.minHeight = (maxBottom + 30) + 'px';
        }, 600);
    }

    // ========== Loading Screen ==========
    const isHome = !document.querySelector('.page-project') && !document.querySelector('.project-detail');
    const navEntry = performance.getEntriesByType('navigation')[0];
    const isReload = navEntry && navEntry.type === 'reload';
    const logoClicked = sessionStorage.getItem('show_loading') === '1';
    if (!isMobile && isHome && (isReload || logoClicked || !sessionStorage.getItem('visited'))) {
        sessionStorage.setItem('visited','1');
        sessionStorage.removeItem('show_loading');
        var loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#fafafa;z-index:99999;transition:opacity 0.6s ease;font-family:"PingFang SC","Microsoft YaHei",sans-serif';
        var corners = [
            {text:'20',top:'2rem',left:'4rem'},{text:'26',top:'2rem',right:'4rem'},
            {text:'Y',bottom:'2rem',right:'4rem'},{text:'LaZ',bottom:'2rem',left:'4rem'}
        ];
        corners.forEach(function(c){
            var el=document.createElement('div');el.textContent=c.text;
            el.style.cssText='position:absolute;font-size:120px;font-weight:700;color:#000;line-height:1;'+
                (c.top?'top:'+c.top+';':'')+(c.bottom?'bottom:'+c.bottom+';':'')+
                (c.left?'left:'+c.left+';':'')+(c.right?'right:'+c.right+';':'');
            loader.appendChild(el);
        });
        var counter=document.createElement('div');
        counter.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:120px;font-weight:700;color:#000;line-height:1';
        counter.textContent='0';loader.appendChild(counter);
        document.body.prepend(loader);
        var num=0,counterDone=false;
        function tick(){if(num>=100){counter.textContent='100';counterDone=true;finishLoader();return}
            num++;counter.textContent=num;var delay=3+(num/100)*14;setTimeout(tick,delay);}
        tick();
        var pageLoaded=false;
        function finishLoader(){if(!counterDone||!pageLoaded)return;
            setTimeout(function(){loader.style.opacity='0';setTimeout(function(){loader.remove();},600);},100);}
        window.addEventListener('load',function(){pageLoaded=true;finishLoader();});
    }

    function debounce(fn,delay){let timer;return function(...args){clearTimeout(timer);timer=setTimeout(()=>fn.apply(this,args),delay);}}

    // ========== Page Transition ==========
    const overlayEl=document.createElement('div');overlayEl.className='page-transition';document.body.appendChild(overlayEl);
    requestAnimationFrame(()=>{overlayEl.classList.add('active');requestAnimationFrame(()=>{overlayEl.classList.remove('active');});});
    document.addEventListener('click',(e)=>{
        const link=e.target.closest('a');if(!link)return;
        const href=link.getAttribute('href');
        if(!href||href.startsWith('#')||href.includes('#')||href.startsWith('mailto:')||href.startsWith('http'))return;
        if(link.target==='_blank')return;
        e.preventDefault();
        if(link.classList.contains('logo'))sessionStorage.setItem('show_loading','1');
        overlayEl.classList.add('active');
        setTimeout(()=>{window.location.href=href;},350);
    });
    window.addEventListener('pageshow',()=>{overlayEl.classList.remove('active');});

    if(typeof anime!=='undefined'&&anime.animate){anime.animate(['.nav-link','.header-char'],{opacity:[0,1],translateY:[-10,0],duration:500,ease:'outExpo'});}

    // ========== Nav click: Works & Info ==========
    document.querySelector('.nav-link[href="#gallery"]')?.addEventListener('click',function(e){
        e.preventDefault();const g=document.querySelector('.top-gallery');
        if(g){window.scrollTo({top:g.offsetHeight+window.innerHeight*0.7,behavior:'smooth'});
        setTimeout(()=>window.dispatchEvent(new Event('scroll')),800);}
    });
    document.querySelector('.nav-link[href="#info"]')?.addEventListener('click',function(e){
        e.preventDefault();const bio=document.querySelector('.grid-bio');
        if(bio){bio.scrollIntoView({behavior:'smooth',block:'start'});}
    });

    // ========== Header scroll ==========
    const header=document.querySelector('.header');
    const gallerySection=document.querySelector('.top-gallery');
    if(header&&gallerySection){
        function updateHeader(){
            const galleryBottom=gallerySection.getBoundingClientRect().bottom;
            if(galleryBottom<=0)header.classList.add('on-light');else header.classList.remove('on-light');
            const sideImg=document.querySelector('.gallery-side-img');
            const capOverlay=document.querySelector('.gallery-cap-overlay');
            const hide=galleryBottom<=0;
            if(sideImg)sideImg.style.opacity=hide?'0':'';
            if(capOverlay)capOverlay.style.display=hide?'none':'';
        }
        window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
    }

    const grid=document.querySelector('.editorial-grid');

    // ========== 项目封面点击跳转 ==========
    if(grid){const pageMap={'gridd':'project-gridd.html','guancha':'project-guancha.html','airmax3':'project-airmax.html','airmax5':'project-airmax.html','airmax-label':'project-airmax.html','airmax-label-03':'project-airmax.html'};grid.querySelectorAll('[data-project]').forEach(el=>{const project=el.dataset.project;const url=pageMap[project];if(url){el.style.cursor='pointer';el.addEventListener('click',()=>{window.location.href=url;});}});}

    // ========== 封面叠放 + 项目表hover + 逐行出现 + 2024-2026随机 ==========
    if(grid&&!isMobile){
        const coverImgs=grid.querySelectorAll('.grid-project-img[data-project]');
        const rows=document.querySelectorAll('.gpi-row');
        const yearEl=document.querySelector('.grid-year');

        // --- 封面定位 (年份文字下方，随视口缩放) ---
        function posCovers(){
            const gr=grid.getBoundingClientRect();
            const yr=yearEl.getBoundingClientRect();
            const yrHeight=yr.height;
            const top=yrHeight+0.10*window.innerHeight;
            const padLeft=parseFloat(getComputedStyle(grid).paddingLeft);
            const w=gr.width*0.5-padLeft;
            coverImgs.forEach(img=>{
                img.style.width=w+'px';
                img.style.height=w+'px';
                img.style.objectFit='cover';
                img.style.left=padLeft+'px';
                img.style.top=top+'px';
            });
        }
        setTimeout(posCovers,400);
        window.addEventListener('resize',debounce(posCovers,200));

        // --- hover行显示对应封面，其他行降透明度 ---
        const pageMap={'gridd':'project-gridd.html','guancha':'project-guancha.html','airmax3':'project-airmax.html'};
        const defaultCover=grid.querySelector('.grid-project-img[data-project="'+rows[0].dataset.target+'"]');
        if(defaultCover){defaultCover.classList.add('show');defaultCover.style.zIndex='5';}
        rows.forEach(row=>{
            row.addEventListener('mouseenter',()=>{
                rows.forEach(r=>{r.classList.add('dim');r.classList.remove('active');});
                row.classList.remove('dim');
                row.classList.add('active');
                coverImgs.forEach(img=>{img.classList.remove('show');img.style.zIndex='4';});
                const target=row.dataset.target;
                const cover=grid.querySelector('.grid-project-img[data-project="'+target+'"]');
                if(cover){cover.classList.add('show');cover.style.zIndex='5';}
            });
            row.addEventListener('click',()=>{
                const url=pageMap[row.dataset.target];
                if(url)window.location.href=url;
            });
        });

        // --- 年份字号自动校准：精确填充 LaZY↔懒 ---
        function calibrateYearSize(){
            const logoEl=document.querySelector('.logo');
            const lanEl=document.querySelector('.header-char');
            if(!logoEl||!lanEl||!yearEl||!yearEl.children.length)return;
            const targetW=lanEl.getBoundingClientRect().right-logoEl.getBoundingClientRect().left;
            // 二分法精确校准
            let lo=40,hi=800,size;
            for(let iter=0;iter<20;iter++){
                size=(lo+hi)/2;
                yearEl.style.fontSize=size+'px';
                const spans=yearEl.querySelectorAll('span');
                if(!spans.length)break;
                const w=spans[spans.length-1].getBoundingClientRect().right-spans[0].getBoundingClientRect().left;
                if(Math.abs(w-targetW)<1)break;
                if(w>targetW)hi=size;else lo=size;
            }
        }
        // 等 shuffle 创建 span 后校准
        setTimeout(calibrateYearSize,300);
        window.addEventListener('resize',debounce(()=>{
            setTimeout(calibrateYearSize,100);
        },200));
        if(yearEl&&!yearEl.dataset.shuffleInit){
            yearEl.dataset.shuffleInit='1';
            const text=yearEl.textContent;
            yearEl.textContent='';
            const chars=[];
            for(const ch of text){
                const span=document.createElement('span');
                span.textContent=ch===' '?'\u00A0':ch;
                span.style.opacity='0';
                span.style.display='inline-block';
                span.style.transition='opacity 0.2s ease';
                yearEl.appendChild(span);
                if(ch!==' ')chars.push(span);
            }
            let yearRevealed=false;
            function shuffleYear(){
                const r=yearEl.getBoundingClientRect();
                const inView=r.top<window.innerHeight*0.9&&r.bottom>0;
                if(inView&&!yearRevealed){
                    yearRevealed=true;
                    chars.forEach(c=>c.style.opacity='0');
                    const order=shuffleArray([...Array(chars.length).keys()]);
                    order.forEach((idx,i)=>{
                        setTimeout(()=>{chars[idx].style.opacity='1';},i*80+Math.random()*60);
                    });
                }
                if(!inView)yearRevealed=false;
            }
            window.addEventListener('scroll',shuffleYear,{passive:true});
            setTimeout(shuffleYear,200);
        }
    }

    // ========== Horizontal Gallery ==========
    const gallery=document.querySelector('.top-gallery');const track=document.querySelector('.gallery-track');
    if(gallery&&track){let startX=0,currentIndex=0;const cards=document.querySelectorAll('.gallery-card');const cardCount=cards.length;function snapTo(index){if(index>=cardCount)index=0;if(index<0)index=cardCount-1;currentIndex=index;track.style.transform=`translateX(${-(index*100)}vw)`;}setTimeout(()=>snapTo(0),100);window.addEventListener('resize',()=>snapTo(currentIndex));let lastX=0,moveAccum=0;function randomOther(){if(cardCount<=1)return currentIndex;let next;do{next=Math.floor(Math.random()*cardCount);}while(next===currentIndex);return next;}gallery.addEventListener('mousemove',(e)=>{if(lastX===0){lastX=e.pageX;return;}moveAccum+=Math.abs(e.pageX-lastX);lastX=e.pageX;const threshold=(currentIndex===0||currentIndex===cardCount-1)?40:20;if(moveAccum>threshold){snapTo(randomOther());moveAccum=0;}});gallery.addEventListener('mouseleave',()=>{lastX=0;moveAccum=0;});gallery.addEventListener('touchstart',(e)=>{startX=e.touches[0].pageX;},{passive:true});gallery.addEventListener('touchend',(e)=>{const diff=startX-(e.changedTouches[0]?.pageX||startX);if(Math.abs(diff)>20){if(diff>0)snapTo(currentIndex+1);else snapTo(currentIndex-1);}else{snapTo(currentIndex);}});document.addEventListener('keydown',(e)=>{if(e.key==='ArrowRight')snapTo(currentIndex+1);if(e.key==='ArrowLeft')snapTo(currentIndex-1);});}

    // ========== Footer Contact ==========
    const footerLinks=document.querySelectorAll('.footer-right a');const contactInfo={'Email':'2996709440@qq.com','WeChat':'happy02109'};footerLinks.forEach(link=>{const label=link.textContent.trim();if(!contactInfo[label])return;link.addEventListener('click',(e)=>{e.preventDefault();const showing=link.textContent.trim()===contactInfo[label];link.textContent=showing?label:contactInfo[label];});});

    // ========== Shuffle Text Reveal (仅年份使用) ==========
    function shuffleArray(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

    // ========== Bio 转为图片（5行固定比例） ==========
    const bioEl=document.querySelector('.grid-bio');
    if(bioEl&&!bioEl.dataset.bioDone){
        bioEl.dataset.bioDone='1';
        const lines=[];
        bioEl.querySelectorAll('span').forEach(s=>lines.push(s.textContent));
        const canvas=document.createElement('canvas');
        const ctx=canvas.getContext('2d');
        const fontSize=83;
        const lineH=fontSize*0.9;
        ctx.font='900 '+fontSize+'px "Helvetica Neue","PingFang SC","Microsoft YaHei",sans-serif';
        const widths=lines.map(l=>ctx.measureText(l).width);
        const maxW=Math.max(...widths);
        const totalH=lines.length*lineH;
        canvas.width=maxW;
        canvas.height=totalH;
        ctx.font='900 '+fontSize+'px "Helvetica Neue","PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillStyle='#111';
        ctx.textBaseline='top';
        lines.forEach((l,i)=>ctx.fillText(l,0,i*lineH));
        const img=document.createElement('img');
        img.src=canvas.toDataURL('image/png');
        img.alt='';
        img.style.cssText='display:block;width:100%;height:auto;opacity:0;transition:opacity 0.6s ease';
        bioEl.innerHTML='';
        bioEl.appendChild(img);
        setTimeout(()=>{img.style.opacity='1';},200);
    }

    // ========== Image Load ==========
    document.querySelectorAll('img').forEach(img=>{if(img.complete){img.classList.add('loaded');}else{img.addEventListener('load',()=>{img.classList.add('loaded');});}});

    // ========== 练习区点击放大 + 左右滑动 ==========
    const studyGrid=document.querySelector('.studies-grid');
    if(studyGrid){
        const studyImgs=[...studyGrid.querySelectorAll('img')];
        const studyNums=document.querySelectorAll('.study-num');
        let expandedIdx=-1;
        let overlayEl=null;

        function closeExpand(){
            if(overlayEl){overlayEl.remove();overlayEl=null;}
            expandedIdx=-1;
            studyNums.forEach(n=>n.classList.remove('hidden-img'));
            document.removeEventListener('keydown',onKeyNav);
        }

        function showExpanded(idx){
            expandedIdx=idx;
            studyNums.forEach(n=>n.classList.add('hidden-img'));

            // 如果已有遮罩，只更新内容不重建
            if(overlayEl){
                const imgs=overlayEl.querySelectorAll('img');
                const prevIdx=(idx-1+studyImgs.length)%studyImgs.length;
                const nextIdx=(idx+1)%studyImgs.length;
                [prevIdx,idx,nextIdx].forEach((si,i)=>{
                    imgs[i].style.opacity='0';
                    imgs[i].src=studyImgs[si].src;
                    imgs[i].onload=function(){imgs[i].style.opacity=i===1?'1':'0.5';};
                });
                // 更新导航点
                const dots=overlayEl.querySelectorAll('span');
                dots.forEach((d,i)=>{d.style.background=i===idx?'#111':'#ccc';});
                return;
            }

            overlayEl=document.createElement('div');
            overlayEl.style.cssText='position:fixed;inset:0;z-index:9998;background:#fafafa;display:flex;flex-direction:column;align-items:center';
            overlayEl.addEventListener('click',closeExpand);
            overlayEl.addEventListener('wheel',onWheel,{passive:false});
            // 手机端滑动切换
            let touchStartX=0;
            overlayEl.addEventListener('touchstart',(e)=>{touchStartX=e.touches[0].pageX;},{passive:true});
            overlayEl.addEventListener('touchend',(e)=>{
                const diff=touchStartX-(e.changedTouches[0]?.pageX||touchStartX);
                if(Math.abs(diff)>20){
                    const newIdx=(expandedIdx+(diff>0?1:-1)+studyImgs.length)%studyImgs.length;
                    showExpanded(newIdx);
                }
            });

            // 导航栏
            const navBar=document.createElement('div');
            navBar.style.cssText='display:flex;gap:12px;padding:24px 0 8px;pointer-events:none';
            studyImgs.forEach((_,i)=>{
                const dot=document.createElement('span');
                dot.style.cssText='width:8px;height:8px;border-radius:50%;background:'+(i===idx?'#111':'#ccc')+';transition:background 0.2s';
                navBar.appendChild(dot);
            });
            overlayEl.appendChild(navBar);

            // 图片行
            const imgRow=document.createElement('div');
            imgRow.style.cssText='position:relative;display:flex;align-items:center;justify-content:center;flex:1;min-height:0;width:100%';

            function makeImg(i,isMain){
                const img=document.createElement('img');
                img.src=studyImgs[i].src;
                if(isMain){
                    img.onload=function(){img.style.opacity='1';};
                    img.style.cssText='max-width:55vw;max-height:65vh;width:auto;height:auto;object-fit:contain;opacity:0;transition:opacity 0.3s ease;pointer-events:none;user-select:none';
                }
                return img;
            }

            function makeSideImg(i,side){
                const img=document.createElement('img');
                img.src=studyImgs[i].src;
                img.onload=function(){img.style.opacity='0.5';};
                img.style.cssText='position:absolute;top:50%;transform:translateY(-50%);'+side+':-2vw;max-width:22vw;max-height:35vh;width:auto;height:auto;object-fit:contain;opacity:0;transition:opacity 0.3s ease;filter:blur(6px);pointer-events:none;user-select:none';
                return img;
            }

            const prevIdx=(idx-1+studyImgs.length)%studyImgs.length;
            const nextIdx=(idx+1)%studyImgs.length;
            imgRow.appendChild(makeSideImg(prevIdx,'left'));
            imgRow.appendChild(makeImg(idx,true));
            imgRow.appendChild(makeSideImg(nextIdx,'right'));
            overlayEl.appendChild(imgRow);
            document.body.appendChild(overlayEl);
            document.addEventListener('keydown',onKeyNav);
        }

        function onWheel(e){
            e.preventDefault();
            const dir=e.deltaY>0?1:-1;
            const newIdx=(expandedIdx+dir+studyImgs.length)%studyImgs.length;
            showExpanded(newIdx);
        }

        function onKeyNav(e){
            if(e.key==='Escape'){closeExpand();return;}
            if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
                const dir=e.key==='ArrowRight'?1:-1;
                const newIdx=(expandedIdx+dir+studyImgs.length)%studyImgs.length;
                showExpanded(newIdx);
            }
        }

        studyImgs.forEach((img,i)=>{
            img.style.cursor='pointer';
            img.addEventListener('click',(e)=>{
                e.stopPropagation();
                showExpanded(i);
            });
        });
    }

    // ========== Blob Cursor ==========
    if(!isMobile && !isPhone){var blobContainer=document.createElement('div');blobContainer.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';document.body.appendChild(blobContainer);var blobs=[];var blobSizes=[28];for(var i=0;i<1;i++){var b=document.createElement('div');b.style.cssText='position:absolute;width:'+blobSizes[i]+'px;height:'+blobSizes[i]+'px;background:#fff;border:1.5px solid #999;box-shadow:0 0 0 2.5px #999;border-radius:50%;opacity:'+(i===0?1:0.4)+';transform:translate(-50%,-50%);will-change:transform';blobContainer.appendChild(b);blobs.push(b);}document.addEventListener('mousemove',function(e){blobs.forEach(function(el,i){gsap.to(el,{x:e.clientX,y:e.clientY,duration:i===0?0.05:0.3,ease:i===0?'power2.out':'power1.out'});});});}

    // ========== 项目表定位 ==========
    var projInfo=document.querySelector('.grid-project-info');
    if(projInfo&&!isMobile){
        function posInfo(){
            var gridEl=document.querySelector('.editorial-grid');
            if(!gridEl)return;
            var gr=gridEl.getBoundingClientRect();
            var yearEl=document.querySelector('.grid-year');
            if(!yearEl||!yearEl.getBoundingClientRect().height){requestAnimationFrame(posInfo);return;}
            var yr=yearEl.getBoundingClientRect();
            var lc=document.querySelector('.header-char');
            var lr=lc?lc.getBoundingClientRect():null;
            var right=lr?lr.right:gr.right-parseFloat(getComputedStyle(gridEl).paddingRight);
            var left=gr.left+gr.width*0.5+24;
            projInfo.style.left=(left-gr.left)+'px';
            projInfo.style.width=(right-left)+'px';
            projInfo.style.top=(yr.height+0.10*window.innerHeight)+'px';
        }
        setTimeout(posInfo,500);
        window.addEventListener('resize',posInfo);
    }
});
