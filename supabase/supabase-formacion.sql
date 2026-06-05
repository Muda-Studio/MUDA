-- Formación del modelo (opcional)
alter table talentos    add column if not exists formacion text;
alter table solicitudes add column if not exists formacion text;
