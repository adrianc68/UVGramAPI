--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE uvgram_db;




--
-- Drop roles
--

DROP ROLE dev;


--
-- Roles
--

CREATE ROLE dev;
ALTER ROLE dev WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:GSEDN9/L6zOyG2ruK44MBA==$zfTG3rS0jnY0T6OQm7wmtx2nkrRp83vqXr6gFXwt/vc=:iHQLlWtubZh62BDljm0xldTOnO5XRezOXFI5PtNxrCQ=';






--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: dev
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO dev;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: dev
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: dev
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: dev
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: dev
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO dev;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: dev
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- Database "uvgram_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uvgram_db; Type: DATABASE; Schema: -; Owner: dev
--

CREATE DATABASE uvgram_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE uvgram_db OWNER TO dev;

\connect uvgram_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: TipoEstadoCuenta; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."TipoEstadoCuenta" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."TipoEstadoCuenta" OWNER TO dev;

--
-- Name: TipoPrivacidad; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."TipoPrivacidad" AS ENUM (
    'PUBLICO',
    'PRIVADO'
);


ALTER TYPE public."TipoPrivacidad" OWNER TO dev;

--
-- Name: enum_ConfiguracionUsuario_tipo_privacidad; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_ConfiguracionUsuario_tipo_privacidad" AS ENUM (
    'PUBLICO',
    'PRIVADO'
);


ALTER TYPE public."enum_ConfiguracionUsuario_tipo_privacidad" OWNER TO dev;

--
-- Name: enum_VerificacionCuenta_estado_cuenta; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_VerificacionCuenta_estado_cuenta" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."enum_VerificacionCuenta_estado_cuenta" OWNER TO dev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ConfiguracionUsuario; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."ConfiguracionUsuario" (
    tipo_privacidad public."TipoPrivacidad",
    id_usuario bigint
);


ALTER TABLE public."ConfiguracionUsuario" OWNER TO dev;

--
-- Name: Cuenta; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Cuenta" (
    "contraseña" character varying(120) NOT NULL,
    correo character varying(340) NOT NULL,
    id_usuario bigint NOT NULL,
    telefono character varying(15)
);


ALTER TABLE public."Cuenta" OWNER TO dev;

--
-- Name: RolUsuario; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."RolUsuario" (
    fecha_nacimiento date NOT NULL,
    id_usuario bigint NOT NULL,
    nombre_completo character varying(340)
);


ALTER TABLE public."RolUsuario" OWNER TO dev;

--
-- Name: Usuario; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Usuario" (
    nombre character varying(120) NOT NULL,
    presentacion character varying(1200),
    usuario character varying(120) NOT NULL,
    id bigint DEFAULT nextval(('"usuario_id_seq"'::text)::regclass) NOT NULL
);


ALTER TABLE public."Usuario" OWNER TO dev;

--
-- Name: VerificacionCuenta; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."VerificacionCuenta" (
    codigo_verificacion character varying(8),
    intentos_realizados integer NOT NULL,
    estado_cuenta public."TipoEstadoCuenta" NOT NULL,
    correo_cuenta character varying(340) NOT NULL,
    id_usuario bigint
);


ALTER TABLE public."VerificacionCuenta" OWNER TO dev;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuario_id_seq OWNER TO dev;

--
-- Data for Name: ConfiguracionUsuario; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."ConfiguracionUsuario" (tipo_privacidad, id_usuario) FROM stdin;
\.


--
-- Data for Name: Cuenta; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Cuenta" ("contraseña", correo, id_usuario, telefono) FROM stdin;
\.


--
-- Data for Name: RolUsuario; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."RolUsuario" (fecha_nacimiento, id_usuario, nombre_completo) FROM stdin;
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Usuario" (nombre, presentacion, usuario, id) FROM stdin;
\.


--
-- Data for Name: VerificacionCuenta; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."VerificacionCuenta" (codigo_verificacion, intentos_realizados, estado_cuenta, correo_cuenta, id_usuario) FROM stdin;
\.


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, false);


--
-- Name: Cuenta PK_Cuenta; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Cuenta"
    ADD CONSTRAINT "PK_Cuenta" PRIMARY KEY (id_usuario);


--
-- Name: Usuario PK_Usuario; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "PK_Usuario" PRIMARY KEY (id);


--
-- Name: IXFK_ConfiguracionUsuario_Usuario; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_ConfiguracionUsuario_Usuario" ON public."ConfiguracionUsuario" USING btree (id_usuario);


--
-- Name: IXFK_Cuenta_Usuario; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Cuenta_Usuario" ON public."Cuenta" USING btree (id_usuario);


--
-- Name: IXFK_RolUsuario_Usuario; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_RolUsuario_Usuario" ON public."RolUsuario" USING btree (id_usuario);


--
-- Name: IXFK_VerificacionCuenta_Cuenta; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_VerificacionCuenta_Cuenta" ON public."VerificacionCuenta" USING btree (id_usuario);


--
-- Name: ConfiguracionUsuario FK_ConfiguracionUsuario_Usuario; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ConfiguracionUsuario"
    ADD CONSTRAINT "FK_ConfiguracionUsuario_Usuario" FOREIGN KEY (id_usuario) REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cuenta FK_Cuenta_Usuario; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Cuenta"
    ADD CONSTRAINT "FK_Cuenta_Usuario" FOREIGN KEY (id_usuario) REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolUsuario FK_RolUsuario_Usuario; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."RolUsuario"
    ADD CONSTRAINT "FK_RolUsuario_Usuario" FOREIGN KEY (id_usuario) REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VerificacionCuenta FK_VerificacionCuenta_Cuenta; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."VerificacionCuenta"
    ADD CONSTRAINT "FK_VerificacionCuenta_Cuenta" FOREIGN KEY (id_usuario) REFERENCES public."Cuenta"(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

