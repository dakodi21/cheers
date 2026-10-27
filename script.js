/* =====================================================
   PENGATURAN MUDAH DIEDIT
   ===================================================== */
const WA_NUMBER = "6283109185203"; // 083109185203 format internasional

// Ongkir per dus (rupiah). Ubah angka ini kalau tarif berubah.
const ONGKIR_PER_DUS = 600;

// Harga per dus (galon: per galon). n = isi per dus, u = satuan isi.
// Isi 1500 ml = 12 botol (sesuai listing penjual Cheers). Isi 220/230/330 ml = 24 botol adalah perkiraan umum, mohon dicek ke distributor.
const PRODUCTS = [
  { id: 1,  type: "Natural",  name: "Cheers Natural Botol 220 ml", size: "220 ml",  unit: "dus",   n: 24,   u: "botol",  price: 30000, img: IMG.nbtl220 },
  { id: 2,  type: "Natural",  name: "Cheers Natural Gelas 220 ml", size: "220 ml",  unit: "dus",   n: 48,   u: "gelas",  price: 28000, img: IMG.ncup },
  { id: 3,  type: "Natural",  name: "Cheers Natural 330 ml",       size: "330 ml",  unit: "dus",   n: 24,   u: "botol",  price: 41000, img: IMG.n330 },
  { id: 4,  type: "Natural",  name: "Cheers Natural 600 ml",       size: "600 ml",  unit: "dus",   n: 24,   u: "botol",  price: 45000, img: IMG.n600 },
  { id: 5,  type: "Natural",  name: "Cheers Natural 1500 ml",      size: "1500 ml", unit: "dus",   n: 12,   u: "botol",  price: 47000, img: IMG.n1500 },
  { id: 6,  type: "Alkaline", name: "Cheers Alkaline 230 ml",      size: "230 ml",  unit: "dus",   n: 24,   u: "botol",  price: 45000, img: IMG.a230 },
  { id: 7,  type: "Alkaline", name: "Cheers Alkaline 330 ml",      size: "330 ml",  unit: "dus",   n: 24,   u: "botol",  price: 48000, img: IMG.a330 },
  { id: 8,  type: "Alkaline", name: "Cheers Alkaline 500 ml",      size: "500 ml",  unit: "dus",   n: 24,   u: "botol",  price: 55000, img: IMG.a500 },
  { id: 9,  type: "Alkaline", name: "Cheers Alkaline 1200 ml",     size: "1200 ml", unit: "dus",   n: 12,   u: "botol",  price: 55000, img: IMG.a1200 },
  { id: 10, type: "Alkaline", name: "Cheers Alkaline Galon",       size: "Galon",   unit: "galon", n: null, u: null,     price: 22000, img: IMG.agalon },
];
PRODUCTS.forEach(p => { p.pack = p.n ? `1 ${p.unit} = ${p.n} ${p.u}` : `Harga per ${p.unit}`; });

// Info detail produk (diambil dari data di atas)
const DESC = {
  Natural: "Air mineral alami dari sumber mata air terlindungi, diproduksi higienis dengan teknologi modern tanpa bahan kimia tambahan.",
  Alkaline: "Air minum Alkaline dengan pH 8,5+ dari sumber mata air terlindungi, diproduksi higienis tanpa bahan kimia tambahan."
};

// 10 testimoni dalam bentuk bubble chat WhatsApp. Isi: [teks testimoni, id produk yang dibeli, nama pelanggan].
// Nama boleh dikosongkan, nanti tampil "Pelanggan Cheers". Pakai nama asli hanya kalau pelanggan sudah setuju.
// Foto testimoni 1-7 ada di images.js (IMG.t1 ... IMG.t7). Semua foto memperlihatkan botol Alkaline 500 ml.
// PENTING: pastikan setiap testimoni benar dari pelanggan Cheers, dan sesuaikan id produk dengan
// produk yang benar-benar mereka beli (id ada di daftar PRODUCTS di atas).
// Tangkapan layar asli (nomor HP sudah disensor, bisa pakai sensor.html) simpan di folder "testimoni"
// dengan nama 1.jpg, 2.jpg, ... 10.jpg sesuai urutan. Kalau file tidak ada, gambar otomatis disembunyikan.
const TESTIMONIALS = [
  ["Sudah beberapa kali beli Cheers untuk kebutuhan di rumah. Sejauh ini puas, praktis juga buat stok air minum sehari-hari", 8],
  ["Airnya jernih dan rasanya netral, cocok buat diminum setiap hari. Kualitasnya sejauh ini oke, semoga tetap dipertahankan", 8],
  ["Pelayanannya ramah dan proses pembeliannya juga gampang. Cocok banget buat yang butuh air minum untuk kebutuhan keluarga", 8],
  ["Awalnya coba beli Cheers karena butuh air minum di rumah, ternyata cocok. Sekarang jadi salah satu pilihan buat persediaan sehari-hari", 8],
  ["Menurut saya kualitasnya cukup bagus dan harganya juga sesuai. Bisa jadi pilihan untuk memenuhi kebutuhan air minum di rumah", 8],
  ["Sudah langganan beli Cheers beberapa kali dan sejauh ini tidak ada kendala. Praktis untuk kebutuhan minum sehari-hari bersama keluarga", 8],
  ["Suka karena air minumnya praktis untuk disediakan di rumah. Kalau stok mulai habis, tinggal beli lagi untuk persediaan", 8],
  ["Pelayanannya cukup memuaskan dan proses pesan airnya tidak ribet. Sejauh ini pengalaman beli Cheers cukup baik", 7, "Karina Dya"],
  ["Cocok buat kebutuhan air minum sehari-hari, baik di rumah maupun saat ada banyak aktivitas. Sejauh ini kualitasnya juga oke", 6],
  ["Pertama kali coba Cheers dan sejauh ini cukup puas. Semoga kualitas air dan pelayanannya tetap bagus supaya bisa terus jadi pilihan", 2],
];

/* =====================================================
   LOGIKA
   ===================================================== */
const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const $ = id => document.getElementById(id);
let cart = {};
try { cart = JSON.parse(localStorage.getItem("cheersCart2")) || {}; } catch (e) {}

function save() { try { localStorage.setItem("cheersCart2", JSON.stringify(cart)); } catch (e) {} }
const lines = () => PRODUCTS.filter(p => cart[p.id]).map(p => ({ ...p, qty: cart[p.id], sub: p.price * cart[p.id] }));
const total = () => lines().reduce((s, l) => s + l.sub, 0);
const qtyAll = () => lines().reduce((s, l) => s + l.qty, 0);
const ongkir = () => qtyAll() * ONGKIR_PER_DUS;
const grand = () => total() + ongkir();

function imgFallback(el) {
  if (!el.dataset.tried) {
    el.dataset.tried = "1";
    el.src = el.getAttribute("src").split("/").pop();
  } else {
    el.onerror = null;
    el.src = "data:image/svg+xml;utf8," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#f1e6d8"/><text x="200" y="250" text-anchor="middle" font-family="Arial" font-size="20" fill="#9b7653">Foto belum ditemukan</text></svg>');
  }
}

// Katalog
function renderProducts(filter = "all") {
  $("productGrid").innerHTML = PRODUCTS.filter(p => filter === "all" || p.type === filter).map(p => `
    <article class="card" data-id="${p.id}" tabindex="0" aria-label="Lihat detail ${p.name}">
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)">
      <div class="card-body">
        <span class="tag ${p.type}">${p.type}</span>
        <h3>${p.name}</h3>
        <small>${p.pack}</small>
        <div class="price">${rupiah(p.price)}</div>
        <button class="add" data-id="${p.id}">Tambah ke keranjang</button>
      </div>
    </article>`).join("");
}

// Keranjang + ringkasan form
function renderCart() {
  const ls = lines();
  $("cartItems").innerHTML = ls.length ? ls.map(l => `
    <div class="item">
      <b>${l.name}</b><b>${rupiah(l.sub)}</b>
      <div class="qty">
        <button data-act="dec" data-id="${l.id}" aria-label="Kurangi">-</button>${l.qty} ${l.unit}
        <button data-act="inc" data-id="${l.id}" aria-label="Tambah">+</button>
      </div>
      <button data-act="del" data-id="${l.id}" class="link">Hapus</button>
    </div>`).join("") : '<p class="empty">Keranjang masih kosong. Pilih produk dari katalog.</p>';
  $("orderList").innerHTML = ls.length ? ls.map(l => `<div class="row"><span>${l.qty} ${l.unit} ${l.name}</span><span>${rupiah(l.sub)}</span></div>`).join("") : '<p class="empty">Belum ada produk dipilih.</p>';
  const sub = rupiah(total()), ship = rupiah(ongkir()), gr = rupiah(grand());
  $("cartSub").textContent = sub; $("cartShip").textContent = ship; $("cartTotal").textContent = gr;
  $("orderSubtotal").textContent = sub; $("orderShip").textContent = ship; $("orderTotal").textContent = gr;
  $("cartCount").textContent = qtyAll();
  $("floatTotal").textContent = gr; $("floatCta").hidden = !ls.length;
  save();
}

function toggleDrawer(show) { $("drawer").classList.toggle("show", show); $("overlay").classList.toggle("show", show); }

document.addEventListener("click", e => {
  const add = e.target.closest(".add");
  if (add) { const id = add.dataset.id; cart[id] = (cart[id] || 0) + 1; renderCart(); toggleDrawer(true); return; }
  const cardEl = e.target.closest(".card");
  if (cardEl) { openDetail(cardEl.dataset.id); return; }
  const b = e.target.closest("[data-act]");
  if (b) {
    const id = b.dataset.id;
    if (b.dataset.act === "inc") cart[id]++;
    if (b.dataset.act === "dec") cart[id]--;
    if (b.dataset.act === "del" || cart[id] <= 0) delete cart[id];
    renderCart(); return;
  }
  const chip = e.target.closest(".chip");
  if (chip) {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active"); renderProducts(chip.dataset.f);
  }
});
// Detail produk
let detailId = null, detailQty = 1;
function openDetail(id) {
  const p = PRODUCTS.find(x => x.id == id); if (!p) return;
  detailId = p.id; detailQty = 1; $("dQty").textContent = 1;
  $("dImg").src = p.img; $("dImg").alt = p.name; $("dImg").removeAttribute("data-tried"); $("dImg").onerror = function () { imgFallback(this); };
  $("dTag").textContent = p.type; $("dTag").className = "tag " + p.type;
  $("dName").textContent = p.name; $("dDesc").textContent = DESC[p.type];
  const rows = [["Jenis", p.type], ["Ukuran", p.size]];
  if (p.n) rows.push(["Isi per " + p.unit, p.n + " " + p.u]);
  rows.push(["Harga per " + p.unit, rupiah(p.price)]);
  if (p.n) rows.push(["Harga per " + p.u + " (hitungan)", "± " + rupiah(Math.round(p.price / p.n))]);
  rows.push(["Ongkir", rupiah(ONGKIR_PER_DUS) + " / " + p.unit]);
  $("dSpecs").innerHTML = rows.map(r => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join("");
  $("dPrice").textContent = rupiah(p.price) + " / " + p.unit;
  $("detailModal").classList.add("show");
}
const closeDetail = () => $("detailModal").classList.remove("show");
$("closeDetail").onclick = closeDetail;
$("detailModal").addEventListener("click", e => { if (e.target === $("detailModal")) closeDetail(); });
$("dMinus").onclick = () => { detailQty = Math.max(1, detailQty - 1); $("dQty").textContent = detailQty; };
$("dPlus").onclick = () => { detailQty++; $("dQty").textContent = detailQty; };
$("dAdd").onclick = () => { cart[detailId] = (cart[detailId] || 0) + detailQty; renderCart(); closeDetail(); toggleDrawer(true); };
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeDetail();
  if (e.key === "Enter" && e.target.classList && e.target.classList.contains("card")) openDetail(e.target.dataset.id);
});

$("openCart").onclick = () => toggleDrawer(true);
$("closeCart").onclick = $("overlay").onclick = $("toForm").onclick = () => toggleDrawer(false);

// Checkout
function buildOrderMessage(id, f, pay) {
  const items = lines().map((l, i) => `${i + 1}. ${l.name} x ${l.qty} ${l.unit} = ${rupiah(l.sub)}`).join("\n");
  return `Halo Cheers, saya mau pesan:\n\n*No. Pesanan: ${id}*\n${items}\n\nSubtotal: ${rupiah(total())}\nOngkir (${qtyAll()} x ${rupiah(ONGKIR_PER_DUS)}): ${rupiah(ongkir())}\n*Total bayar: ${rupiah(grand())}*\n\n` +
    `Nama: ${f.name}\nWhatsApp: ${f.phone}\nAlamat pengantaran: ${f.address}\nPembayaran: ${pay === "qris" ? "QRIS" : "Cash"}\nCatatan: ${f.note || "-"}` +
    (pay === "qris" ? "\n\nSaya akan bayar via QRIS dan kirim bukti pembayaran." : "");
}
const raw0 = n => String(n);
const waLink = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

// Invoice (gambar PNG dibuat di browser, tanpa library)
async function downloadInvoice(o) {
  try { await document.fonts.ready; } catch (e) {}
  const W = 800, P = 48, S = 2;
  const C = { cocoa: "#4a3526", brown: "#9b7653", blue: "#3f78ae", red: "#d9232d", latte: "#f1e6d8", line: "#e4d5c2" };
  const BODY = 'Jost, Arial, sans-serif', HEAD = '"DM Serif Display", Georgia, serif';
  const cv = document.createElement("canvas");
  const wrap = (ctx, text, maxW) => {
    const out = []; let line = "";
    text.split(/\s+/).forEach(w => { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; });
    if (line) out.push(line); return out;
  };
  function render(H) {
    cv.width = W * S; cv.height = H * S;
    const x = cv.getContext("2d"); x.scale(S, S);
    x.fillStyle = "#fffdf9"; x.fillRect(0, 0, W, H);
    const txt = (t, px, py, font, color, align = "left") => { x.font = font; x.fillStyle = color; x.textAlign = align; x.fillText(t, px, py); };
    const hr = yy => { x.strokeStyle = C.line; x.lineWidth = 1; x.beginPath(); x.moveTo(P, yy); x.lineTo(W - P, yy); x.stroke(); };
    x.fillStyle = C.blue; x.fillRect(0, 0, W, 10);
    let y = 78;
    txt("CV Ari Makmur", P, y, '800 40px "Baloo 2", Arial, sans-serif', C.red);
    txt("Healthy Drinking Water", P + 2, y + 24, '600 15px ' + BODY, C.red);
    txt("INVOICE", W - P, y, '40px ' + HEAD, C.cocoa, "right");
    txt("No. " + o.id, W - P, y + 26, '600 16px ' + BODY, C.brown, "right");
    txt(o.date.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" }), W - P, y + 48, '15px ' + BODY, C.brown, "right");
    y += 78; hr(y); y += 36;
    txt("DITAGIHKAN KEPADA", P, y, '600 13px ' + BODY, C.brown); y += 28;
    txt(o.f.name, P, y, '600 20px ' + BODY, C.cocoa); y += 26;
    txt(o.f.phone, P, y, '17px ' + BODY, C.cocoa); y += 26;
    x.font = '17px ' + BODY;
    wrap(x, o.f.address, W - P * 2).forEach(l => { txt(l, P, y, '17px ' + BODY, C.cocoa); y += 25; });
    y += 14;
    x.fillStyle = C.latte; x.fillRect(P, y, W - P * 2, 40);
    const cQty = 440, cPrice = 600, cSub = W - P - 12;
    txt("Produk", P + 12, y + 26, '600 15px ' + BODY, C.cocoa);
    txt("Jumlah", cQty, y + 26, '600 15px ' + BODY, C.cocoa, "center");
    txt("Harga", cPrice, y + 26, '600 15px ' + BODY, C.cocoa, "right");
    txt("Subtotal", cSub, y + 26, '600 15px ' + BODY, C.cocoa, "right");
    y += 40;
    o.items.forEach(l => {
      y += 32;
      txt(l.name, P + 12, y, '17px ' + BODY, C.cocoa);
      txt(l.qty + " " + l.unit, cQty, y, '17px ' + BODY, C.cocoa, "center");
      txt(rupiah(l.price), cPrice, y, '17px ' + BODY, C.cocoa, "right");
      txt(rupiah(l.sub), cSub, y, '600 17px ' + BODY, C.cocoa, "right");
      y += 12; hr(y);
    });
    y += 34;
    txt("Subtotal", cPrice - 80, y, '17px ' + BODY, C.brown, "right"); txt(rupiah(o.total), cSub, y, '17px ' + BODY, C.cocoa, "right"); y += 28;
    txt("Ongkir (" + o.qty + " x " + rupiah(ONGKIR_PER_DUS) + ")", cPrice - 80, y, '17px ' + BODY, C.brown, "right"); txt(rupiah(o.ship), cSub, y, '17px ' + BODY, C.cocoa, "right"); y += 18;
    x.strokeStyle = C.blue; x.lineWidth = 2; x.beginPath(); x.moveTo(P + 280, y); x.lineTo(W - P, y); x.stroke(); y += 36;
    txt("Total bayar", cPrice - 80, y, '600 18px ' + BODY, C.cocoa, "right"); txt(rupiah(o.grand), cSub, y, '30px ' + HEAD, C.blue, "right"); y += 36;
    x.fillStyle = "#eaf5ff"; x.fillRect(P, y, W - P * 2, 74);
    txt("Metode pembayaran: " + (o.pay === "qris" ? "QRIS" : "Cash"), P + 18, y + 30, '600 16px ' + BODY, C.cocoa);
    txt("Bukti pembayaran sudah dikirim, menunggu konfirmasi admin.", P + 18, y + 54, '15px ' + BODY, C.brown);
    y += 74 + 38;
    txt("Terima kasih sudah membeli!", W / 2, y, '26px ' + HEAD, C.cocoa, "center"); y += 26;
    txt("Mohon tunggu, pesananmu akan diantar sampai ke rumah.", W / 2, y, '16px ' + BODY, C.brown, "center"); y += 22;
    txt("Pertanyaan pesanan, hubungi WhatsApp: 083109185203", W / 2, y, '14px ' + BODY, C.brown, "center");
    return y + P;
  }
  const finalH = render(3000);
  render(finalH);
  cv.toBlob(b => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = "Invoice-" + o.id + ".png";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }, "image/png");
}

// ===== QRIS dinamis: nominal otomatis terisi sesuai total bayar =====
// Isi QRIS statis Cheers (hasil baca QR qris_richie.jpeg). Jangan diubah kecuali QRIS-nya diganti.
const QRIS_STATIC = "00020101021126570011ID.DANA.WWW011893600915325018319002092501831900303UMI51440014ID.CO.QRIS.WWW0215ID10254498929220303UMI5204549953033605802ID5906Cheers600409966105571536304DA94";
function crc16(s) {
  let c = 0xFFFF;
  for (let i = 0; i < s.length; i++) {
    c ^= s.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
  }
  return c.toString(16).toUpperCase().padStart(4, "0");
}
function qrisDynamic(amount) {
  const amt = String(Math.round(amount));
  let p = QRIS_STATIC.slice(0, -4).replace("010211", "010212");
  p = p.replace("5802ID", "54" + String(amt.length).padStart(2, "0") + amt + "5802ID");
  return p + "6304" + crc16(p + "6304");
}
function qrisImageFor(amount) {
  const q = qrcode(0, "M"); q.addData(qrisDynamic(amount)); q.make();
  return "data:image/svg+xml;utf8," + encodeURIComponent(q.createSvgTag({ cellSize: 6, margin: 4, scalable: true }));
}

$("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const pay = document.querySelector('input[name="pay"]:checked').value;
  const f = { name: $("fName").value.trim(), phone: $("fPhone").value.trim(), address: $("fAddress").value.trim(), note: $("fNote").value.trim() };
  const err = $("formError");
  if (!lines().length) { err.textContent = "Keranjang masih kosong. Tambahkan produk dulu."; return; }
  if (!f.name || !f.phone || !f.address) { err.textContent = "Nama, nomor WhatsApp, dan alamat wajib diisi."; return; }
  if (!/^[0-9+\s-]{9,15}$/.test(f.phone)) { err.textContent = "Nomor WhatsApp tidak valid. Contoh: 08123456789"; return; }
  err.textContent = "";

  const id = "CHR-" + Date.now().toString().slice(-6);
  const amount = rupiah(grand());
  const orderUrl = waLink(buildOrderMessage(id, f, pay));
  const qris = pay === "qris";
  const order = { id, date: new Date(), f, items: lines(), total: total(), ship: ongkir(), qty: qtyAll(), grand: grand(), pay };

  window.open(orderUrl, "_blank");
  $("payTitle").textContent = qris ? "Bayar dengan QRIS" : "Pesanan diterima";
  $("payText").innerHTML = `Pesanan <strong>${id}</strong> sudah dikirim ke WhatsApp.<br>` +
    (qris ? "Scan QRIS Cheers dan bayar sesuai nominal:" : "Terima kasih sudah memesan! Mohon tunggu, pesananmu akan diantar sampai ke rumah. Siapkan uang cash, bayar ke kurir saat barang tiba. Total bayar:");
  $("payAmount").textContent = amount;
  $("payNote").textContent = `Nominal sudah termasuk ongkir ${rupiah(order.ship)} (${order.qty} x ${rupiah(ONGKIR_PER_DUS)}).`;
  $("payAmount").hidden = false; $("payNote").hidden = false; $("invoiceBtn").hidden = true;
  $("resendBtn").textContent = "WhatsApp belum terbuka? Kirim pesanan lagi";
  if (qris) {
    // Bawaan: QRIS asli Cheers (pasti valid), pembeli mengetik nominal. Opsi kedua: QR dengan nominal terisi otomatis.
    const showStatic = () => {
      $("qrisImg").src = IMG.qris;
      $("qrisCap").textContent = "Scan QRIS Cheers lalu ketik nominal " + amount + " saat membayar.";
      $("tabStatic").classList.add("active"); $("tabDyn").classList.remove("active");
    };
    const showDynamic = () => {
      try {
        $("qrisImg").src = qrisImageFor(order.grand);
        $("qrisCap").textContent = "Nominal " + amount + " terisi otomatis. Kalau aplikasi menolak QR ini, pakai QRIS asli.";
        $("tabDyn").classList.add("active"); $("tabStatic").classList.remove("active");
      } catch (err) { showStatic(); }
    };
    $("tabStatic").onclick = showStatic; $("tabDyn").onclick = showDynamic;
    $("copyAmt").onclick = () => {
      const raw = String(order.grand);
      const done = () => { $("copyAmt").textContent = "Nominal tersalin: " + raw; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(raw).then(done, () => prompt("Salin nominal:", raw));
      else prompt("Salin nominal:", raw);
    };
    $("copyAmt").textContent = "Salin nominal (" + raw0(order.grand) + ")";
    showStatic();
  }
  $("qrisWrap").hidden = !qris;
  $("proofBtn").hidden = !qris;
  $("proofBtn").href = waLink(`Halo Cheers, ini bukti pembayaran untuk pesanan ${id} atas nama ${f.name}. (Bukti transfer saya lampirkan di chat ini)`);
  $("resendBtn").href = orderUrl;
  // Setelah bukti bayar dikirim: ucapan terima kasih
  const proofUrl = $("proofBtn").href;
  $("proofBtn").onclick = () => {
    $("payTitle").textContent = "Terima kasih sudah membeli!";
    $("payText").innerHTML = `Bukti pembayaran pesanan <strong>${id}</strong> sudah dikirim. Mohon tunggu ya, pesananmu akan segera diantar sampai ke rumah.`;
    $("payAmount").hidden = true; $("payNote").hidden = true; $("qrisWrap").hidden = true; $("proofBtn").hidden = true;
    $("invoiceBtn").hidden = false; $("invoiceBtn").onclick = () => downloadInvoice(order);
    $("resendBtn").href = proofUrl; $("resendBtn").textContent = "WhatsApp belum terbuka? Kirim bukti bayar lagi";
  };
  $("payModal").classList.add("show");
  cart = {}; renderCart(); $("orderForm").reset();
});
$("closePay").onclick = () => $("payModal").classList.remove("show");

// Testimoni: bisa digeser (swipe di HP, drag mouse, atau tombol panah) dan bisa diklik untuk detail
const prodOf = t => PRODUCTS.find(p => p.id === t[1]);
const bubble = (t, i) => { const p = prodOf(t); const ph = (typeof IMG !== "undefined") && IMG["t" + (i + 1)];
  return `<div class="wa"><span class="wa-name">${t[2] || "Pelanggan Cheers"}</span>` +
  (ph ? `<img class="wa-photo" src="${ph}" alt="Foto pelanggan memegang Cheers">` : "") +
  `<div class="wa-quote"><strong>Membeli produk</strong>${p ? p.name : "Cheers"}</div>` +
  `<div class="wa-text">${t[0]}</div><span class="wa-tick">&#10003;&#10003;</span></div>`; };
const card = (t, i) => `<div class="testi" data-i="${i}" tabindex="0" role="button" aria-label="Lihat detail testimoni ${i + 1}">${bubble(t, i)}</div>`;
const track = $("testiTrack");
track.innerHTML = TESTIMONIALS.map(card).join("");
const step = () => (track.querySelector(".testi").offsetWidth + 20);
$("testiPrev").onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
$("testiNext").onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
track.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") track.scrollBy({ left: step(), behavior: "smooth" });
  if (e.key === "ArrowLeft") track.scrollBy({ left: -step(), behavior: "smooth" });
  if (e.key === "Enter" && e.target.classList.contains("testi")) openTesti(e.target.dataset.i);
});
let dragged = false;
(function drag() {
  let down = false, startX = 0, startLeft = 0, id = null;
  track.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse") return;
    down = true; dragged = false; startX = e.clientX; startLeft = track.scrollLeft; id = e.pointerId;
  });
  track.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!dragged && Math.abs(dx) > 6) { dragged = true; track.classList.add("dragging"); track.setPointerCapture(id); }
    if (dragged) track.scrollLeft = startLeft - dx;
  });
  const end = () => { down = false; track.classList.remove("dragging"); setTimeout(() => dragged = false, 0); };
  track.addEventListener("pointerup", end); track.addEventListener("pointercancel", end);
})();

// Detail testimoni
function openTesti(i) {
  const t = TESTIMONIALS[i]; if (!t) return;
  $("tBubble").innerHTML = bubble(t, Number(i));
  const img = $("tImg"); img.hidden = true;
  img.onload = () => { img.hidden = false; };
  img.onerror = () => { img.hidden = true; };
  if (!IMG["t" + (Number(i) + 1)]) img.src = "testimoni/" + (Number(i) + 1) + ".jpg";
  $("testiModal").classList.add("show");
}
const closeTesti = () => $("testiModal").classList.remove("show");
track.addEventListener("click", e => {
  if (dragged) return;
  const c = e.target.closest(".testi"); if (c) openTesti(c.dataset.i);
});
$("closeTesti").onclick = closeTesti;
$("testiModal").addEventListener("click", e => { if (e.target === $("testiModal")) closeTesti(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeTesti(); });

$("qrisImg").src = IMG.qris;
$("heroImg").src = IMG.hero;
renderProducts();
renderCart();
