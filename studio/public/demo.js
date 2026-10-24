const demoForm=document.querySelector('#demo-form');
if(demoForm){
  const status=document.querySelector('#demo-status'),button=demoForm.querySelector('[type="submit"]');
  const fields=['email','phone','details'];
  function clearErrors(){for(const name of fields){demoForm.elements[name].removeAttribute('aria-invalid');document.querySelector(`#demo-${name}-error`).textContent='';}}
  demoForm.addEventListener('input',e=>{if(fields.includes(e.target.name)){e.target.removeAttribute('aria-invalid');document.querySelector(`#demo-${e.target.name}-error`).textContent='';}});
  demoForm.addEventListener('submit',async e=>{
    e.preventDefault();if(button.disabled)return;clearErrors();
    if(!demoForm.reportValidity())return;
    const values=Object.fromEntries(new FormData(demoForm));
    for(const key of fields)values[key]=values[key].trim();
    const digits=values.phone.replace(/\D/g,'');
    if(digits.length<7||digits.length>15){const phone=demoForm.elements.phone;phone.setAttribute('aria-invalid','true');document.querySelector('#demo-phone-error').textContent='Enter a phone number with 7–15 digits.';phone.focus();return;}
    button.disabled=true;button.textContent='Sending…';status.textContent='';status.removeAttribute('data-error');
    try{
      const response=await fetch('/api/demo',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(values)});
      let result;try{result=await response.json();}catch{throw new Error('Your request could not be confirmed. Please email joe@spotlightsociety.org directly.');}
      if(!response.ok||result.ok!==true){
        for(const name of fields){if(result.errors?.[name]){demoForm.elements[name].setAttribute('aria-invalid','true');document.querySelector(`#demo-${name}-error`).textContent=result.errors[name];}}
        const first=fields.find(name=>result.errors?.[name]);if(first)demoForm.elements[first].focus();
        throw new Error(result.message||'Your request could not be sent. Please email joe@spotlightsociety.org directly.');
      }
      demoForm.reset();status.textContent=result.message;status.focus();
    }catch(error){status.setAttribute('data-error','true');status.textContent=error.message||'We couldn’t confirm delivery. Please email joe@spotlightsociety.org directly.';}
    finally{button.disabled=false;button.innerHTML='Send request <span aria-hidden="true">↗</span>';}
  });
}
