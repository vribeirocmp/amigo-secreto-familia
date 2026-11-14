# Amigo secreto em família

App estático em português, sem login e sem servidor. Cadastre participantes e indique quem recebe o link de cada um. Um responsável pode receber os resultados de várias crianças sem participar pessoalmente. Deixe o responsável vazio para participantes que recebem seu próprio link.

Faça o sorteio e copie/envie cada link individual pelo WhatsApp. Cada participante dá e recebe exatamente uma vez; ninguém tira a si mesmo. Pessoas da mesma família podem se tirar.

## Dados e acesso

Os dados do organizador ficam somente no localStorage daquele navegador. Use a cópia de segurança para restaurar em outro dispositivo. Não envie a cópia aos participantes: ela contém todos os links. Nenhum participante real ou resultado é gravado neste repositório.

Cada link carrega exclusivamente os resultados do responsável, usando AES-GCM e chave aleatória no fragmento da URL. O fragmento não é enviado ao GitHub pelo navegador. Quem possui o link pode ler seus resultados, inclusive o organizador. A criptografia não serve como autenticação: a chave está no próprio link. Não há expiração ou revogação; apagar ou refazer uma brincadeira não invalida links antigos. Compartilhe somente com o destinatário. Não há analytics nem dependências externas de execução.

## Desenvolvimento

Node 22+: `npm test`. Para visualizar: `npm start`, abrir http://localhost:4178. Publicação gratuita pelo GitHub Pages com branch main e pasta raiz. Não há build nem backend.
