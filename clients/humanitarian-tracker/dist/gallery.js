'use strict';
const photos=[...document.querySelectorAll('[data-photo]')],more=document.querySelector('#more-photos');let visibleCount=12;
function showPhotos(){photos.forEach((p,i)=>p.hidden=i>=visibleCount);more.hidden=visibleCount>=photos.length}
more.addEventListener('click',()=>{const firstNew=photos[visibleCount];visibleCount+=12;showPhotos();firstNew?.focus()});showPhotos();
const viewer=document.querySelector('#photo-viewer'),image=document.querySelector('#viewer-image'),caption=document.querySelector('#viewer-caption');let selected=0,opener;
function displayPhoto(index){selected=(index+photos.length)%photos.length;const photo=photos[selected],img=photo.querySelector('img');image.src=photo.href;image.alt=img.alt;caption.textContent=img.alt;document.querySelector('#open-photo').href=photo.href}
photos.forEach((p,i)=>p.addEventListener('click',e=>{e.preventDefault();opener=p;displayPhoto(i);viewer.showModal()}));
document.querySelector('#close-photo').addEventListener('click',()=>viewer.close());document.querySelector('#previous-photo').addEventListener('click',()=>displayPhoto(selected-1));document.querySelector('#next-photo').addEventListener('click',()=>displayPhoto(selected+1));viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();displayPhoto(selected+(e.key==='ArrowLeft'?-1:1))}});viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});viewer.addEventListener('close',()=>opener?.focus());
