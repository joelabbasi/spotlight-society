'use strict';
const amountRadios=[...document.querySelectorAll('input[name="amount"]')];
const custom=document.querySelector('#custom-amount'),summary=document.querySelector('#donation-summary'),error=document.querySelector('#amount-error');
let selectedAmount=50;
function updateSummary(){const monthly=document.querySelector('input[name="frequency"]:checked').value==='monthly';const raw=custom.value;const hasCustom=raw!=='';const amount=hasCustom?Number(raw):selectedAmount;const valid=Number.isFinite(amount)&&amount>=1&&amount<=100000&&Math.abs(amount*100-Math.round(amount*100))<0.00001;custom.setAttribute('aria-invalid',String(hasCustom&&!valid));error.textContent=hasCustom&&!valid?'Enter an amount from $1 to $100,000 with up to two decimal places.':'';summary.replaceChildren();summary.append(document.createTextNode(valid?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(amount):'Choose an amount'));const frequency=document.createElement('small');frequency.textContent=monthly?'per month':'one time';summary.append(frequency)}
amountRadios.forEach(r=>r.addEventListener('change',()=>{selectedAmount=Number(r.value);custom.value='';updateSummary()}));
custom.addEventListener('input',()=>{if(custom.value!=='')amountRadios.forEach(r=>r.checked=false);else amountRadios.forEach(r=>r.checked=Number(r.value)===selectedAmount);updateSummary()});
document.querySelectorAll('input[name="frequency"]').forEach(r=>r.addEventListener('change',updateSummary));updateSummary();
