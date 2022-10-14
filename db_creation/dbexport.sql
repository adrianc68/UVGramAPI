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
-- Name: TipoPrivacidad; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."TipoPrivacidad" AS ENUM (
    'PUBLICO',
    'PRIVADO'
);


ALTER TYPE public."TipoPrivacidad" OWNER TO dev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ConfiguracionUsuario; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."ConfiguracionUsuario" (
    "tipoPrivacidad" public."TipoPrivacidad" NOT NULL,
    id bigint
);


ALTER TABLE public."ConfiguracionUsuario" OWNER TO dev;

--
-- Name: Cuenta; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Cuenta" (
    "contraseña" character varying(120) NOT NULL,
    correo character varying(340) NOT NULL,
    id bigint
);


ALTER TABLE public."Cuenta" OWNER TO dev;

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

COPY public."ConfiguracionUsuario" ("tipoPrivacidad", id) FROM stdin;
\.


--
-- Data for Name: Cuenta; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Cuenta" ("contraseña", correo, id) FROM stdin;
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Usuario" (nombre, presentacion, usuario, id) FROM stdin;
\.


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, false);


--
-- Name: Cuenta PK_Cuenta; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Cuenta"
    ADD CONSTRAINT "PK_Cuenta" PRIMARY KEY (correo);


--
-- Name: Usuario PK_Usuario; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "PK_Usuario" PRIMARY KEY (id);


--
-- Name: IXFK_ConfiguracionUsuario_Usuario; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_ConfiguracionUsuario_Usuario" ON public."ConfiguracionUsuario" USING btree (id);


--
-- Name: IXFK_Cuenta_Usuario; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Cuenta_Usuario" ON public."Cuenta" USING btree (id);


--
-- Name: ConfiguracionUsuario FK_ConfiguracionUsuario_Usuario; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ConfiguracionUsuario"
    ADD CONSTRAINT "FK_ConfiguracionUsuario_Usuario" FOREIGN KEY (id) REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cuenta FK_Cuenta_Usuario; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Cuenta"
    ADD CONSTRAINT "FK_Cuenta_Usuario" FOREIGN KEY (id) REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

