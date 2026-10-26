import assert from 'node:assert/strict';
const base=process.env.SHOWROOM_URL??'http://127.0.0.1:8082';
for(const language of ['fr','ar','en'])for(const theme of ['light','dark']){
  const response=await fetch(base+'/',{headers:{cookie:`mayd-language=${language}; mayd-theme=${theme}`}});
  assert.equal(response.status,200);const html=await response.text();
  const tag=html.match(/<html[^>]*>/)?.[0]??'';
  assert.ok(tag.includes(`lang="${language}"`),tag);assert.ok(tag.includes(`dir="${language==='ar'?'rtl':'ltr'}"`),tag);
  assert.equal(tag.includes('class="dark"'),theme==='dark',tag);
  const heading=language==='ar'?'شركتك. إبداعنا.':language==='en'?'Your business. Our creativity.':'Votre entreprise. Notre créativité.';
  assert.ok(html.includes(heading),'SSR heading '+language);
  const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1]??'';
  if(language==='ar')assert.ok(/[\u0600-\u06ff]/.test(description),description);
  if(language==='en')assert.ok(description.includes('Professional websites'),description);
  assert.ok(html.indexOf('localStorage.getItem')<html.indexOf('</head>'),'theme bootstrap in head before body paint');
  console.log('SSR',language,theme,'OK');
}
