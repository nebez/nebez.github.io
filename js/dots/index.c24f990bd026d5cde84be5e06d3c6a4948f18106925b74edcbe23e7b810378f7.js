(()=>{var s=Math.pow;var n=document.getElementById("draw-me");if(!(n instanceof HTMLCanvasElement))throw"Canvas not found";var d=n.getContext("2d");if(!d)throw"No drawing context";var f=new Audio("./click.mp3"),M=(e,t,i,r)=>Math.sqrt(s(e-i,2)+s(t-r,2)),y=class{constructor(t,i){this.x=t;this.y=i}draw(t,i){if(t.beginPath(),t.lineWidth=o?4:3,t.lineCap="round",i){let r=o?600:450,u=o?700:1700,a=M(this.x,this.y,i.x,i.y),c=Math.abs(Math.min(a,r)/r-1),x=Math.abs(Math.min(a,u)/u-1),m=o?18*s(Math.log(c),2)*(Math.round(Math.random()*40)/100+.6):20*c,w=(i.x-this.x)/a*m,b=(i.y-this.y)/a*m;t.strokeStyle=o?`rgba(45, 129, 236, ${x})`:"rgb(0, 0, 0)",t.moveTo(this.x-w/2,this.y-b/2),t.lineTo(this.x+w/2,this.y+b/2)}t.stroke()}},l,g=30,o=!1,h,p=()=>{l=[],n.height=n.clientHeight*2,n.width=n.clientWidth*2;for(let e=0;e<n.width;e+=g)for(let t=0;t<n.height;t+=g)l.push(new y(e,t))};p();window.addEventListener("resize",p);window.addEventListener("touchmove",e=>{h={x:e.touches[0].pageX*2,y:e.touches[0].pageY*2},e.preventDefault()});window.addEventListener("mousemove",e=>{h={x:e.x*2,y:e.y*2}});window.addEventListener("mousedown",e=>{o=!o,f.load(),f.play()});var v=()=>{d.clearRect(0,0,n.width,n.height),l.forEach(e=>e.draw(d,h)),requestAnimationFrame(v)};requestAnimationFrame(v);})();
