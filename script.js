const dialog=document.querySelector('#applicationDialog');
const form=document.querySelector('#applicationForm');
const banner=document.querySelector('#successBanner');
document.querySelector('#applyButton').addEventListener('click',()=>dialog.showModal());
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
form.addEventListener('submit',()=>{
  const returnUrl=new URL(window.location.href);
  returnUrl.searchParams.set('submitted','1');
  returnUrl.hash='';
  form.querySelector('[name="_next"]').value=returnUrl.toString();
});
if(new URLSearchParams(window.location.search).get('submitted')==='1'){
  banner.hidden=false;
  window.history.replaceState({},'',window.location.pathname+window.location.hash);
}
banner.querySelector('button').addEventListener('click',()=>banner.hidden=true);
