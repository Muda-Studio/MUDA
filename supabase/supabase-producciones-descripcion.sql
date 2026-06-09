-- Agrega la columna de descripción a las producciones/eventos.
-- Ejecutar UNA vez en Supabase → SQL Editor → New query → pegar y Run.
alter table public.producciones
  add column if not exists descripcion text not null default '';
