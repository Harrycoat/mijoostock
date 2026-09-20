(function(){
  var current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  var links=[
    ['guide-account.html','주식 시작'],
    ['retirement-pension.html','은퇴연금'],
    ['retirement-funds.html','은퇴자금'],
    ['etf-investing.html','ETF 투자'],
    ['guide-indicators.html','차트 분석'],
    ['daily-analysis.html','일일 실전분석'],
    ['guide-gex.html','GEX 옵션'],
    ['guide-covered-call.html','월세 프로젝트'],
    ['index.html#coaching','1:1 강의','coaching']
  ];
  function linkHtml(item,mobile){
    var file=item[0].split('#')[0];
    var cls=[];
    if(file===current) cls.push('active');
    if(item[2]) cls.push(item[2]);
    var icon=mobile?({'guide-account.html':'🔰 ','retirement-pension.html':'🏦 ','retirement-funds.html':'🛡️ ','etf-investing.html':'📦 ','guide-indicators.html':'📊 ','daily-analysis.html':'📈 ','guide-gex.html':'⚡ ','guide-covered-call.html':'💰 ','index.html':'🎯 '}[file]||''):'';
    return '<a'+(cls.length?' class="'+cls.join(' ')+'"':'')+' href="'+item[0]+'">'+icon+item[1]+'</a>';
  }
  function init(){
    var oldHeader=document.querySelector('header.nav, header.global-nav');
    if(!oldHeader) return;
    var oldOverlay=document.querySelector('.mobile-menu-overlay,.global-mobile-overlay');
    var oldMenu=document.querySelector('.mobile-menu,.global-mobile-menu');
    if(oldOverlay) oldOverlay.remove();
    if(oldMenu) oldMenu.remove();
    oldHeader.outerHTML='<header class="global-nav"><div class="global-nav-inner"><a class="global-logo" href="index.html"><span class="global-logo-mark">M</span>MiJooStock.com</a><nav class="global-links">'+links.map(function(x){return linkHtml(x,false)}).join('')+'</nav><button class="global-menu-btn" id="globalMenuBtn" aria-label="메뉴 열기" aria-expanded="false">☰</button></div></header><div class="global-mobile-overlay" id="globalMenuOverlay"></div><nav class="global-mobile-menu" id="globalMobileMenu"><button id="globalMenuClose" aria-label="메뉴 닫기">✕</button><a href="index.html">🏠 홈으로</a>'+links.map(function(x){return linkHtml(x,true)}).join('')+'</nav>';
    var btn=document.getElementById('globalMenuBtn'),menu=document.getElementById('globalMobileMenu'),overlay=document.getElementById('globalMenuOverlay'),close=document.getElementById('globalMenuClose');
    function setOpen(open){menu.classList.toggle('open',open);overlay.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':''}
    btn.addEventListener('click',function(){setOpen(true)});close.addEventListener('click',function(){setOpen(false)});overlay.addEventListener('click',function(){setOpen(false)});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false)})});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
