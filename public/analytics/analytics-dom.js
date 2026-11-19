/** Optional binding. Add the documented data attributes, call once per rendered route,
 * and call the returned cleanup before route replacement/unmount/consent withdrawal.
 * Never reads field values, textContent, href queries, or sends form success automatically.
 */
export function bindAnalyticsDom(analytics, root=document) {
  const cleanups=[], observed=new Map();
  const props=el=>Object.fromEntries(['form_id','content_id','cta_location','service_type','plan_tier','resource_id','billing_cycle','faq_id','scenario_id'].map(k=>[k,el.getAttribute('data-analytics-'+k.replaceAll('_','-'))]).filter(([,v])=>v));
  const click=e=>{const el=e.target.closest?.('[data-analytics-event]');if(!el||!root.contains(el))return;
    const name=el.getAttribute('data-analytics-event');
    if(['consultation_cta_click','start_click','service_select','file_download_click','demo_citation_click'].includes(name))analytics.track(name,props(el));
  };
  root.addEventListener('click',click);cleanups.push(()=>root.removeEventListener('click',click));
  const input=e=>{const form=e.target.closest?.('[data-analytics-form]');if(form&&root.contains(form)&&e.isTrusted)analytics.track('consultation_form_start',{form_id:form.getAttribute('data-analytics-form')});};
  root.addEventListener('input',input);root.addEventListener('change',input);
  cleanups.push(()=>{root.removeEventListener('input',input);root.removeEventListener('change',input);});
  if(typeof IntersectionObserver!=='undefined'){
    const io=new IntersectionObserver(entries=>{for(const entry of entries){
      const el=entry.target;clearTimeout(observed.get(el));observed.delete(el);
      if(entry.isIntersecting&&entry.intersectionRatio>=0.5&&document.visibilityState==='visible') {
        observed.set(el,setTimeout(()=>{observed.delete(el);if(document.visibilityState==='visible')analytics.track('consultation_form_view',{form_id:el.getAttribute('data-analytics-form-view')});},1000));
      }
    }},{threshold:[0,0.5]});
    const targets=[...root.querySelectorAll('[data-analytics-form-view]')];targets.forEach(el=>io.observe(el));
    const visibility=()=>{for(const timer of observed.values())clearTimeout(timer);observed.clear();if(document.visibilityState==='visible')targets.forEach(el=>{io.unobserve(el);io.observe(el);});};
    document.addEventListener('visibilitychange',visibility);
    cleanups.push(()=>{io.disconnect();for(const timer of observed.values())clearTimeout(timer);document.removeEventListener('visibilitychange',visibility);});
  }
  return ()=>cleanups.forEach(f=>f());
}
