export const CATEGORIES=['Meals & Drinks','Transport','Accommodation','Other'];
export const round=n=>Math.round((Number(n)+Number.EPSILON)*100)/100;
export function migrateTripCategories(trip){
 let changed=false;
 for(const receipt of trip.receipts||[]){
  if(!Array.isArray(receipt.allocations)||!receipt.allocations.some(a=>a.category==='Meals'||a.category==='Drinks'))continue;
  const allocations=[];
  for(const allocation of receipt.allocations){
   const category=allocation.category==='Meals'||allocation.category==='Drinks'?'Meals & Drinks':allocation.category;
   const existing=category==='Meals & Drinks'?allocations.find(a=>a.category===category):null;
   if(existing)existing.amount=round(Number(existing.amount)+Number(allocation.amount));
   else allocations.push({...allocation,category});
  }
  receipt.allocations=allocations;changed=true;
 }
 return changed;
}
export function parseMoney(s){s=String(s).replace(/[^\d.,'-]/g,'').replace(/'/g,'');const comma=s.lastIndexOf(','),dot=s.lastIndexOf('.');if(comma>=0&&dot>=0)s=s.replace(comma>dot?/\./g:/,/g,'').replace(',','.');else if(comma>=0)s=/,\d{1,2}$/.test(s)?s.replace(',','.'):s.replace(/,/g,'');else if((s.match(/\./g)||[]).length>1)s=s.replace(/\.(?=.*\.)/g,'');return Number(s);}
export function extract(text){
 const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);let currency='';
 const codes=text.match(/\b(EUR|USD|GBP|CHF|JPY|CAD|AUD|NZD|SEK|NOK|DKK|PLN|CZK|HUF|CNY|HKD|SGD|AED|INR|THB|ZAR|BRL|MXN|TRY|KRW|IDR)\b/gi);if(codes)currency=codes[codes.length-1].toUpperCase();else if(/€/.test(text))currency='EUR';else if(/£/.test(text))currency='GBP';else if(/(?:US\s*\$|\$)/.test(text))currency='USD';else if(/¥/.test(text))currency='JPY';
 let date='';let m=text.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);if(m)date=`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;else{m=text.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}|\d{2})\b/);if(m){let a=+m[1],b=+m[2];if(b>12)[a,b]=[b,a];date=`${m[3].length===2?'20':''}${m[3]}-${String(b).padStart(2,'0')}-${String(a).padStart(2,'0')}`;}else{const months={jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};m=text.match(/\b(\d{1,2})\s+([A-Za-z]{3})[a-z]*[ ,]+(20\d{2})\b/i);if(m&&months[m[2].toLowerCase()])date=`${m[3]}-${months[m[2].toLowerCase()]}-${m[1].padStart(2,'0')}`;}}
 if(date&&(!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))date='';
 let amount=0;const moneyPattern=/-?\d[\d.,]*[.,]\d{2}\b/g;
 const totals=lines.filter(l=>/\b(grand\s*total|amount\s*(due|paid)|total\s*(paid|due)?|balance\s*due|totaal|gesamt|montant)\b/i.test(l)&&!/(subtotal|sub total|tax total|total tax|vat total|total vat)/i.test(l));
 for(const l of totals){const vals=l.match(moneyPattern);if(vals?.length)amount=parseMoney(vals[vals.length-1]);}
 if(!amount){const vals=text.match(moneyPattern)||[];amount=Math.max(0,...vals.map(parseMoney).filter(Number.isFinite));}
 let merchant=lines.find(l=>/[A-Za-z]{2,}/.test(l)&&!/^(receipt|invoice|tax invoice|welcome|customer copy|merchant copy|date\b|total\b)/i.test(l))||'';merchant=merchant.slice(0,100);
 const context=(merchant+' '+text.slice(0,600)).toLowerCase();let category='Other';if(/hotel|resort|hostel|lodging|airbnb|accommodation/.test(context))category='Accommodation';else if(/taxi|uber|lyft|train|rail|metro|bus\b|parking|flight|airline|fuel|shell|transport/.test(context))category='Transport';else if(/bar\b|pub\b|brewery|cocktail|wine|beer|coffee|café|cafe|restaurant|bistro|dinner|lunch|breakfast|kitchen|grill|food|pizza|meal/.test(context))category='Meals & Drinks';
 return {merchant,date,currency,amount:Number.isFinite(amount)?round(amount):0,category};
}
export function allocationsValid(r){return r.allocations?.length>0&&r.allocations.every(a=>CATEGORIES.includes(a.category)&&Number.isFinite(+a.amount)&&+a.amount>0)&&Math.abs(round(r.allocations.reduce((s,a)=>s+Number(a.amount),0))-round(r.amount))<.005;}
export function receiptIssues(r,trip){const e=[];if(!r.merchant?.trim())e.push('merchant');if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date||'')||!Number.isFinite(Date.parse(r.date)))e.push('date');if(!(r.amount>0))e.push('amount');if(!/^[A-Z]{3}$/.test(r.currency||''))e.push('currency');if(!allocationsValid(r))e.push('split balance');if(r.currency&&r.currency!=='EUR'&&!(Number(trip.rates[r.currency])>0))e.push('exchange rate');if(r.error)e.push('receipt processing');if(!r.reviewed)e.push('review');return e;}
export function duplicateIds(receipts){const found=new Set();for(let i=0;i<receipts.length;i++)for(let j=0;j<i;j++){const a=receipts[i],b=receipts[j];if(a.hash&&a.hash===b.hash||a.merchant&&a.date&&a.amount>0&&a.date===b.date&&round(a.amount)===round(b.amount)&&a.currency===b.currency&&a.merchant.toLowerCase().replace(/\W/g,'')===b.merchant.toLowerCase().replace(/\W/g,'')){found.add(a.id);found.add(b.id);}}return found;}
export function euro(amount,currency,rates){return currency==='EUR'?round(amount):Number(rates[currency])>0?round(amount*Number(rates[currency])):null;}
export function categoryRows(trip,category){return trip.receipts.filter(r=>!r.excluded).flatMap(r=>{const amounts=r.allocations.filter(a=>a.category===category);if(!amounts.length)return[];const amount=round(amounts.reduce((s,a)=>s+ +a.amount,0));return[{receipt:r,amount,eur:euro(amount,r.currency,trip.rates)}];}).sort((a,b)=>(a.receipt.date||'').localeCompare(b.receipt.date||'')||a.receipt.id.localeCompare(b.receipt.id));}
export function totals(trip){return Object.fromEntries(CATEGORIES.map(c=>[c,round(categoryRows(trip,c).reduce((s,r)=>s+(r.eur||0),0))]));}
