create table usuarios (
	id serial primary key,
  nome text,
  email text unique,
  senha text
);

create table categorias (
	id serial primary key,
  descricao text
);

insert into categorias (descricao) values
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos (
	id serial primary key,
  descricao text,
  quantidade_estoque int,
  valor int,
  categoria_id int references categorias(id)
);

create table clientes (
	id serial primary key,
  nome text,
  email text unique,
  cpf char(11) unique,
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  estado text
);

create table pedidos (
	id serial primary key,
  cliente_id int references clientes(id),
  observacao text,
  valor_total int
);

create table pedido_produtos (
  id serial primary key,
  pedido_id int references pedidos(id),
  produto_id int references produtos(id),
  quantidade_produto int,
  valor_produto int
);

alter table produtos add column produto_imagem text;