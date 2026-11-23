(() => {
const form=document.getElementById('customer-review-form'); if(!form)return;
const country=document.getElementById('review-country'),dial=document.getElementById('review-dial-code'),hiddenDial=document.getElementById('review-dial-hidden'),status=document.getElementById('review-form-status');
const code=(new URLSearchParams(location.search).get('country')||'KE').toUpperCase();
const sync=()=>{const option=country?.selectedOptions?.[0];const value=option?.dataset.dial||'';if(dial)dial.textContent=value||'—';if(hiddenDial)hiddenDial.value=value;};
if(country){const option=[...country.options].find(o=>o.dataset.code===code);if(option)country.value=option.value;sync();country.addEventListener('change',sync);}
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);
const message=['Hello Klyrova Technologies, I would like to submit customer feedback for review.', 'Name: '+data.get('Customer name'),'Email: '+data.get('Customer email'),'Country: '+data.get('Country'),'Dial code: '+data.get('International dialing code'),'Phone: '+data.get('Phone number'),'Rating: '+data.get('Rating'),'Review: '+data.get('Customer review'),'Publication permission: '+(data.get('Publication permission')?'Granted':'Not granted')].join('\n');
if(status)status.textContent='WhatsApp is opening with your review. Please check the message and tap Send to submit it to our team.';
location.href='https://wa.me/254743993329?text='+encodeURIComponent(message);
});
})();