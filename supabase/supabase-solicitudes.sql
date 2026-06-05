-- Tabla de solicitudes para sumarse a la base de talentos
create table if not exists solicitudes (
  id            uuid default gen_random_uuid() primary key,
  nombre        text not null,
  edad          integer,
  categoria     text not null check (categoria in ('modelos','fotografos','maquilladores')),
  -- modelos
  altura        text,
  hombros       text,
  busto         text,
  cintura       text,
  cadera        text,
  talle_ropa    text,
  talle_pantalon text,
  talle_calzado text,
  pelo          text,
  ojos          text,
  ubicacion     text,
  -- fotografos / maquilladores
  estilo        text,
  -- contacto del postulante (para que MUDA pueda responderle)
  contacto      text,
  -- imagenes
  portada_1     text,
  portada_2     text,
  galeria       text[],
  created_at    timestamp with time zone default timezone('utc', now()) not null
);

alter table solicitudes enable row level security;

-- Cualquiera (visitante anónimo) puede ENVIAR una solicitud
create policy "Enviar solicitud pública"
  on solicitudes for insert
  with check (true);

-- Solo el admin autenticado puede ver / borrar las solicitudes
create policy "Admin lee solicitudes"
  on solicitudes for select
  using (auth.role() = 'authenticated');

create policy "Admin borra solicitudes"
  on solicitudes for delete
  using (auth.role() = 'authenticated');
