f=require('fs');({MAKEFUN_INPUT_DIR:I,MAKEFUN_OUTPUT_DIR:O}=process.env)
F=e=>L.replace(/[^#\n]/g,(c,i)=>i-i%W==S-S%W|(i%W>7)*2+(i<S)==k?e.includes(c)?'$':' ':'#')
for(n of f.readdirSync(I)){
L=f.readFileSync(I+'/'+n+'/level.txt')+'';W=L.indexOf`\n`+1;S=L.indexOf`@`;o='';k=4
for(;k--;){
a=[[F('$*'),S,'']];Z=F('.*')
w:for(;;a=b)for([x,p,q]of(b=[],a)){
if(x==Z&p==S){o+=q;break w}
for(j in D=[-W,W,-1,1]){t=p+D[j];d=t*2-p
u=x[t]==' '?x:x[t]+x[d]=='$ '&&(y=[...x],y[t]=' ',y[d]='$',y.join(''))
u&&((f[u]||=[])[t]||=(u==x?a:b).push([u,t,q+"udlr"[j]]))}}}
f.mkdirSync(g=O+'/'+n,{recursive:!0})
f.writeFileSync(g+'/solution.txt',o)}