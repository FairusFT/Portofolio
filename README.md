# FAIRUS.SYS — Portfolio

Portofolio interaktif yang dibangun dari nol tanpa template: **computer vision, embedded AI, dan agent systems**.

🌐 **Live: [fairusft.github.io/Portofolio](https://fairusft.github.io/Portofolio/)** — juga tersedia di [http://187.77.119.118:3001](http://187.77.119.118:3001)

## Isi
- **9 projek** dengan bukti foto asli (face detection, object detection, ESP32-CAM × Web, YOLOv8, hand detection, Google ADK, Hermes Agent × Telegram × 9Router, Arduino LCD I2C, web app)
- **Terminal interaktif** — benar-benar jalan di browser (coba: `help`, `whoami`, `projects`, `sudo`)
- Galeri bukti foto + lightbox, filter projek, marquee stack, timeline perjalanan
- Boot loader, cursor custom, scroll progress, scanline/detect effect, dark theme dengan 4 pilihan aksen
- Vanilla HTML/CSS/JS — tanpa framework, tanpa build step

## Struktur
```
index.html      # shell + semua section
styles.css      # tema & animasi
script.js       # data projek, terminal, canvas, galeri, interaksi
assets/evidence/# 13 foto bukti
```

## Menjalankan lokal
```bash
python3 -m http.server 3001
# buka http://localhost:3001
```

Kontak: [GitHub @FairusFT](https://github.com/FairusFT) · [Instagram @fairusft](https://instagram.com/fairusft)
