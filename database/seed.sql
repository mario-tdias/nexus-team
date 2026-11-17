USE nexus_team;

-- Insere os integrantes somente quando ainda não houver registro com o mesmo nome.
INSERT INTO membros (nome, iniciais, cargo, descricao, imagem, github, linkedin, portfolio)
SELECT 'Laura Mathias', 'LM', 'UX/UI Designer',
       'Contribui para o desenvolvimento das funcionalidades e integração das soluções da equipe.',
       '/images/membros/laura-mathias.jpg', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM membros WHERE nome = 'Laura Mathias');

INSERT INTO membros (nome, iniciais, cargo, descricao, imagem, github, linkedin, portfolio)
SELECT 'Luiz Henrique Cubas', 'LC', 'Documentação e Design',
       'Responsável pela organização da documentação do projeto e pelo desenvolvimento dos elementos visuais, contribuindo para a clareza das informações e a identidade visual da equipe.',
       '/images/membros/luiz-cubas.jpg', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM membros WHERE nome = 'Luiz Henrique Cubas');

INSERT INTO membros (nome, iniciais, cargo, descricao, imagem, github, linkedin, portfolio)
SELECT 'Mario Takahashi', 'MT', 'Desenvolvedor Back-End',
       'Trabalha na lógica da aplicação, nas APIs e na integração dos dados.',
       '/images/membros/mario-takahashi.jpg', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM membros WHERE nome = 'Mario Takahashi');

INSERT INTO membros (nome, iniciais, cargo, descricao, imagem, github, linkedin, portfolio)
SELECT 'Millie Morelli', 'MM', 'Documentação e Desenvolvimento Front-End',
       'Responsável pela elaboração e organização da documentação do projeto, além do desenvolvimento das interfaces front-end, buscando garantir uma navegação intuitiva e uma boa experiência para os usuários.',
       '/images/membros/millie-morelli.jpg', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM membros WHERE nome = 'Millie Morelli');

INSERT INTO membros (nome, iniciais, cargo, descricao, imagem, github, linkedin, portfolio)
SELECT 'Victor Theodoro', 'VT', 'Desenvolvedor Full-Stack',
       'Responsável pelo desenvolvimento e integração das funcionalidades do sistema, atuando tanto na construção das interfaces quanto na implementação da lógica e dos recursos do backend.',
       '/images/membros/victor-theodoro.jpg', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM membros WHERE nome = 'Victor Theodoro');

-- Migra as duas publicações que estavam no array atual do BlogController.
INSERT INTO posts (id, titulo, autor, `data`, categoria, resumo, conteudo)
SELECT 1, 'Primeira atualização da Nexus', 'Mario Takahashi', '18/10/2026',
       'Atualização', 'Confira as novidades e o andamento do projeto Nexus.',
       'Aqui ficará o conteúdo completo da publicação.'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 1 OR titulo = 'Primeira atualização da Nexus');

INSERT INTO posts (id, titulo, autor, `data`, categoria, resumo, conteudo)
SELECT 2, 'Novidades no desenvolvimento', 'Laura Mathias', '18/10/2026',
       'Desenvolvimento', 'Compartilhando os avanços recentes da equipe.',
       'Aqui ficará o conteúdo completo desta publicação.'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 2 OR titulo = 'Novidades no desenvolvimento');
