function calculate(d){
 const q=d.volume/d.hours,Q=q/3600,D=d.diameter/1000,v=4*Q/(Math.PI*D*D),Re=v*D/1.004e-6;
 const f=Re>0?(Re<2300?64/Re:0.25/Math.pow(Math.log10(d.roughness/1000/(3.7*D)+5.74/Math.pow(Re,0.9)),2)):0;
 const losses=d.lossMode==='manual'?d.loss:(f*d.length/D+d.k)*v*v/(2*9.81)+d.equipment;
 const head=d.level+d.elevation+losses+d.pressure*10.2;
 return {q,head,losses,immersion:d.depth-d.level,hydraulic:0.002725*q*head,electric:0.002725*q*head/(d.efficiency/100),energy:0.002725*d.volume*head/(d.efficiency/100),v,Re};
}
function interpolate(points,q){for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(q>=a[0]&&q<=b[0])return a[1]+(b[1]-a[1])*(q-a[0])/(b[0]-a[0]);}return null;}
function smallestPumps(models,result,inventory={},availableOnly=false){
 if(!result||!Number.isFinite(result.q)||!Number.isFinite(result.head)||result.q<=0||result.head<=0)return [];
 return models.filter(m=>Number.isFinite(m.powerKW)&&m.powerKW>0&&(inventory[m.id]||'unknown')!=='unavailable'&&(!availableOnly||inventory[m.id]==='available')).map(m=>{const height=interpolate(m.points,result.q);return {model:m,height,margin:height===null?null:height-result.head,band:m.quality==='graphical'?m.readingBand:0};}).filter(r=>r.height!==null&&Number.isFinite(r.band)&&r.margin>r.band).sort((a,b)=>a.model.powerKW-b.model.powerKW||a.margin-b.margin||a.model.number-b.model.number);
}
if(typeof module!=='undefined')module.exports={calculate,interpolate,smallestPumps};
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id),fmt=n=>Number(n).toLocaleString('es-AR',{maximumFractionDigits:2});
 const fields=[...document.querySelectorAll('#inputs input,#inputs select')];let models=[],result;
 try{const saved=JSON.parse(localStorage.getItem('handuro-project-v1'));if(saved)fields.forEach(e=>{if(saved[e.id]!==undefined)e.value=saved[e.id]});models=JSON.parse(localStorage.getItem('handuro-curves-v1'))||[];}catch{}
 const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
 function renderModels(){window.renderHanduroCatalog(result,models,index=>{models.splice(index,1);save('handuro-curves-v1',models);renderModels();});}
 function update(){const manual=$('lossMode').value==='manual';$('manualFields').hidden=!manual;$('pipeFields').hidden=manual;document.querySelectorAll('#manualFields input').forEach(e=>e.disabled=!manual);document.querySelectorAll('#pipeFields input').forEach(e=>{e.disabled=manual;e.required=!manual;});const data={};fields.forEach(e=>data[e.id]=e.type==='number'?Number(e.value):e.value);save('handuro-project-v1',data);$('warnings').replaceChildren();const warn=t=>{const p=document.createElement('div');p.className='warn';p.textContent=t;$('warnings').append(p);};
 if(!$('inputs').checkValidity()){result=null;$('q').textContent='—';$('head').textContent='—';$('breakdown').replaceChildren();warn('Completá los valores numéricos dentro de los límites indicados.');renderModels();return;}
 result=calculate(data);if(!Number.isFinite(result.head)||result.head<=0||result.immersion<=0){result=null;$('q').textContent='—';$('head').textContent='—';$('breakdown').replaceChildren();warn('La bomba debe quedar bajo el nivel dinámico y la altura total debe ser positiva. Revisá las cotas.');renderModels();return;}
 $('q').textContent=fmt(result.q);$('head').textContent=fmt(result.head);$('breakdown').replaceChildren();[['Elevación geométrica',data.level+data.elevation,'m'],['Pérdidas totales',result.losses,'m'],['Presión requerida',data.pressure*10.2,'m'],['Inmersión de referencia',result.immersion,'m'],['Potencia hidráulica',result.hydraulic,'kW'],['Potencia eléctrica estimada',result.electric,'kW'],['Energía eléctrica diaria estimada',result.energy,'kWh/día']].forEach(([label,n,unit])=>{const row=document.createElement('div');row.className='row';const a=document.createElement('span'),b=document.createElement('strong');a.textContent=label;b.textContent=fmt(n)+' '+unit;row.append(a,b);$('breakdown').append(row);});
 if(!manual&&data.length<data.depth)warn('La longitud de tubería es menor que la profundidad de instalación. Verificá que incluya todo el recorrido.');if(!manual&&result.Re>=2300&&result.Re<4000)warn('Flujo en transición: la estimación de fricción tiene mayor incertidumbre.');warn('Confirmá que el pozo sostenga este caudal y que la inmersión cumpla los límites del fabricante.');renderModels();}
 $('inputs').addEventListener('input',update);$('inputs').addEventListener('submit',e=>e.preventDefault());$('addModel').onclick=()=>{$('editor').open=true;$('modelName').focus();};
 $('modelForm').onsubmit=e=>{e.preventDefault();try{const points=$('points').value.trim().split(/\n+/).map(line=>line.split(';').map(x=>x.trim())).map(parts=>{if(parts.length!==2||parts.some(x=>x===''))throw Error('Cada línea debe contener caudal ; altura.');return parts.map(Number);}).sort((a,b)=>a[0]-b[0]);if(points.length<2||points.some((p,i)=>p.some(x=>!Number.isFinite(x)||x<0)||(i>0&&(p[0]<=points[i-1][0]||p[1]>points[i-1][1]))))throw Error('Ingresá al menos dos puntos válidos, con caudales distintos y altura no creciente. Usá punto decimal.');models.push({name:$('modelName').value.trim(),source:$('source').value.trim(),condition:$('condition').value.trim(),diameter:$('modelDiameter').value,points});save('handuro-curves-v1',models);$('modelForm').reset();$('modelError').textContent='';$('editor').open=false;renderModels();}catch(err){$('modelError').textContent=err.message;}};update();
}

