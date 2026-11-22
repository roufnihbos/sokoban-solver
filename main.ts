f=require('fs');({MAKEFUN_INPUT_DIR:I,MAKEFUN_OUTPUT_DIR:O}=process.env)
F=e=>L.replace(/[^#\n]/g,(c,i)=>i-i%W==S-S%W|(i%W>7)*2+(i<S)==k?' $'[+e.includes(c)]:'#')
for(n of f.readdirSync(I)){
L=f.readFileSync(I+'/'+n+'/level.txt')+'';W=L.indexOf`\n`+1;S=L.indexOf`@`;o='';for(k=4;k--;){
a=[[F('$*'),S,o]];Z=F('.*')
w:for(;;a=b)for([x,p,q]of(b=[],a)){
if(x+p==Z+S){o=q;break w}
for(j in D={u:-W,d:W,l:-1,r:1}){t=p+D[j];d=t*2-p
u=x[t]==' '?x:x[t]+x[d]=='$ '&&(y=[...x],y[t]=' ',y[d]='$',y.join(''))
u&&((f[u]||=[])[t]||=(u==x?a:b).push([u,t,q+j]))}}}
f.mkdirSync(g=O+'/'+n,{recursive:!0})
f.writeFileSync(g+'/solution.txt',o)}