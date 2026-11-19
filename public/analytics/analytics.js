/* WELLDONEPRODUCT / ONTIE analytics v2.0. No vendor SDK is installed here. */
export function createAnalytics({ brand, getConsent, getPage, ignoredReferrers = [] }) {
  const configs = {
    welldoneproduct: { domain: 'welldoneproduct.com', gtm: 'GTM-KBPB7VQS', ga: 'G-0NEL155BYK', hosts: ['welldoneproduct.com','www.welldoneproduct.com'] },
    ontie: { domain: 'ontie.ai', gtm: 'GTM-PJVDRCFC', ga: 'G-QV16X8XBL8', hosts: ['ontie.ai','www.ontie.ai','app.ontie.ai'] }
  };
  const cfg = configs[brand];
  if (!cfg || typeof getConsent !== 'function' || typeof getPage !== 'function') throw new Error('Invalid analytics configuration');
  const w = window, d = document;
  const activeHost = cfg.hosts.includes(w.location.hostname);
  const keys = 'schema_version event_id site_area page_type page_path content_id topic_id service_type form_id cta_location error_code st_source st_medium st_campaign st_content ft_source ft_medium lnd_source lnd_medium lnd_campaign lnd_content provider plan_tier origin_content_id origin_cta_location origin_service_type origin_plan_tier resource_id billing_cycle faq_id scenario_id'.split(' ');
  const allowed = new Set('page_view content_view consultation_cta_click consultation_form_start generate_lead consultation_form_error newsletter_signup resource_request consultation_form_view content_engaged service_select file_download_click'.split(' ').concat(brand === 'ontie' ? 'start_click demo_start sign_up workspace_created source_connected source_sync_completed answer_completed activation_completed pricing_cycle_change faq_open demo_answer_completed demo_citation_click'.split(' ') : []));
  const DAY = 86400000, cookieKey = 'wdp_attr_v1_' + brand;
  let ready = false, revoked = false, touch = null, lastPage = null, seen = new Set(), landingHandled = false, once = new Set(), pageKey = null;
  const landing = new URL(w.location.href);
  const referrer = (() => { try { return new URL(d.referrer); } catch { return null; } })();
  const valid = x => typeof x === 'string' && /^[a-zA-Z0-9_:.\/-]{1,100}$/.test(x) ? x : null;
  const consent = () => { try { return activeHost && !revoked && getConsent() === true; } catch { return false; } };
  function gtag() { (w.dataLayer = w.dataLayer || []).push(arguments); }
  function readCookie() { try { return JSON.parse(decodeURIComponent(d.cookie.split('; ').find(x => x.startsWith(cookieKey+'='))?.split('=').slice(1).join('=') || 'null')); } catch { return null; } }
  function persist() { try { d.cookie = cookieKey+'='+encodeURIComponent(JSON.stringify(touch))+'; Max-Age='+Math.max(0,Math.floor((touch.expires_at-Date.now())/1000))+'; Path=/; Domain='+cfg.domain+'; SameSite=Lax; Secure'; } catch {} }
  function attribution() {
    if (!consent()) return null;
    const now = Date.now();
    if (!touch) { const stored = readCookie(); touch = stored && stored.expires_at > now && stored.first_touch ? stored : { expires_at: now + 90*DAY }; }
    const external = referrer && referrer.hostname !== cfg.domain && !referrer.hostname.endsWith('.'+cfg.domain) && !ignoredReferrers.includes(referrer.hostname);
    const utm = Object.fromEntries(['source','medium','campaign','content'].map(k => [k,valid(landing.searchParams.get('utm_'+k))]));
    const campaign = Object.values(utm).some(Boolean);
    const current = { ...utm, source: utm.source || (campaign ? '(not set)' : external ? referrer.hostname : '(direct)'), medium: utm.medium || (campaign ? '(not set)' : external ? (/^(www\.)?(google\.[a-z.]+|bing\.com|search\.naver\.com|search\.daum\.net)$/.test(referrer.hostname) ? 'organic' : 'referral') : '(none)'), captured_at:now, landing_path:page().path, referrer_host:external ? referrer.hostname : null };
    if (!touch.first_touch) touch.first_touch = current;
    if (!touch.session_touch || now-(touch.last_activity||0) > 30*60000) touch.session_touch=current;
    // A new external campaign on a new document replaces the complete session context.
    if (!landingHandled && (campaign || external)) { touch.session_touch=current; touch.last_non_direct_touch=current; }
    landingHandled=true; touch.last_activity=now; persist(); return JSON.parse(JSON.stringify(touch));
  }
  function page() {
    const p = getPage() || {};
    // Developer supplies a public route or route template, never customer IDs/text.
    if (typeof p.path !== 'string' || !/^\/[a-zA-Z0-9_:/.-]*$/.test(p.path) || p.path.length > 200) throw new Error('Provide a safe route template');
    if (!['marketing','app','demo'].includes(p.area) || !valid(p.type)) throw new Error('Provide page area/type');
    return p;
  }

  const originKey = cookieKey + '_origin_v2';
  let originMemory = null;
  function readOrigin() {
    let value = originMemory;
    try { value = JSON.parse(w.sessionStorage.getItem(originKey) || 'null') || value; } catch {}
    if (!value || Date.now() - value.at > 30*60000) { saveOrigin(null); return null; }
    return value;
  }
  function saveOrigin(value) {
    originMemory=value;
    try { if (value) w.sessionStorage.setItem(originKey,JSON.stringify(value)); else w.sessionStorage.removeItem(originKey); } catch {}
  }
  function originFrom(props={}) {
    const p=page();
    return {origin_content_id:valid(props.content_id || p.contentId),origin_cta_location:valid(props.cta_location),origin_service_type:valid(props.service_type || p.serviceType),origin_plan_tier:valid(props.plan_tier || p.planTier)};
  }
  function contextFor(formId) {
    const value=readOrigin();
    return value && value.form_id===formId ? value : null;
  }
  function routeScope() {
    const p=page(), key=p.area+':'+p.path;
    if (key!==pageKey) { once.clear(); pageKey=key; }
    return key;
  }
  function consultationContext(formId) {
    if (!consent() || !valid(formId)) return null;
    const value=contextFor(formId);
    return value ? {...value.props} : originFrom();
  }

  function envelope(name, properties = {}, userId = null) {
    const p=page(), a=attribution();
    const props=Object.fromEntries(keys.map(k=>[k,null]));
    Object.assign(props,{schema_version:'2.0',event_id:crypto.randomUUID(),site_area:p.area,page_type:p.type,page_path:p.path,content_id:valid(p.contentId),topic_id:valid(p.topicId),service_type:valid(p.serviceType),plan_tier:valid(p.planTier)});
    for (const [prefix,source] of [['ft',a?.first_touch],['st',a?.session_touch],['lnd',a?.last_non_direct_touch]]) for (const k of ['source','medium','campaign','content']) if (keys.includes(prefix+'_'+k)) props[prefix+'_'+k]=source?.[k]??null;
    for (const k of keys) if (Object.hasOwn(properties,k) && !['schema_version','site_area','page_type','page_path'].includes(k)) props[k]=valid(properties[k]);
    if (!props.event_id) throw new Error('Invalid event ID');
    const loc = new URL(p.path,w.location.origin);
    // Keep only validated campaign parameters; no raw query strings or hashes.
    for (const k of ['source','medium','campaign','content']) { const v=valid(landing.searchParams.get('utm_'+k)); if (v) loc.searchParams.set('utm_'+k,v); }
    return {allowed:true,name,props,user_id:userId,page_location:loc.href,page_title:brand+' | '+p.type,page_referrer:referrer ? referrer.origin+'/' : '',mixpanel_options:{record_sessions_percent:0,track_pageview:false,track_marketing:false,skip_first_touch_marketing:true,save_referrer:false,persistence:'cookie',cookie_domain:cfg.domain,cross_subdomain_cookie:true,cookie_expiration:90,secure_cookie:true,property_blacklist:['$current_url','$referrer','$initial_referrer','$initial_referring_domain','$title','mp_keyword','utm_source','utm_medium','utm_campaign','utm_content','utm_term']}};
  }
  const pending = [];
  let tagsReady = false;
  const tagTimeout = 10000;

  function emit(message) {
    w.dataLayer.push({ analytics: null });
    w.dataLayer.push(message);
  }

  function flush() {
    if (tagsReady) return;
    tagsReady = true;
    for (const message of pending.splice(0)) if (consent()) emit(message);
  }

  function push(event, props, userId) {
    // Capture the event's page and attribution before waiting on the vendor SDKs.
    const message = { event, analytics: envelope(event, props, userId) };
    if (tagsReady) emit(message);
    else pending.push(message);
  }
  function start() {
    if (!consent()) return false;
    if (ready) return true;
    // Default denied is queued before the container; analytics consent alone never grants ads consent.
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('consent','update',{analytics_storage:'granted'});
    w.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    if (!d.querySelector('script[data-company-gtm]')) { const s=d.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtm.js?id='+cfg.gtm; s.dataset.companyGtm=brand; d.head.appendChild(s); }
    ready = true;
    // The Mixpanel template resolves its event fields only after its wrapper is loaded.
    // Wait for the container's init tags to finish before publishing event data.
    emit({
      event: 'analytics_ready',
      analytics: envelope('analytics_ready'),
      eventCallback: () => queueMicrotask(flush),
      eventTimeout: tagTimeout,
    });
    w.setTimeout(flush, tagTimeout + 1000);
    return true;
  }
  function track(name, props={}) {
    try {
      if (!allowed.has(name) || !consent()) return false;
      routeScope();
      const p=page();
      const productEvents=['sign_up','workspace_created','source_connected','source_sync_completed','answer_completed','activation_completed'];
      if (productEvents.includes(name) && p.area!=='app') return false;
      if (['demo_start','demo_answer_completed','demo_citation_click'].includes(name) && p.area!=='demo') return false;
      if (name==='generate_lead' && p.area==='demo') return false;
      if (name.startsWith('consultation_') || name==='generate_lead') { if (!valid(props.form_id)) return false; }
      if (['file_download_click','resource_request'].includes(name) && !valid(props.resource_id)) return false;
      if (name==='pricing_cycle_change' && !['monthly','annual'].includes(props.billing_cycle)) return false;
      if (name==='faq_open' && !valid(props.faq_id)) return false;
      if (['demo_answer_completed','demo_citation_click'].includes(name) && !valid(props.scenario_id)) return false;
      if (['content_view','content_engaged'].includes(name) && !valid(props.content_id || p.contentId)) return false;
      if (name==='service_select' && !valid(props.service_type)) return false;
      if (name==='consultation_form_error' && !['validation','server','network'].includes(props.error_code)) return false;
      // API success events MUST use the server's stable, random analytics_event_id.
      if (['generate_lead','sign_up','activation_completed','source_sync_completed','workspace_created','source_connected','answer_completed','newsletter_signup','resource_request'].includes(name) && !valid(props.event_id)) return false;
      const key=props.event_id ? name+':'+props.event_id : null;
      let saved=[]; try { saved=JSON.parse(w.localStorage.getItem(cookieKey+'_sent')||'[]').filter(x=>x.at>Date.now()-90*DAY); } catch {}
      if (key && (seen.has(key)||saved.some(x=>x.key===key))) return false;
      if (!start()) return false;
      const onceKey=['content_view','content_engaged','consultation_form_view','consultation_form_start','demo_start'].includes(name) ? name+':'+(props.form_id || props.content_id || p.contentId || '') : null;
      if (onceKey && once.has(onceKey)) return false;
      const formId=props.form_id;
      if (name==='consultation_cta_click') saveOrigin({form_id:formId,props:originFrom(props),at:Date.now(),locked:false});
      if (['consultation_form_start','consultation_form_error','generate_lead'].includes(name)) {
        let ctx=contextFor(formId);
        if (!ctx) ctx={form_id:formId,props:originFrom(props),at:Date.now(),locked:false};
        ctx.at=Date.now(); ctx.locked=true; saveOrigin(ctx);
        props={...props,...ctx.props};
      }

      push(name,props);
      if (onceKey) once.add(onceKey);
      if (name==='generate_lead') saveOrigin(null);
      if (key) { seen.add(key); try { w.localStorage.setItem(cookieKey+'_sent',JSON.stringify([...saved,{key,at:Date.now()}].slice(-200))); } catch {} }
      return true;
    } catch { return false; } // Tracking can never break consultation submission.
  }
  return {
    start: () => { try { return start(); } catch { return false; } },
    track,
    consultationContext: formId => { try { return consultationContext(formId); } catch { return null; } },
    pageView() { try { if (!consent()) return false; const p=page(), key=p.area+':'+p.path; if (lastPage===key) return false; const ok=track('page_view'); if(ok) lastPage=key; return ok; } catch { return false; } },
    attribution: () => { try { return attribution(); } catch { return null; } },
    identify(userId) { try { if (brand!=='ontie'||!valid(userId)||!start()) return false; push('analytics_identify',{},userId); return true; } catch { return false; } },
    reset() { try { if (brand==='ontie'&&ready&&consent()) push('analytics_reset'); } catch {} },
    revoke() { revoked=true; pending.length = 0; saveOrigin(null); once.clear(); gtag('consent','update',{analytics_storage:'denied'}); w['ga-disable-'+cfg.ga]=true; try { w.mixpanel?.opt_out_tracking(); d.cookie=cookieKey+'=; Max-Age=0; Path=/; Domain='+cfg.domain+'; SameSite=Lax; Secure'; w.localStorage.removeItem(cookieKey+'_sent'); } catch {} }
  };
}
