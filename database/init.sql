create table if not exists users (
   id            serial primary key,
   nom           varchar(100) not null,
   prenom        varchar(100) not null,
   email         varchar(255) not null unique,
   date_creation timestamp not null default now()
);

-- Index sur l'email pour accélérer les recherches par email
create index if not exists idx_users_email on
   users (
      email
   );

insert into users (
   nom,
   prenom,
   email
) values ( 'Dupont',
           'Jean',
           'jean.dupont@example.com' ),( 'Martin',
                                         'Hugo',
                                         'hugo.martin@example.com' );