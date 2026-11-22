f=require('fs');({MAKEFUN_INPUT_DIR:I,MAKEFUN_OUTPUT_DIR:O}=process.env)
for(n of f.readdirSync(I)){
L=f.readFileSync(`${I}/${n}/level.txt`)+'';W=L.indexOf('\n')+1;S=L.indexOf('@');h=S/W|0;D=[-W,W,-1,1];o='';k=4
for(;k--;){
m=L.replace(/./g,(c,i,_,r=i/W|0)=>r==h||(i%W/7|0)*2+(r<h)==k?c:'#')
Z=m.replace(/[$@]/g,' ').replace(/[.*]/g,'$')
a=[[m.replace(/[.*@]/g,c=>c=='*'?'$':' '),S,'']]
s=new Set
w:for(;;a=b)for([x,p,q]of(b=[],a)){
r=[[p,q]];v=[...x];v[p]='!';B=[]
for(e of r)for(j=4;j--;){t=e[0]+D[j];d=t+D[j];l=e[1]+'udlr'[j]
v[t]==' '&&(v[t]='!',r.push([t,l]))
x[t]=='$'&&x[d]==' '&&B.push([t,d,l])}
if(x==Z){o+=r.find(e=>e[0]==S)[1];break w}
s.has(g=v.join(''))||(s.add(g),b.push(...B.map(([t,d,z])=>(y=[...x],y[t]=' ',y[d]='$',[y.join(''),t,z]))))}}
f.mkdirSync(g=`${O}/${n}`,{recursive:!0})
f.writeFileSync(g+'/solution.txt',o)}