-- Funcionalidades e Regras

- [x] Deve ser possível criar um link (teste?)
  - [x] Não deve ser possível criar um link com URL encurtada mal formatada (teste?)
  - [x] Não deve ser possível criar um link com URL encurtada já existente (teste?)
- [ ] Deve ser possível deletar um link (teste?)
- [ ] Deve ser possível obter a URL original por meio de uma URL encurtada (teste?)
- [x] Deve ser possível listar todas as URL’s cadastradas (teste?)
- [ ] Deve ser possível incrementar a quantidade de acessos de um link (teste?)
- [ ] Deve ser possível exportar os links criados em um CSV (teste?)
  - [ ] Deve ser possível acessar o CSV por meio de uma CDN (Amazon S3, Cloudflare R2, etc) (teste?)
  - [ ] Deve ser gerado um nome aleatório e único para o arquivo (teste?)
  - [ ] Deve ser possível realizar a listagem de forma performática (teste?)
  - [ ] O CSV deve ter campos como, URL original, URL encurtada, contagem de acessos e data de criação. (teste?)

-- Docker

Para esse projeto back-end você deve construir um Dockerfile, seguindo as boas práticas, que deve ser responsável por gerar a imagem da aplicação.

-- Dicas

FEITO - Não se esqueça de habilitar o CORS na aplicação.

-- Anotações trabalho
Objeto link e seus campos:

- Id
- URL encurtada
- URL original
- contagem de acessos
- data de criação
