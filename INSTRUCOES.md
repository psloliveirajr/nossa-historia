# 💖 Como Personalizar o Site da Maria Clara

Parabéns pelo projeto! Toda a estrutura já está funcionando e pronta para ser personalizada.
Tudo foi organizado para que você **não precise mexer em código difícil**.

---

## 1. Como Trocar os Textos, Datas e Perguntas
Abra o arquivo:
📁 `js/story-data.js`

Nele você pode alterar facilmente:
* **Os nomes**: trocar "Paulo" e "Maria Clara" se desejar.
* **A data do início**: a data em que começaram a namorar (o contador calcula os dias, horas e segundos automaticamente!).
* **Os textos dos capítulos**: sua história real, como se conheceram e piadas internas.
* **A Carta de Amor**: sua declaração final para ela.

---

## 2. Como Colocar as Fotos Reais de Vocês
1. Salve as fotos na pasta:
   📁 `assets/images/` (ex: `capa.jpg`, `foto1.jpg`, `foto2.jpg`, etc.)
2. No arquivo:
   📁 `js/story-data.js`
   
   - **Para a Foto da Capa:**
     Procure a seção `cover:` e substitua pelo caminho da sua foto:
     ```javascript
     cover: {
       ...
       image: "assets/images/capa.jpg",
       imageCaption: "Paulo & Maria Clara ❤️",
     }
     ```
   - **Para as Fotos do Diário (Polaroids & Prólogo):**
     Substitua os links pelo caminho das fotos que salvou:
     ```javascript
     url: "assets/images/foto1.jpg"
     ```

---

## 3. Como Colocar a Música do Casal
1. Quando escolherem a música, baixe o arquivo em formato `.mp3`.
2. Renomeie o arquivo para:
   `musica.mp3`
3. Cole na pasta:
   📁 `assets/music/musica.mp3`
4. Pronto! O toca-discos do site passará a tocar essa música automaticamente quando ela clicar no botão.

---

## 4. Como Visualizar no Navegador
* Você pode simplesmente dar um **duplo clique no arquivo `index.html`** para abrir em qualquer navegador (Chrome, Safari, Edge, Firefox), ou usar um servidor local.
* Pelo celular, você pode enviar o link assim que publicarmos (via Vercel ou Netlify, que é 100% gratuito!).
