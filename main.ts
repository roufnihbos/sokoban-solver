for(n of(f=require('fs')).readdirSync(I='/input/')){
L=f.readFileSync(I+n+'/level.txt');W=L.indexOf(10)+1;L[S=L.indexOf(64)]=32;D={u:-W,d:W,l:-1,r:1}
for(o='',k=4;k--;o+=M.get(S)){
a=[[L.map((c,i)=>i/W>>0==S/W>>0|(i%W>6)*2+(i<S)==k?c:35),S,'']];s={}
for([x,p,q]of a){M=new Map([[p,q]]);N=a.length
for([e,l]of M)for(c in D){t=e+D[c];d=t*2-e
x[t]%7==4?M.has(t)||M.set(t,l+c):x[t]%6<1&&x[d]%7==4&&(y=Buffer.from(x),y[t]^=4,y[d]^=4,a.push([y,t,l+c]))}
if(!x.includes(46))break
s[g=x+Math.min(...M.keys())]?a.length=N:s[g]=1}}
f.mkdirSync(g='/output/'+n)
f.writeFileSync(g+'/solution.txt',o)}