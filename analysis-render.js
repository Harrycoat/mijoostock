/* analysis-render.js
   구글시트 기반 "일일 실전 차트분석" 렌더링 공용 스크립트.
   index.html(최신 1건 → 게시판 요약)과 daily-analysis.html(전체 목록)이 함께 사용합니다.

   구글시트 컬럼: 날짜, 종목, 파일명, 지지선, 감마플립, 저항선, 헤드라인, 설명, 핵심요약, 카테고리
   카테고리 값: 급등주케이스 / 한인선호종목 / 트레이딩QNA
*/
(function(global){
  var SHEET_ID = '1lJVPwXYQlDjcI10F2vZMuxhLITK02hDVdp00WHw_3eg';
  var CSV_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:csv&gid=0';

  var CATEGORY_META = {
    '급등주케이스': { label: '급등주 케이스',   color: 'var(--up)' },
    '한인선호종목': { label: '한인 선호 종목',  color: 'var(--amber)' },
    '트레이딩QNA':  { label: '트레이딩 Q&A',    color: 'var(--violet)' }
  };
  var CATEGORY_ORDER = ['급등주케이스', '한인선호종목', '트레이딩QNA'];

  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 개별 분석 1건을 풍부한 카드 HTML(표 + 3단계 가이드 + 핵심요약)로 렌더링
  function renderAnalysisBlock(r){
    var date = esc(r['날짜']);
    var ticker = esc(r['종목']);
    var file = esc(r['파일명']);
    var support = esc(r['지지선']);
    var flip = esc(r['감마플립']);
    var resist = esc(r['저항선']);
    var headline = esc(r['헤드라인']);
    var desc = esc(r['설명']);
    var keyQuote = esc(r['핵심요약']);
    var meta = CATEGORY_META[r['카테고리']];

    var imgHtml = file
      ? '<img src="' + file + '" alt="' + ticker + ' 실전 분석" style="width:100%; display:block; background:#fff;" loading="lazy">'
      : '';

    var tableRows = '';
    if (support) {
      tableRows += '<tr style="border-bottom:1px solid var(--line-soft);">' +
        '<td style="padding:12px; color:var(--down); font-weight:700; white-space:nowrap;">🚨 강력 지지선</td>' +
        '<td style="padding:12px; font-family:\'JetBrains Mono\', monospace; font-weight:700; color:var(--text); white-space:nowrap;">$' + support + '</td>' +
        '<td style="padding:12px; color:var(--text-dim); line-height:1.6;">이 가격이 무너지면 손절/리스크 관리 · 지지선 위에서 반등 시 안정적인 매수 구간</td>' +
      '</tr>';
    }
    if (flip) {
      tableRows += '<tr style="border-bottom:1px solid var(--line-soft);">' +
        '<td style="padding:12px; color:var(--amber); font-weight:700; white-space:nowrap;">🔄 감마 플립</td>' +
        '<td style="padding:12px; font-family:\'JetBrains Mono\', monospace; font-weight:700; color:var(--text); white-space:nowrap;">$' + flip + '</td>' +
        '<td style="padding:12px; color:var(--text-dim); line-height:1.6;">변동성이 커지는 분기점 · $' + flip + ' 돌파 시 변동성이 줄어들며 상방 추세 강화 · 하회 시 변동성 확대 주의</td>' +
      '</tr>';
    }
    if (resist) {
      tableRows += '<tr>' +
        '<td style="padding:12px; color:var(--up); font-weight:700; white-space:nowrap;">🚀 신고가 저항선</td>' +
        '<td style="padding:12px; font-family:\'JetBrains Mono\', monospace; font-weight:700; color:var(--text); white-space:nowrap;">$' + resist + '</td>' +
        '<td style="padding:12px; color:var(--text-dim); line-height:1.6;">차트 전고점(목표 매도 구간) · 이 구간을 강력하게 뚫어주면 추가 신고가 라인 진입</td>' +
      '</tr>';
    }

    var stepsHtml = '';
    if (support) {
      stepsHtml += '<div style="background:var(--panel-2); border:1px solid var(--line); border-radius:8px; padding:14px;">' +
        '<div style="font-size:11px; color:var(--cyan); font-weight:700; margin-bottom:6px;">1단계 · 매수/지지 확인</div>' +
        '<div style="font-size:12.5px; color:var(--text-dim); line-height:1.6;">$' + support + ' 지지를 확인하며 안정적인 분할 매수 기회 탐색</div>' +
      '</div>';
    }
    if (flip) {
      stepsHtml += '<div style="background:var(--panel-2); border:1px solid var(--line); border-radius:8px; padding:14px;">' +
        '<div style="font-size:11px; color:var(--cyan); font-weight:700; margin-bottom:6px;">2단계 · 추세 강화</div>' +
        '<div style="font-size:12.5px; color:var(--text-dim); line-height:1.6;">$' + flip + ' 감마 플립 구간 돌파 시 강한 상승 동력 확보</div>' +
      '</div>';
    }
    if (resist) {
      stepsHtml += '<div style="background:var(--panel-2); border:1px solid var(--line); border-radius:8px; padding:14px;">' +
        '<div style="font-size:11px; color:var(--cyan); font-weight:700; margin-bottom:6px;">3단계 · 목표가 대응</div>' +
        '<div style="font-size:12.5px; color:var(--text-dim); line-height:1.6;">$' + resist + ' 신고가 저항선 도달 시 수익 실현 고려</div>' +
      '</div>';
    }

    var catBadgeHtml = meta
      ? '<span style="font-family:\'JetBrains Mono\', monospace; font-size:10px; font-weight:700; color:' + meta.color + '; border:1px solid ' + meta.color + '; border-radius:4px; padding:2px 7px; margin-right:8px;">' + esc(meta.label) + '</span>'
      : '';

    return '<div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; background:var(--panel-2); border-bottom:1px solid var(--line);">' +
        '<span style="font-family:\'JetBrains Mono\', monospace; font-size:13px; font-weight:700; color:var(--text);">' + catBadgeHtml + '오늘의 실전 분석 · ' + ticker + '</span>' +
        '<span style="font-family:\'JetBrains Mono\', monospace; font-size:11px; color:var(--text);">' + date + ' 업데이트</span>' +
      '</div>' +
      imgHtml +
      '<div style="padding:24px 20px; border-top:1px solid var(--line);">' +
        (headline ? '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;"><span style="font-size:13px;">📌</span><span style="font-weight:800; font-size:15px; color:var(--text);">' + headline + '</span></div>' : '') +
        '<p style="font-size:12px; color:var(--text-faint); margin-bottom:18px;">⚠️ 본 자료는 교육 목적의 참고용 정보이며, 투자 권유가 아닙니다.</p>' +
        (desc ? '<p style="font-size:13.5px; color:var(--text-dim); line-height:1.7; margin-bottom:22px;">' + desc + '</p>' : '') +
        (tableRows ? '<div style="font-family:\'JetBrains Mono\', monospace; font-size:11px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:10px;">🎯 핵심 가격 기준 &amp; 대응 전략</div>' +
          '<div style="overflow-x:auto; margin-bottom:26px;"><table style="width:100%; border-collapse:collapse; font-size:13px;"><thead><tr style="border-bottom:1px solid var(--line);">' +
            '<th style="text-align:left; padding:10px 12px; color:var(--text-faint); font-weight:600; font-size:11.5px;">구분</th>' +
            '<th style="text-align:left; padding:10px 12px; color:var(--text-faint); font-weight:600; font-size:11.5px;">가격</th>' +
            '<th style="text-align:left; padding:10px 12px; color:var(--text-faint); font-weight:600; font-size:11.5px;">특징 및 대응 전략</th>' +
          '</tr></thead><tbody>' + tableRows + '</tbody></table></div>' : '') +
        (stepsHtml ? '<div style="font-family:\'JetBrains Mono\', monospace; font-size:11px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">💡 한눈에 보는 3단계 가이드</div>' +
          '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:22px;">' + stepsHtml + '</div>' : '') +
        (keyQuote ? '<div style="background:rgba(23,232,201,0.08); border:1px solid rgba(23,232,201,0.25); border-radius:8px; padding:14px 16px; font-size:13px; color:var(--text); line-height:1.6;">📝 <strong>"' + keyQuote + '"</strong></div>' : '') +
      '</div>';
  }

  // 카테고리별로 최신 N개만 뽑기 (rows는 이미 날짜 내림차순 정렬된 상태여야 함)
  function getByCategory(rows, category, limit){
    return rows.filter(function(r){ return r['카테고리'] === category; }).slice(0, limit || 3);
  }

  // 홈페이지 게시판 카드용 압축 리스트 아이템 1건 (제목 + 배지 + 날짜만)
  function renderBoardItem(r, opts){
    opts = opts || {};
    var meta = CATEGORY_META[r['카테고리']] || { label: r['카테고리'] || '', color: 'var(--text-faint)' };
    var radiusStyle = '';
    if (opts.first && opts.last) radiusStyle = 'border-radius:8px;';
    else if (opts.first) radiusStyle = 'border-radius:8px 8px 0 0;';
    else if (opts.last) radiusStyle = 'border-radius:0 0 8px 8px; border-bottom:none;';

    return '<a href="daily-analysis.html?cat=' + encodeURIComponent(r['카테고리'] || '') + '" style="display:block; text-decoration:none; color:inherit; background:var(--panel-2); padding:12px 14px; border-bottom:1px solid var(--line-soft); ' + radiusStyle + '">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">' +
          '<span style="font-size:10px; font-weight:700; color:' + meta.color + ';">' + esc(meta.label) + '</span>' +
          '<span style="font-size:11px; color:var(--text-faint);">' + esc(r['날짜']) + '</span>' +
        '</div>' +
        '<div style="font-size:13px; color:var(--text); line-height:1.4;">' + esc(r['헤드라인'] || (r['종목'] + ' 분석')) + '</div>' +
      '</a>';
  }

  // 홈페이지 게시판 카드 전체 HTML (카테고리별 최신 N개씩, 순서대로 이어붙임)
  function renderBoardHTML(rows, perCategory){
    perCategory = perCategory || 3;
    var items = [];
    CATEGORY_ORDER.forEach(function(cat){
      items = items.concat(getByCategory(rows, cat, perCategory));
    });
    return items.map(function(r, i){
      return renderBoardItem(r, { first: i === 0, last: i === items.length - 1 });
    }).join('');
  }

  // daily-analysis.html 목록용 요약 행 1건 (탭/전체 목록에서 사용, 클릭 시 상세 렌더링)
  function renderListRow(r, index){
    var meta = CATEGORY_META[r['카테고리']] || { label: r['카테고리'] || '기타', color: 'var(--text-faint)' };
    return '<div class="board-row" data-category="' + esc(r['카테고리'] || '') + '" data-index="' + index + '" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px; border-bottom:1px solid var(--line-soft); cursor:pointer;">' +
        '<div style="display:flex; align-items:center; gap:12px; min-width:0;">' +
          '<span style="flex-shrink:0; font-size:10px; font-weight:700; color:' + meta.color + '; border:1px solid ' + meta.color + '; border-radius:4px; padding:3px 8px;">' + esc(meta.label) + '</span>' +
          '<span style="font-size:14px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + esc(r['헤드라인'] || (r['종목'] + ' 분석')) + '</span>' +
        '</div>' +
        '<span style="flex-shrink:0; font-size:12px; color:var(--text-faint); font-family:\'JetBrains Mono\', monospace;">' + esc(r['날짜']) + '</span>' +
      '</div>';
  }

  // 시트를 가져와서 콜백에 정렬된 rows 배열을 넘겨줌
  function loadRows(onSuccess, onError){
    fetch(CSV_URL, { cache: 'no-store' })
      .then(function(res){ if(!res.ok) throw new Error('sheet fetch failed: ' + res.status); return res.text(); })
      .then(function(csvText){
        var parsed = Papa.parse(csvText.trim(), { header: true, skipEmptyLines: true });
        var rows = parsed.data.filter(function(r){ return r['날짜'] && r['종목']; });
        if(!rows.length) throw new Error('no rows');
        rows.sort(function(a, b){ return String(b['날짜']).localeCompare(String(a['날짜'])); });
        onSuccess(rows);
      })
      .catch(function(err){
        console.error('[일일 실전분석] 로딩 실패:', err);
        if (onError) onError(err);
      });
  }

  global.MijooAnalysis = {
    renderAnalysisBlock: renderAnalysisBlock,
    renderBoardHTML: renderBoardHTML,
    renderListRow: renderListRow,
    getByCategory: getByCategory,
    loadRows: loadRows,
    CATEGORY_META: CATEGORY_META,
    CATEGORY_ORDER: CATEGORY_ORDER,
    esc: esc
  };
})(window);
