# 📁 Manuel Resim Yükleme Rehberi

## Supabase Storage'a Resimleri Manuel Yükleme

### 1. Supabase Dashboard'a Gidin:
- https://supabase.com/dashboard
- Projenizi seçin
- Sol menüden **"Storage"** seçin

### 2. "uploads" Bucket'ını Oluşturun:
- **"New bucket"** butonuna tıklayın
- Bucket adı: `uploads`
- **"Public bucket"** seçin (✅)
- **"Create bucket"** butonuna tıklayın

### 3. Resimleri Yükleyin:
- `uploads` bucket'ına tıklayın
- **"Upload files"** butonuna tıklayın
- `public/uploads/` klasöründeki tüm dosyaları seçin
- **"Upload"** butonuna tıklayın

### 4. Yüklenecek Dosyalar:
```
journal1.jpg
journal2.jpg
journal3.jpg
sample-about.png
slider-1755374548311-347802720.jpg
slider-1755375133927-28923622.jpg
contact-1755454728186-174679198.jpg
introbanner-1754832596941.jpg
introbanner-1754832651214.jpg
introbanner-1754832684232.jpg
introbanner-1754911576790.jpg
1754421757616-740757983.jpg
1754421757616-769464803.jpg
1754592410981-894450477.jpg
1754592414603-806857595.jpg
1754592424642-195148600.mp4
1754592428843-226724001.jpg
1754592440249-69497598.jpg
1754592442912-951363068.mp4
1754592445350-474167658.jpg
1754674202567-196894905.mp4
1754674202570-34358415.jpg
1754674469699-737691846.mp4
1754674469701-675663703.jpg
1754678985763-542213049.jpg
1754678994238-295985177.jpg
1754679008655-796439891.mp4
1754679016816-793087398.jpg
1754679023542-755720944.jpg
1754679031123-26809102.mp4
1754679040458-990897802.jpg
1754679359493-200028473.jpg
1754679359494-813147258.jpg
1754679427783-925650659.jpg
1754679436683-947795366.jpg
1754679440689-48511275.mp4
1754679445281-472484174.jpg
1754679450784-360382934.jpg
1754679454866-13097543.mp4
1754679459518-222581554.jpg
1754679886853-191485567.jpg
1754679886856-238727834.jpg
about-gallery-1755291463542-612868440.jpg
about-gallery-1755291468322-407824118.jpg
about-gallery-1755291474493-817369598.jpg
about-gallery-1755291483125-259379146.jpg
about-gallery-1755291516365-214062566.jpg
```

### 5. Veritabanını Güncelleyin:
Resimler yüklendikten sonra `update-image-paths.sql` dosyasını Supabase SQL Editor'da çalıştırın.

### 6. Test Edin:
Sitenizi yeniden yükleyin ve resimlerin görünüp görünmediğini kontrol edin.
