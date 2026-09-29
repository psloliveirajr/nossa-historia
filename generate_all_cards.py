import os
import subprocess
import qrcode
import pypdf
from PIL import Image, ImageDraw

PROJECT_DIR = os.path.abspath(os.path.dirname(__file__))
IMAGES_DIR = os.path.join(PROJECT_DIR, "assets", "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

# 1. Generate High-Res QR Code (1000x1000)
qr_path = os.path.join(IMAGES_DIR, "qrcode_site.png")
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=2,
)
qr.add_data("https://pauloeclara.online")
qr.make(fit=True)

qr_img = qr.make_image(fill_color="#580820", back_color="#ffffff").convert("RGBA")
w, h = qr_img.size

# Heart badge in center
badge_r = int(w * 0.108)
cx, cy = w // 2, h // 2
draw = ImageDraw.Draw(qr_img)
draw.ellipse([cx - badge_r, cy - badge_r, cx + badge_r, cy + badge_r], fill="#ffffff", outline="#c59b27", width=6)

heart_size = badge_r * 0.68
r = heart_size * 0.32
lx = cx - r * 0.85
ly = cy - r * 0.45
rx = cx + r * 0.85
ry = cy - r * 0.45
draw.ellipse([lx - r, ly - r, lx + r, ly + r], fill="#e11d48")
draw.ellipse([rx - r, ry - r, rx + r, ry + r], fill="#e11d48")
poly = [
    (lx - r * 0.95, ly + r * 0.2),
    (rx + r * 0.95, ry + r * 0.2),
    (cx, cy + heart_size * 0.76)
]
draw.polygon(poly, fill="#e11d48")
qr_img.save(qr_path)
print("QR Code generated:", qr_path)

cover_img_path = os.path.join(IMAGES_DIR, "card_cover_a6.jpg")

# 2. Reusable CSS for Card Front and Back
card_css = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .card-box {
    width: 148mm;
    height: 105mm;
    position: relative;
    overflow: hidden;
  }

  /* FRENTE */
  .card-front {
    background: #f5f1e6;
  }
  .card-front img {
    width: 148mm;
    height: 105mm;
    object-fit: cover;
    display: block;
  }

  /* VERSO */
  .card-back {
    background: #fdfbf7;
    background-image: 
      radial-gradient(circle at 15% 15%, rgba(244, 63, 94, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 85% 85%, rgba(197, 155, 39, 0.05) 0%, transparent 50%),
      radial-gradient(rgba(197, 155, 39, 0.09) 0.6px, transparent 0.6px);
    background-size: auto, auto, 12px 12px;
    padding: 7mm 8mm;
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .border-outer {
    position: absolute;
    top: 4.5mm;
    left: 4.5mm;
    right: 4.5mm;
    bottom: 4.5mm;
    border: 1.2px solid #c59b27;
    pointer-events: none;
    z-index: 10;
  }
  .border-inner {
    position: absolute;
    top: 5.8mm;
    left: 5.8mm;
    right: 5.8mm;
    bottom: 5.8mm;
    border: 0.6px dashed rgba(197, 155, 39, 0.65);
    pointer-events: none;
    z-index: 10;
  }

  .corner-ornament {
    position: absolute;
    width: 13mm;
    height: 13mm;
    pointer-events: none;
    z-index: 11;
  }
  .c-tl { top: 4.5mm; left: 4.5mm; }
  .c-tr { top: 4.5mm; right: 4.5mm; transform: scaleX(-1); }
  .c-bl { bottom: 4.5mm; left: 4.5mm; transform: scaleY(-1); }
  .c-br { bottom: 4.5mm; right: 4.5mm; transform: scale(-1, -1); }

  .postcard-line {
    position: absolute;
    left: 55%;
    top: 8mm;
    bottom: 8mm;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent,
      rgba(197, 155, 39, 0.3) 15%,
      rgba(225, 29, 72, 0.35) 50%,
      rgba(197, 155, 39, 0.3) 85%,
      transparent);
    z-index: 5;
  }
  .postcard-heart-badge {
    position: absolute;
    left: 55%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fdfbf7;
    padding: 3px 0;
    color: #e11d48;
    font-size: 8pt;
    z-index: 6;
  }

  .layout-grid {
    position: relative;
    z-index: 8;
    display: flex;
    width: 100%;
    height: 100%;
  }

  .col-letter {
    width: 53%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 4mm;
    padding-left: 1mm;
    padding-top: 1mm;
  }

  .header-box {
    margin-bottom: 1.5mm;
  }
  .eyebrow {
    font-family: 'Dancing Script', cursive;
    font-size: 13pt;
    color: #be123c;
    line-height: 1.1;
  }
  .main-title {
    font-family: 'Playfair Display', serif;
    font-size: 15pt;
    font-weight: 700;
    color: #4c0519;
    letter-spacing: 0.2px;
    line-height: 1.15;
  }
  .date-badge {
    display: inline-block;
    font-size: 6pt;
    font-weight: 600;
    color: #9f1239;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-top: 0.8mm;
  }

  .quote-card {
    background: rgba(255, 241, 242, 0.75);
    border-left: 2.5px solid #e11d48;
    padding: 2mm 3mm;
    border-radius: 0 4px 4px 0;
    margin: 1.5mm 0;
  }
  .quote-phrase {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 9.5pt;
    font-weight: 600;
    color: #881337;
    line-height: 1.25;
  }
  .quote-author {
    font-family: 'Dancing Script', cursive;
    font-size: 9.5pt;
    color: #9f1239;
    text-align: right;
    margin-top: 0.5mm;
  }

  .letter-snip {
    font-size: 6.4pt;
    color: #44403c;
    line-height: 1.45;
    margin-bottom: 2mm;
  }

  .footer-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: auto;
  }

  .postmark-round {
    width: 21mm;
    height: 21mm;
    border: 1.2px dashed #be123c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-6deg);
    background: transparent;
    padding: 0.5mm;
  }
  .postmark-inner {
    width: 18mm;
    height: 18mm;
    border: 0.6px solid rgba(190, 18, 60, 0.6);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .pm-date {
    font-size: 5pt;
    font-weight: 700;
    color: #881337;
    letter-spacing: 0.6px;
  }
  .pm-city {
    font-size: 4.2pt;
    color: #be123c;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .pm-heart {
    font-size: 4.8pt;
    font-weight: 700;
    color: #9f1239;
    margin-top: 0.3mm;
  }

  .signature-box {
    text-align: right;
    margin-left: 2mm;
  }
  .closing {
    font-size: 6pt;
    color: #78716c;
    font-style: italic;
  }
  .sign-name {
    font-family: 'Dancing Script', cursive;
    font-size: 14pt;
    font-weight: 700;
    color: #9f1239;
    line-height: 1;
    margin-top: 0.5mm;
  }

  .col-qr {
    width: 45%;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-left: 3mm;
  }

  .stamp-vintage {
    align-self: flex-end;
    width: 17mm;
    height: 19mm;
    border: 1.2px dashed #c59b27;
    background: #fff5f7;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 0.8mm 0.5mm;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    margin-bottom: 0.5mm;
  }
  .stamp-txt-top {
    font-size: 3.6pt;
    font-weight: 700;
    letter-spacing: 0.6px;
    color: #9f1239;
    text-transform: uppercase;
  }
  .stamp-icon {
    font-size: 8.5pt;
    line-height: 1;
  }
  .stamp-txt-bot {
    font-size: 4pt;
    font-weight: 600;
    color: #c59b27;
  }

  .qr-container {
    background: #ffffff;
    border: 1.2px solid rgba(197, 155, 39, 0.55);
    border-radius: 8px;
    padding: 2.2mm;
    box-shadow: 0 4px 14px rgba(136, 19, 55, 0.08), 0 1px 4px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5mm 0 1mm 0;
  }
  .qr-code-img {
    width: 34mm;
    height: 34mm;
    display: block;
  }

  .qr-instructions {
    text-align: center;
    width: 100%;
  }
  .prompt-title {
    font-size: 6.6pt;
    font-weight: 600;
    color: #881337;
    line-height: 1.2;
  }
  .domain-badge {
    display: inline-block;
    background: linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%);
    color: #9f1239;
    font-weight: 700;
    font-size: 7.5pt;
    letter-spacing: 0.6px;
    padding: 0.7mm 3.2mm;
    border-radius: 999px;
    margin: 0.8mm 0 0.6mm 0;
    border: 0.5px solid rgba(225, 29, 72, 0.35);
    box-shadow: 0 1px 3px rgba(225, 29, 72, 0.1);
  }
  .prompt-desc {
    font-size: 5.4pt;
    color: #78716c;
    font-style: italic;
    line-height: 1.25;
  }
"""

# Reusable HTML snippets for Front and Back
front_html_snippet = f"""
  <div class="card-box card-front">
    <img src="file://{cover_img_path}" alt="Capa - Paulo & Maria Clara">
  </div>
"""

back_html_snippet = f"""
  <div class="card-box card-back">
    <div class="border-outer"></div>
    <div class="border-inner"></div>

    <svg class="corner-ornament c-tl" viewBox="0 0 50 50" fill="none">
      <path d="M4,4 L28,4 C22,7 18,12 16,18 C14,24 14,28 14,35" stroke="#c59b27" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M4,4 L4,28 C7,22 12,18 18,16 C24,14 28,14 35,14" stroke="#c59b27" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="8" cy="8" r="2.2" fill="#be123c"/>
      <circle cx="18" cy="8" r="1.4" fill="#c59b27"/>
      <circle cx="8" cy="18" r="1.4" fill="#c59b27"/>
      <path d="M4,4 Q12,12 4,20" stroke="#c59b27" stroke-width="0.8" fill="none"/>
      <path d="M4,4 Q12,12 20,4" stroke="#c59b27" stroke-width="0.8" fill="none"/>
    </svg>
    <svg class="corner-ornament c-tr" viewBox="0 0 50 50" fill="none">
      <path d="M4,4 L28,4 C22,7 18,12 16,18 C14,24 14,28 14,35" stroke="#c59b27" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M4,4 L4,28 C7,22 12,18 18,16 C24,14 28,14 35,14" stroke="#c59b27" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="8" cy="8" r="2.2" fill="#be123c"/>
      <circle cx="18" cy="8" r="1.4" fill="#c59b27"/>
      <circle cx="8" cy="18" r="1.4" fill="#c59b27"/>
      <path d="M4,4 Q12,12 4,20" stroke="#c59b27" stroke-width="0.8" fill="none"/>
      <path d="M4,4 Q12,12 20,4" stroke="#c59b27" stroke-width="0.8" fill="none"/>
    </svg>
    <svg class="corner-ornament c-bl" viewBox="0 0 50 50" fill="none">
      <path d="M4,4 L28,4 C22,7 18,12 16,18 C14,24 14,28 14,35" stroke="#c59b27" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M4,4 L4,28 C7,22 12,18 18,16 C24,14 28,14 35,14" stroke="#c59b27" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="8" cy="8" r="2.2" fill="#be123c"/>
      <circle cx="18" cy="8" r="1.4" fill="#c59b27"/>
      <circle cx="8" cy="18" r="1.4" fill="#c59b27"/>
      <path d="M4,4 Q12,12 4,20" stroke="#c59b27" stroke-width="0.8" fill="none"/>
      <path d="M4,4 Q12,12 20,4" stroke="#c59b27" stroke-width="0.8" fill="none"/>
    </svg>
    <svg class="corner-ornament c-br" viewBox="0 0 50 50" fill="none">
      <path d="M4,4 L28,4 C22,7 18,12 16,18 C14,24 14,28 14,35" stroke="#c59b27" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M4,4 L4,28 C7,22 12,18 18,16 C24,14 28,14 35,14" stroke="#c59b27" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="8" cy="8" r="2.2" fill="#be123c"/>
      <circle cx="18" cy="8" r="1.4" fill="#c59b27"/>
      <circle cx="8" cy="18" r="1.4" fill="#c59b27"/>
      <path d="M4,4 Q12,12 4,20" stroke="#c59b27" stroke-width="0.8" fill="none"/>
      <path d="M4,4 Q12,12 20,4" stroke="#c59b27" stroke-width="0.8" fill="none"/>
    </svg>

    <div class="postcard-line"></div>
    <div class="postcard-heart-badge">❦</div>

    <div class="layout-grid">
      <div class="col-letter">
        <div class="header-box">
          <div class="eyebrow">Nossa História de Amor</div>
          <div class="main-title">Paulo & Maria Clara</div>
          <div class="date-badge">13 DE JULHO DE 2026 • PARA SEMPRE</div>
        </div>

        <div class="quote-card">
          <div class="quote-phrase">“Você me ama muito ou pouco?”</div>
          <div class="quote-author">— Paulo Sérgio</div>
        </div>

        <div class="letter-snip">
          Minha querida Maria Clara, desde aquela primeira mensagem meu mundo ficou infinitamente mais leve e feliz. Cada dia ao seu lado é uma página inesquecível da nossa vida. Este cartão guarda o início de todos os nossos capítulos.
        </div>

        <div class="footer-row">
          <div class="postmark-round">
            <div class="postmark-inner">
              <span class="pm-date">13.JUL.2026</span>
              <span class="pm-city">RIO DE JANEIRO</span>
              <span class="pm-heart">AMOR ETERNO ❤️</span>
            </div>
          </div>

          <div class="signature-box">
            <div class="closing">Com todo meu amor,</div>
            <div class="sign-name">Paulinho ❤️</div>
          </div>
        </div>
      </div>

      <div class="col-qr">
        <div class="stamp-vintage">
          <span class="stamp-txt-top">Correio do Amor</span>
          <span class="stamp-icon">💌</span>
          <span class="stamp-txt-bot">13.07 • BRASIL</span>
        </div>

        <div class="qr-container">
          <img src="file://{qr_path}" alt="QR Code - pauloeclara.online" class="qr-code-img">
        </div>

        <div class="qr-instructions">
          <p class="prompt-title">Aponte a câmera do seu celular:</p>
          <div class="domain-badge">pauloeclara.online</div>
          <p class="prompt-desc">Para ver fotos, ouvir nossa música e ler nossa carta completa ✨</p>
        </div>
      </div>
    </div>
  </div>
"""

# ============================================================
# DOCUMENT 1: A6 Landscape (148 x 105 mm)
# ============================================================
html_a6 = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Cartão A6 - Paulo & Maria Clara</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page {{
    size: 148mm 105mm;
    margin: 0;
  }}
  {card_css}
  .page-wrapper {{
    page-break-after: always;
    break-after: page;
  }}
</style>
</head>
<body>
  <div class="page-wrapper">{front_html_snippet}</div>
  <div class="page-wrapper">{back_html_snippet}</div>
</body>
</html>
"""

html_a6_path = os.path.join(PROJECT_DIR, "cartao_a6_template.html")
with open(html_a6_path, "w", encoding="utf-8") as f:
    f.write(html_a6)

pdf_a6_path = os.path.join(PROJECT_DIR, "cartao_paulo_e_clara_A6.pdf")
subprocess.run([
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_a6_path}",
    f"file://{html_a6_path}"
], check=True)
print("A6 PDF generated:", pdf_a6_path)

# ============================================================
# DOCUMENT 2: A4 Printable Sheet (210 x 297 mm) with Crop Guides
# ============================================================
html_a4 = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Cartão A4 para Impressão - Paulo & Maria Clara</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page {{
    size: 210mm 297mm;
    margin: 0;
  }}
  {card_css}
  .a4-sheet {{
    width: 210mm;
    height: 297mm;
    position: relative;
    page-break-after: always;
    break-after: page;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }}

  /* Moldura de corte e marcas */
  .crop-container {{
    position: relative;
    padding: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }}

  /* Linha de corte pontilhada para tesoura */
  .cut-guide-border {{
    position: absolute;
    top: -0.5mm;
    left: -0.5mm;
    right: -0.5mm;
    bottom: -0.5mm;
    border: 0.8px dashed #a8a29e;
    pointer-events: none;
    z-index: 50;
  }}

  /* Tesourinha de corte */
  .scissors-tag {{
    position: absolute;
    top: -5mm;
    left: 20mm;
    font-size: 9pt;
    color: #78716c;
  }}

  /* Marcas de corte nos 4 cantos */
  .crop-mark {{
    position: absolute;
    width: 8mm;
    height: 8mm;
    pointer-events: none;
    z-index: 60;
  }}
  .cm-tl {{ top: -4mm; left: -4mm; border-right: 0.6px solid #44403c; border-bottom: 0.6px solid #44403c; }}
  .cm-tr {{ top: -4mm; right: -4mm; border-left: 0.6px solid #44403c; border-bottom: 0.6px solid #44403c; }}
  .cm-bl {{ bottom: -4mm; left: -4mm; border-right: 0.6px solid #44403c; border-top: 0.6px solid #44403c; }}
  .cm-br {{ bottom: -4mm; right: -4mm; border-left: 0.6px solid #44403c; border-top: 0.6px solid #44403c; }}

  /* Instruções de Impressão na Folha A4 */
  .print-instructions-top {{
    position: absolute;
    top: 25mm;
    left: 20mm;
    right: 20mm;
    text-align: center;
  }}
  .inst-title {{
    font-family: 'Playfair Display', serif;
    font-size: 14pt;
    font-weight: 700;
    color: #4c0519;
  }}
  .inst-sub {{
    font-size: 7.5pt;
    color: #78716c;
    margin-top: 1mm;
  }}

  .print-instructions-bottom {{
    position: absolute;
    bottom: 25mm;
    left: 20mm;
    right: 20mm;
    text-align: center;
    background: #fdfbf7;
    border: 1px solid #e7e5e4;
    border-radius: 8px;
    padding: 3mm 6mm;
  }}
  .inst-step {{
    font-size: 7.5pt;
    color: #44403c;
    line-height: 1.5;
  }}
  .inst-step strong {{
    color: #9f1239;
  }}
</style>
</head>
<body>
  <!-- FOLHA A4 - PÁGINA 1: FRENTE -->
  <div class="a4-sheet">
    <div class="print-instructions-top">
      <div class="inst-title">💖 Cartão de Amor • Paulo Sérgio & Maria Clara</div>
      <div class="inst-sub">Página 1: Frente (Arte Floral & Retrato) • Formato A6 (148 x 105 mm)</div>
    </div>

    <div class="crop-container">
      <div class="cut-guide-border"></div>
      <div class="scissors-tag">✂️ cortar na linha pontilhada</div>
      <div class="crop-mark cm-tl"></div>
      <div class="crop-mark cm-tr"></div>
      <div class="crop-mark cm-bl"></div>
      <div class="crop-mark cm-br"></div>
      {front_html_snippet}
    </div>

    <div class="print-instructions-bottom">
      <p class="inst-step">
        🖨️ <strong>Dica de Impressão:</strong> Configure para <strong>Tamanho Real (100% / sem ajuste à página)</strong> em papel A4 (couché, offset ou fotográfico 180g a 240g).
        Selecione <strong>Frente e Verso automático</strong> (virar na borda maior).
      </p>
    </div>
  </div>

  <!-- FOLHA A4 - PÁGINA 2: VERSO -->
  <div class="a4-sheet">
    <div class="print-instructions-top">
      <div class="inst-title">💖 Cartão de Amor • Paulo Sérgio & Maria Clara</div>
      <div class="inst-sub">Página 2: Verso (Design Postal com QR Code para o Site) • Formato A6 (148 x 105 mm)</div>
    </div>

    <div class="crop-container">
      <div class="cut-guide-border"></div>
      <div class="scissors-tag">✂️ cortar na linha pontilhada</div>
      <div class="crop-mark cm-tl"></div>
      <div class="crop-mark cm-tr"></div>
      <div class="crop-mark cm-bl"></div>
      <div class="crop-mark cm-br"></div>
      {back_html_snippet}
    </div>

    <div class="print-instructions-bottom">
      <p class="inst-step">
        ✂️ <strong>Após a impressão:</strong> Utilize uma régua e estilete ou tesoura para recortar pelas marcas pontilhadas. O verso e a frente estarão perfeitamente alinhados!
      </p>
    </div>
  </div>
</body>
</html>
"""

html_a4_path = os.path.join(PROJECT_DIR, "cartao_a4_template.html")
with open(html_a4_path, "w", encoding="utf-8") as f:
    f.write(html_a4)

pdf_a4_path = os.path.join(PROJECT_DIR, "cartao_paulo_e_clara_A4_para_imprimir.pdf")
subprocess.run([
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_a4_path}",
    f"file://{html_a4_path}"
], check=True)
print("A4 PDF generated:", pdf_a4_path)

# ============================================================
# Generate High-Resolution PNG Previews for Direct Use
# ============================================================
img_front_png = os.path.join(PROJECT_DIR, "cartao_frente.png")
img_verso_png = os.path.join(PROJECT_DIR, "cartao_verso.png")

# Use chrome screenshot on single page elements
subprocess.run([
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    f"--screenshot={img_front_png}",
    "--window-size=1748,1240",
    f"file://{html_a6_path}"
])
# Split and render verso
r = pypdf.PdfReader(pdf_a6_path)
w1 = pypdf.PdfWriter()
w1.add_page(r.pages[0])
w1.write('/tmp/p1_final.pdf')
w2 = pypdf.PdfWriter()
w2.add_page(r.pages[1])
w2.write('/tmp/p2_final.pdf')

subprocess.run(["sips", "-s", "format", "png", "/tmp/p1_final.pdf", "--out", img_front_png])
subprocess.run(["sips", "-s", "format", "png", "/tmp/p2_final.pdf", "--out", img_verso_png])

print("Generated high-res preview images:", img_front_png, img_verso_png)
