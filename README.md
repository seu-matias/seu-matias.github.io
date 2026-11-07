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
- `public/images/`: fotos otimizadas (webp), tiradas do Instagram do cliente
- `BRIEFING.md`: o que foi levantado sobre o cliente

## Pendências (dependem do cliente)
1. **Arquivo original da logo** (a do Instagram tem 150 px; o site usa um redesenho em SVG).
2. **Fotos em alta resolução.** As do feed têm 640 px e aparecem levemente suaves em telas grandes.
3. **Autorização do cliente fotografado** para usar o antes e depois de prótese capilar.
4. **Confirmar o WhatsApp.** O site usa (47) 99978-8806. A bio do Instagram mostra (47) 9978-8806 e a vaga mostra (47) 98813-7403.
5. **Horário de funcionamento** (não aparece no site por não ter sido informado).
6. **Preços e tabela de serviços**, se o cliente quiser mostrar.
7. **Quem é o barbeiro das fotos** (para colocar nome e legenda).
8. **Vaga de barbeiro, cursos/workshops e produtos:** aparecem nos destaques do Instagram. Dizer se entram no site.
9. **Link de agendamento por app** (aparece na bio, `appbarber.page.link/...`): confirmar se continua ativo e se entra como segundo botão.
10. **Domínio próprio** (ex.: seumatias.com.br, Registro.br, cerca de R$ 40 por ano).
11. **CEP e Google Meu Negócio**, para o SEO local e o schema do site.

## Atualizar
Mexa nos arquivos, faça commit e push. O site atualiza no mesmo link em cerca de um minuto.
