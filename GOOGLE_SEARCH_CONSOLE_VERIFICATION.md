# Cara Verifikasi Google Search Console untuk tekna.id

## 🚨 MASALAH SAAT INI:
- Metode verifikasi DNS TXT gagal
- Google tidak menemukan token: `google-site-verification=dUP293sjOn3I-CYGejwzikIUXE1qB27-TYSaIE1wClY`
- Hanya ditemukan record SPF: `v=spf1 include:_spf.mail.hostinger.com ~all`

## ✅ SOLUSI 1: VERIFIKASI VIA META TAG (RECOMMENDED)

Karena Anda sudah menambahkan meta tag di website, gunakan metode ini:

### Langkah-langkah:
1. **Pastikan website sudah di-deploy** dengan meta tag terbaru
2. **Buka Google Search Console**
3. **Pilih metode verifikasi "HTML tag"** (bukan DNS)
4. **Masukkan property:** `https://tekna.id`
5. **Google akan mencari meta tag ini di website:**
   ```html
   <meta name="google-site-verification" content="dUP293sjOn3I-CYGejwzikIUXE1qB27-TYSaIE1wClY" />
   ```

### Verifikasi Meta Tag Sudah Ada:
```bash
# Test manual
curl -s https://tekna.id | grep "google-site-verification"
```

## ✅ SOLUSI 2: TAMBAH DNS TXT RECORD DI HOSTINGER

Jika tetap ingin menggunakan verifikasi DNS:

### Langkah-langkah di Hostinger:
1. **Login ke Hostinger Control Panel**
2. **Pilih domain tekna.id**
3. **Masuk ke DNS Zone Editor**
4. **Tambah TXT Record baru:**
   - **Type:** TXT
   - **Name:** @ (atau kosong untuk root domain)
   - **Value:** `google-site-verification=dUP293sjOn3I-CYGejwzikIUXE1qB27-TYSaIE1wClY`
   - **TTL:** 3600 (atau default)

### Contoh DNS Records yang harus ada:
```
Type    Name    Value
TXT     @       google-site-verification=dUP293sjOn3I-CYGejwzikIUXE1qB27-TYSaIE1wClY
TXT     @       v=spf1 include:_spf.mail.hostinger.com ~all
```

### Verifikasi DNS TXT Record:
```bash
# Test DNS propagation
nslookup -type=txt tekna.id
# atau
dig TXT tekna.id
```

## ✅ SOLUSI 3: UPLOAD HTML FILE (ALTERNATIVE)

Jika kedua metode di atas gagal:

### Langkah-langkah:
1. **Download file HTML dari Google Search Console**
2. **Upload ke root directory website** (public folder)
3. **Pastikan file bisa diakses via:**
   `https://tekna.id/googleXXXXXXXXXXXX.html`

## 🚀 RECOMMENDED ACTION PLAN:

### PILIHAN 1: META TAG (PALING MUDAH)
1. Deploy website dengan update layout.tsx terbaru
2. Tunggu 5-10 menit
3. Coba verifikasi via "HTML tag" method di Google Search Console
4. Jika berhasil → SELESAI ✅

### PILIHAN 2: DNS TXT (JIKA PILIHAN 1 GAGAL)
1. Login ke Hostinger
2. Tambah TXT record seperti panduan di atas
3. Tunggu 2-24 jam untuk DNS propagation
4. Coba verifikasi lagi

## 🔍 TROUBLESHOOTING:

### Jika Meta Tag Tidak Terdeteksi:
- Pastikan website sudah di-deploy ke production
- Clear cache browser dan CDN
- Test dengan: `view-source:https://tekna.id`
- Cek apakah meta tag ada di HTML source

### Jika DNS TXT Tidak Terdeteksi:
- Tunggu lebih lama (24-48 jam)
- Pastikan format TXT record benar (tanpa quotes)
- Gunakan DNS checker online: whatsmydns.net

### Error Messages & Solutions:
- **"Token not found"** → Meta tag belum di-deploy atau salah format
- **"DNS propagation"** → Tunggu lebih lama, maksimal 48 jam
- **"Access denied"** → Cek firewall atau security settings

## 📞 SUPPORT CONTACT:
- **Hostinger Support:** Live chat atau ticket
- **Google Search Console Help:** https://support.google.com/webmasters/