const assert=require('node:assert/strict');const {smallestPumps}=require('./app');
const catalog=require('./catalog-data.json');const r={q:2,head:30};const options=smallestPumps(catalog.models,r);assert.ok(options.length);assert.equal(options[0].model.powerKW,.75);assert.ok(options.every(o=>o.margin>o.band));assert.ok(options.every((o,i)=>!i||o.model.powerKW>=options[i-1].model.powerKW));
const first=options[0].model;assert.ok(!smallestPumps(catalog.models,r,{[first.id]:'unavailable'}).some(o=>o.model.id===first.id));assert.equal(smallestPumps(catalog.models,r,{},true).length,0);assert.equal(smallestPumps(catalog.models,r,{[first.id]:'available'},true).length,1);
assert.equal(smallestPumps(catalog.models,null).length,0);assert.equal(smallestPumps(catalog.models,{q:1000,head:30}).length,0);
const model={id:'test',number:1,powerKW:1,points:[[1,50],[3,40]],quality:'graphical',readingBand:5};assert.equal(smallestPumps([model],{q:2,head:40}).length,0);assert.equal(smallestPumps([model],{q:2,head:39}).length,1);
console.log(`Selección OK: ${options.filter(o=>o.model.powerKW===.75).length} opciones mínimas de 0,75 kW para 2 m³/h a 30 m. Filtros de stock, límites y orden verificados.`);
