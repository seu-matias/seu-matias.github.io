# Site da Barbearia Seu Matias

Site estático (HTML + CSS + JS), sem build. Hospedagem: GitHub Pages.

## Rodar localmente
```bash
python -m http.server 5173
```
Abra http://localhost:5173

## Estrutura
- `index.html`, `style.css`, `script.js`
- `assets/`: logo (SVG redesenhado), favicon, imagem de compartilhamento
- `public/images/`: fotos otimizadas (webp) e logo oficial, tiradas do Instagram e da agenda online do cliente
- `BRIEFING.md`: o que foi levantado sobre o cliente e de onde veio cada dado

## O que o site faz
- **Aberto agora:** o status e o dia de hoje na tabela de horários são calculados no horário de Brasília.
- **Monte o seu atendimento:** marca os serviços, soma preço e tempo e monta a mensagem do WhatsApp.
- **Comparador antes e depois** (arrastar), **galeria com filtro e ampliação** (teclado: setas e Esc).
- **Mapa** só carrega quando a pessoa clica (privacidade e velocidade).
- Animações respeitam `prefers-reduced-motion`.

## Onde editar os dados
- Preços e tempos: atributos `data-preco` e `data-min` em cada `.svc` do `index.html` (e o texto visível ao lado). Lembre de ajustar também a resposta "Quanto custa?" e o JSON-LD.
- Horários: tabela `.horas` no `index.html` **e** o objeto `HORAS` no `script.js`.
- Número do WhatsApp: procure `5547999788806` em `index.html` e `script.js`.

## Pendências (dependem do cliente)
1. **Fotos em alta resolução.** A maioria vem do Instagram com 360 a 480 px de largura e fica levemente suave em telas grandes. Pedir os originais.
2. **Autorização dos clientes fotografados** para o antes e depois de prótese capilar, que está em destaque no site.
3. **Peterson:** foto e função. Hoje o cartão dele usa o bigode no lugar da foto. Confirmar também a função do Frank e do João Vitor.
4. **Confirmar os preços.** Vêm da agenda online e podem mudar. Faltam os valores de sobrancelha, depilação de orelhas e bigode.
5. **Domingo:** confirmar se fecha. Hoje o site diz "Consulte pelo WhatsApp".
6. **Textos da prótese capilar** (avaliação gratuita, os 4 passos, natural/leve/resistente/discreto): foram tirados das artes do próprio cliente. Confirmar que ainda valem.
7. **Avaliações do Google:** exibidas com o texto original e nome abreviado. Confirmar se o cliente aprova.
8. **Números do site** (4,9, 50 avaliações, 2,4 mil seguidores) são de 07/11/2026. Atualizar de tempos em tempos.
9. **Logo vetorial original** (a do Instagram tem 150 px; o site usa um redesenho em SVG e a versão horizontal de 719 px).
10. **Vaga de barbeiro, cursos/workshops e produtos** aparecem no Instagram e na agenda online. Dizer se entram no site.
11. **Domínio próprio** (ex.: seumatias.com.br, Registro.br, cerca de R$ 40 por ano). Os endereços de compartilhamento (`canonical`, `og:url`) precisam ser ajustados ao link final.

## Atualizar
Mexa nos arquivos, faça commit e push. O site atualiza no mesmo link em cerca de um minuto.
