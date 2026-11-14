# Amigo secreto em família

App estático em português, sem login e sem servidor. Cadastre participantes e indique quem recebe o link de cada um. Um responsável pode receber os resultados de várias crianças sem participar pessoalmente. Deixe o responsável vazio para participantes que recebem seu próprio link.

Faça o sorteio e copie/envie cada link individual pelo WhatsApp. Cada participante dá e recebe exatamente uma vez; ninguém tira a si mesmo. Pessoas da mesma família podem se tirar.

## Ajustes, valor e desejos

Depois do sorteio, use **Ajustar participantes e sortear novamente** para editar nomes/responsáveis, adicionar ou remover pessoas e fazer um novo sorteio. É necessário enviar os novos links para todos; os antigos permanecem com o resultado anterior. O valor por presente é opcional, em USD, com duas casas decimais, e aparece no link de cada família.

Nos novos links, cada participante tem uma caixa de desejos (até 500 caracteres). A família preenche e usa **Copiar atualização para o organizador**, enviando o link por mensagem. No mesmo navegador da organização, cole o link em **Recebeu uma lista de desejos?** e incorpore. Também pode abrir o link de atualização no navegador do organizador para preencher esse campo. O app atualiza os links sem refazer o sorteio; reenvie os links para que cada família veja os desejos de quem tirou. Os desejos não sincronizam automaticamente. Atualizações de outra brincadeira ou família são recusadas. Links da versão inicial continuam abrindo; para usar os novos campos, gere e envie novos links.

## Dados e acesso

Os dados do organizador ficam somente no localStorage daquele navegador. Use a cópia de segurança para restaurar em outro dispositivo. Não envie a cópia aos participantes: ela contém todos os links. Nenhum participante real ou resultado é gravado neste repositório.

Cada link carrega exclusivamente os resultados do responsável, usando AES-GCM e chave aleatória no fragmento da URL. O fragmento não é enviado ao GitHub pelo navegador. Quem possui o link pode ler seus resultados, inclusive o organizador. A criptografia não serve como autenticação: a chave está no próprio link. Não há expiração ou revogação; apagar ou refazer uma brincadeira não invalida links antigos. Compartilhe somente com o destinatário. Não há analytics nem dependências externas de execução.

## Desenvolvimento

Node 22+: `npm test`. Para visualizar: `npm start`, abrir http://localhost:4178. Publicação gratuita pelo GitHub Pages com branch main e pasta raiz. Não há build nem backend.
