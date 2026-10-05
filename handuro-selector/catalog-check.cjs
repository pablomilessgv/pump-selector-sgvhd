const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'catalog-data.json'),'utf8'));const {interpolate}=require('./app');
assert.equal(catalog.models.length,199);assert.equal(catalog.sheets.length,8);assert.equal(new Set(catalog.models.map(m=>m.name)).size,199);
catalog.models.forEach((m,i)=>{assert.equal(m.number,150+i);assert.equal(m.quality,'graphical');assert.equal(m.stock,'unknown');assert.ok(m.points.length>=3);assert.ok(fs.statSync(path.join(__dirname,m.sourceImage)).size>10000);m.points.forEach((p,j)=>{assert.ok(Number.isFinite(p[0])&&Number.isFinite(p[1]));if(j){assert.ok(p[0]>m.points[j-1][0]);assert.ok(p[1]<=m.points[j-1][1]);}});assert.equal(interpolate(m.points,m.points[0][0]-.01),null);assert.equal(interpolate(m.points,m.points.at(-1)[0]+.01),null);});
assert.equal(interpolate(catalog.models.find(m=>m.number===240).points,2),47);
assert.equal(catalog.models.find(m=>m.number===348).name,'HD-8SSC160-100-530-22000-A/D');
console.log('Catálogo verificado: numeración 150–348, fuentes locales, puntos ordenados, sin extrapolación, stock sin confirmar.');
