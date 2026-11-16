/* ============ Tiện ích chung ============ */
const csrfToken = () => (document.querySelector('meta[name=_csrf]') || {}).content;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

// Đồng hồ
setInterval(() => {
  const el = $('#clock'); if (!el) return;
  const d = new Date(), p = n => String(n).padStart(2, '0');
  el.textContent = ['CN','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][d.getDay()] + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
}, 1000);

function moModal(id) { $('#' + id).classList.add('open'); }
function dongModal(id) { $('#' + id).classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal.open').forEach(m => m.classList.remove('open')); });
document.addEventListener('click', e => { if (e.target.classList && e.target.classList.contains('modal')) e.target.classList.remove('open'); });

/* ============ Modal đặt sân ============ */
function moDatSan(maSan, gio, ngay) {
  const f = $('#formDatSan'); if (!f) { location.href = '/lich-san'; return; }
  if (maSan) f.maSan.value = maSan;
  if (gio) f.batDau.value = gio;
  if (ngay) f.ngay.value = ngay;
  f.ve.value = location.pathname + location.search;
  moModal('modalDatSan'); kiemTraDat();
}
let tDat;
function kiemTraDat() {
  const f = $('#formDatSan'); if (!f) return;
  clearTimeout(tDat);
  tDat = setTimeout(async () => {
    const q = new URLSearchParams({ maSan: f.maSan.value, ngay: f.ngay.value, batDau: f.batDau.value, soPhut: f.soPhut.value });
    if (!f.ngay.value) return;
    const r = await (await fetch('/api/kiem-tra-dat?' + q)).json();
    const kq = $('#kqDat'); kq.className = 'kq ' + (r.ok ? 'ok' : 'err');
    kq.innerHTML = r.ok ? ('Sân trống · Tiền sân <b>' + fmt(r.tienSan) + '</b> · Cọc gợi ý (40%) <b>' + fmt(r.tienCoc) + '</b>') : r.message;
    if (r.ok) { f.tienCoc.placeholder = r.tienCoc; if (!f.tienCoc.dataset.sua) f.tienCoc.value = r.tienCoc; }
    $('#btnLuuDat').disabled = !r.ok;
  }, 150);
}
async function traKhach() {
  const f = $('#formDatSan'); const sdt = f.sdt.value.trim(); if (sdt.length < 8) return;
  const r = await (await fetch('/api/khach?sdt=' + encodeURIComponent(sdt))).json();
  if (r.tim && !f.tenKh.value) f.tenKh.value = r.ten;
  const cb = $('#canhBaoKhach');
  cb.style.display = r.canhBao ? 'block' : 'none'; cb.textContent = r.canhBao ? '⚠ ' + r.canhBao : '';
}
document.addEventListener('DOMContentLoaded', () => {
  const f = $('#formDatSan');
  if (f) {
    ['maSan', 'ngay', 'batDau', 'soPhut'].forEach(n => f[n].addEventListener('change', () => { f.tienCoc.dataset.sua = ''; kiemTraDat(); }));
    f.tienCoc.addEventListener('input', () => f.tienCoc.dataset.sua = '1');
    f.sdt.addEventListener('blur', traKhach);
  }
  /* ===== Lịch sân ===== */
  $$('.tl-grid').forEach(g => g.addEventListener('click', e => {
    if (e.target.closest('.bk')) return;
    const rc = g.getBoundingClientRect();
    let phut = 420 + Math.floor((e.clientX - rc.left) / rc.width * 1020 / 30) * 30;
    phut = Math.min(Math.max(phut, 420), 1380);
    const gio = String(Math.floor(phut / 60)).padStart(2, '0') + ':' + (phut % 60 ? '30' : '00');
    moDatSan(g.dataset.san, gio, g.dataset.ngay);
  }));
  $$('.bk').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const p = $('#bk-' + b.dataset.id); if (!p) return;
    $('#ctBody').innerHTML = p.innerHTML; moModal('modalChiTiet');
  }));
  // lọc theo trạng thái + tìm kiếm
  let tt = '', kw = '';
  const loc = () => $$('.bk').forEach(b => {
    const okTT = !tt || (tt === 'boom' ? ['boom', 'quagio'].includes(b.dataset.tt) : tt === 'da' ? ['xanh'].includes(b.dataset.tt)
      : tt === 'coc' ? ['trang', 'vang'].includes(b.dataset.tt) : tt === 'choc' ? b.dataset.tt === 'choc' : true);
    const okKw = !kw || b.dataset.search.includes(kw);
    b.classList.toggle('dim', !(okTT && okKw));
  });
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); tt = c.dataset.f || ''; loc();
  }));
  const s = $('#timKiem'); if (s) s.addEventListener('input', () => { kw = s.value.trim().toLowerCase(); loc(); });
});

/* ============ Đổi giờ / Thêm giờ (trang chi tiết đơn) ============ */
async function kiemTraDoi(id) {
  const f = $('#formDoi'); const q = new URLSearchParams({ id, batDau: f.batDau.value, soPhut: f.soPhut.value });
  const r = await (await fetch('/api/kiem-tra-doi?' + q)).json();
  const kq = $('#kqDoi'); kq.className = 'kq ' + (r.ok ? 'ok' : 'err');
  kq.textContent = r.ok ? 'Sân trống · tiền sân mới ' + fmt(r.tienSan) : r.message;
  $('#btnDoi').disabled = !r.ok;
}
async function kiemTraThem(id) {
  const f = $('#formThem'); const r = await (await fetch('/api/kiem-tra-them?id=' + id + '&soPhut=' + f.soPhut.value)).json();
  const kq = $('#kqThem'); kq.className = 'kq ' + (r.ok ? 'ok' : 'err');
  kq.textContent = r.ok ? 'Hợp lệ · tiền thêm giờ ' + fmt(r.tienSan) : r.message;
  $('#btnThem').disabled = !r.ok;
}
