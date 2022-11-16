\connect test_uvgram_db

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
-- Name: AccountStatusType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."AccountStatusType" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."AccountStatusType" OWNER TO dev;

--
-- Name: CategoryType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."CategoryType" AS ENUM (
    'BLOG_PERSONAL',
    'PRODUCTO_O_SERVICIO',
    'ARTE',
    'MUSICO_O_BANDA',
    'COMPRAS_VENTAS_MINORISTAS',
    'SALUD_BELLEZA',
    'TIENDAS_COMESTIBLES'
);


ALTER TYPE public."CategoryType" OWNER TO dev;

--
-- Name: GenderType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."GenderType" AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'INDIFERENTE'
);


ALTER TYPE public."GenderType" OWNER TO dev;

--
-- Name: LoginStateType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."LoginStateType" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."LoginStateType" OWNER TO dev;

--
-- Name: PrivacyType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."PrivacyType" AS ENUM (
    'PUBLICO',
    'PRIVADO'
);


ALTER TYPE public."PrivacyType" OWNER TO dev;

--
-- Name: UserRoleType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."UserRoleType" AS ENUM (
    'PERSONAL',
    'EMPRESARIAL',
    'MODERADOR',
    'ADMINISTRADOR'
);


ALTER TYPE public."UserRoleType" OWNER TO dev;

--
-- Name: enum_AccountVerification_account_status; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_AccountVerification_account_status" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."enum_AccountVerification_account_status" OWNER TO dev;

--
-- Name: enum_Personal_gender; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Personal_gender" AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'INDIFERENTE'
);


ALTER TYPE public."enum_Personal_gender" OWNER TO dev;

--
-- Name: enum_Personal_sexo; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Personal_sexo" AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'INDIFERENTE'
);


ALTER TYPE public."enum_Personal_sexo" OWNER TO dev;

--
-- Name: enum_RolUsuario_rol_usuario; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_RolUsuario_rol_usuario" AS ENUM (
    'PERSONAL',
    'EMPRESARIAL',
    'MODERADOR',
    'ADMINISTRADOR'
);


ALTER TYPE public."enum_RolUsuario_rol_usuario" OWNER TO dev;

--
-- Name: enum_RolUsuario_role; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_RolUsuario_role" AS ENUM (
    'PERSONAL',
    'EMPRESARIAL',
    'MODERADOR',
    'ADMINISTRADOR'
);


ALTER TYPE public."enum_RolUsuario_role" OWNER TO dev;

--
-- Name: enum_UserConfiguration_privacy; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_UserConfiguration_privacy" AS ENUM (
    'PUBLICO',
    'PRIVADO',
    'PRIVATE'
);


ALTER TYPE public."enum_UserConfiguration_privacy" OWNER TO dev;

--
-- Name: enum_UserRole_role; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_UserRole_role" AS ENUM (
    'PERSONAL',
    'EMPRESARIAL',
    'MODERADOR',
    'MODERATOR',
    'ADMINISTRADOR'
);


ALTER TYPE public."enum_UserRole_role" OWNER TO dev;

--
-- Name: enum_VerificacionCuenta_account_status; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_VerificacionCuenta_account_status" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."enum_VerificacionCuenta_account_status" OWNER TO dev;

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
-- Name: Account; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Account" (
    password character varying(128) NOT NULL,
    email character varying(254) NOT NULL,
    id_user bigint NOT NULL,
    phone_number character varying(15),
    birthday date NOT NULL
);


ALTER TABLE public."Account" OWNER TO dev;

--
-- Name: AccountVerification; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."AccountVerification" (
    account_status public."AccountStatusType" NOT NULL,
    id_user bigint
);


ALTER TABLE public."AccountVerification" OWNER TO dev;

--
-- Name: Administrator; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Administrator" (
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_user bigint NOT NULL
);


ALTER TABLE public."Administrator" OWNER TO dev;

--
-- Name: Business; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Business" (
    category public."CategoryType",
    city character varying(340),
    postal_code character varying(16),
    postal_address character varying(420),
    contact_email character varying(340),
    phone_contact character varying(15),
    organization_name character varying(340),
    id_user bigint
);


ALTER TABLE public."Business" OWNER TO dev;

--
-- Name: LoginAttempts; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."LoginAttempts" (
    attempts integer,
    login_state public."LoginStateType",
    mac_address character varying(17) NOT NULL
);


ALTER TABLE public."LoginAttempts" OWNER TO dev;

--
-- Name: Moderator; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Moderator" (
    update_date date,
    id_user bigint
);


ALTER TABLE public."Moderator" OWNER TO dev;

--
-- Name: Personal; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Personal" (
    faculty character varying(50),
    career character varying(50),
    gender public."GenderType",
    id_user bigint
);


ALTER TABLE public."Personal" OWNER TO dev;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Session" (
    id_user bigint NOT NULL,
    token text NOT NULL,
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    device text NOT NULL
);


ALTER TABLE public."Session" OWNER TO dev;

--
-- Name: User; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."User" (
    name character varying(64) NOT NULL,
    presentation character varying(150),
    username character varying(30) NOT NULL,
    id bigint DEFAULT nextval(('"user_id_seq"'::text)::regclass) NOT NULL
);


ALTER TABLE public."User" OWNER TO dev;

--
-- Name: UserConfiguration; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."UserConfiguration" (
    privacy public."PrivacyType",
    id_user bigint
);


ALTER TABLE public."UserConfiguration" OWNER TO dev;

--
-- Name: UserRole; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."UserRole" (
    id_user bigint NOT NULL,
    role public."UserRoleType"
);


ALTER TABLE public."UserRole" OWNER TO dev;

--
-- Name: VerificationCode; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."VerificationCode" (
    code character varying(8),
    username character varying(64) NOT NULL,
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."VerificationCode" OWNER TO dev;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO dev;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Account" (password, email, id_user, phone_number, birthday) FROM stdin;
0acbfc311e50b11cb0966c22d2cb887eec45cad411b0bff42789106568b8853b	admin@uvgram.com	1	2281046161	2000-09-13
\.


--
-- Data for Name: AccountVerification; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."AccountVerification" (account_status, id_user) FROM stdin;
NO_BLOQUEADO	1
\.


--
-- Data for Name: Administrator; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Administrator" (created_time, id_user) FROM stdin;
2022-11-07 04:23:11.33201	1
\.


--
-- Data for Name: Business; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Business" (category, city, postal_code, postal_address, contact_email, phone_contact, organization_name, id_user) FROM stdin;
\.


--
-- Data for Name: LoginAttempts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."LoginAttempts" (attempts, login_state, mac_address) FROM stdin;
\.


--
-- Data for Name: Moderator; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Moderator" (update_date, id_user) FROM stdin;
\.


--
-- Data for Name: Personal; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Personal" (faculty, career, gender, id_user) FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Session" (id_user, token, created_time, device) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."User" (name, presentation, username, id) FROM stdin;
UVGram		UVGram	1
\.


--
-- Data for Name: UserConfiguration; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."UserConfiguration" (privacy, id_user) FROM stdin;
PUBLICO	1
\.


--
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."UserRole" (id_user, role) FROM stdin;
1	ADMINISTRADOR
\.


--
-- Data for Name: VerificationCode; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."VerificationCode" (code, username, created_time) FROM stdin;
\.


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.user_id_seq', 2, false);


--
-- Name: Account PK_Account; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "PK_Account" PRIMARY KEY (id_user);


--
-- Name: Administrator PK_Administrator; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Administrator"
    ADD CONSTRAINT "PK_Administrator" PRIMARY KEY (id_user);


--
-- Name: LoginAttempts PK_LoginAttempts; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."LoginAttempts"
    ADD CONSTRAINT "PK_LoginAttempts" PRIMARY KEY (mac_address);


--
-- Name: User PK_User; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PK_User" PRIMARY KEY (id);


--
-- Name: UserRole PK_UserRole; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "PK_UserRole" PRIMARY KEY (id_user);


--
-- Name: IXFK_AccountVerification_Account; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_AccountVerification_Account" ON public."AccountVerification" USING btree (id_user);


--
-- Name: IXFK_Account_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Account_User" ON public."Account" USING btree (id_user);


--
-- Name: IXFK_Administrator_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Administrator_UserRole" ON public."Administrator" USING btree (id_user);


--
-- Name: IXFK_Business_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Business_UserRole" ON public."Business" USING btree (id_user);


--
-- Name: IXFK_Moderator_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Moderator_UserRole" ON public."Moderator" USING btree (id_user);


--
-- Name: IXFK_Personal_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Personal_UserRole" ON public."Personal" USING btree (id_user);


--
-- Name: IXFK_Session_Account; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Session_Account" ON public."Session" USING btree (id_user);


--
-- Name: IXFK_UserConfiguration_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_UserConfiguration_User" ON public."UserConfiguration" USING btree (id_user);


--
-- Name: IXFK_UserRole_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_UserRole_User" ON public."UserRole" USING btree (id_user);


--
-- Name: AccountVerification FK_AccountVerification_Account; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."AccountVerification"
    ADD CONSTRAINT "FK_AccountVerification_Account" FOREIGN KEY (id_user) REFERENCES public."Account"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Account FK_Account_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "FK_Account_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Administrator FK_Administrator_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Administrator"
    ADD CONSTRAINT "FK_Administrator_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Business FK_Business_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Business"
    ADD CONSTRAINT "FK_Business_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Moderator FK_Moderator_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Moderator"
    ADD CONSTRAINT "FK_Moderator_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Personal FK_Personal_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "FK_Personal_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session FK_Session_Account; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "FK_Session_Account" FOREIGN KEY (id_user) REFERENCES public."Account"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserConfiguration FK_UserConfiguration_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."UserConfiguration"
    ADD CONSTRAINT "FK_UserConfiguration_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserRole FK_UserRole_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "FK_UserRole_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--
