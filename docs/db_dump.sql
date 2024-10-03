--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2 (Debian 16.2-1.pgdg120+2)

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
-- Name: FollowRequestStatusType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."FollowRequestStatusType" AS ENUM (
    'ACEPTADO',
    'PENDIENTE'
);


ALTER TYPE public."FollowRequestStatusType" OWNER TO dev;

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
-- Name: MessageStatusType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."MessageStatusType" AS ENUM (
    'VIOLACION_POLITICAS',
    'ELIMINADO',
    'ENVIADO',
    'LEIDO'
);


ALTER TYPE public."MessageStatusType" OWNER TO dev;

--
-- Name: MessageType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."MessageType" AS ENUM (
    'TEXTO',
    'ARCHIVO',
    'IMAGEN',
    'VIDEO'
);


ALTER TYPE public."MessageType" OWNER TO dev;

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
-- Name: enum_Business_category; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Business_category" AS ENUM (
    'BLOG_PERSONAL',
    'PRODUCTO_O_SERVICIO',
    'ARTE',
    'MUSICO_O_BANDA',
    'COMPRAS_O_VENTAS_MINORISTAS',
    'SALUD_O_BELLEZA',
    'TIENDAS_COMESTIBLES'
);


ALTER TYPE public."enum_Business_category" OWNER TO dev;

--
-- Name: enum_Follower_status; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Follower_status" AS ENUM (
    'ACEPTADO',
    'PENDIENTE'
);


ALTER TYPE public."enum_Follower_status" OWNER TO dev;

--
-- Name: enum_Message_message_status; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Message_message_status" AS ENUM (
    'VIOLACION_POLITICAS',
    'LEIDO',
    'ELIMINADO',
    'ENVIADO'
);


ALTER TYPE public."enum_Message_message_status" OWNER TO dev;

--
-- Name: enum_Message_message_type; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Message_message_type" AS ENUM (
    'TEXTO',
    'IMAGEN',
    'VIDEO'
);


ALTER TYPE public."enum_Message_message_type" OWNER TO dev;

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
-- Name: Block; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Block" (
    id_user_blocker bigint NOT NULL,
    id_user_blocked bigint NOT NULL
);


ALTER TABLE public."Block" OWNER TO dev;

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
-- Name: Chat; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Chat" (
    id bigint DEFAULT nextval(('"chat_id_seq"'::text)::regclass) NOT NULL,
    uuid character varying(128) NOT NULL,
    id_user1 bigint NOT NULL,
    id_user2 bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Chat" OWNER TO dev;

--
-- Name: ChatGroup; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."ChatGroup" (
    id bigint DEFAULT nextval(('"chatgroup_id_seq"'::text)::regclass) NOT NULL,
    name character varying(120) NOT NULL,
    uuid character varying(128) NOT NULL,
    id_administrator bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatGroup" OWNER TO dev;

--
-- Name: ChatGroupMembership; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."ChatGroupMembership" (
    id_user bigint NOT NULL,
    id_chatgroup bigint NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatGroupMembership" OWNER TO dev;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Comment" (
    comment character varying(2200) NOT NULL,
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id bigint DEFAULT nextval(('"comment_id_seq"'::text)::regclass) NOT NULL,
    id_post bigint NOT NULL,
    id_user bigint NOT NULL,
    uuid character varying(11) NOT NULL
);


ALTER TABLE public."Comment" OWNER TO dev;

--
-- Name: CommentLike; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."CommentLike" (
    id_comment bigint NOT NULL,
    id_user bigint NOT NULL,
    liked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CommentLike" OWNER TO dev;

--
-- Name: EducationalProgram; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."EducationalProgram" (
    id bigint DEFAULT nextval(('"educationalprogram_id_seq"'::text)::regclass) NOT NULL,
    educational_program character varying(240) NOT NULL,
    id_faculty bigint NOT NULL
);


ALTER TABLE public."EducationalProgram" OWNER TO dev;

--
-- Name: Faculty; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Faculty" (
    faculty character varying(120),
    id_region bigint,
    id bigint DEFAULT nextval(('"faculty_id_seq"'::text)::regclass) NOT NULL
);


ALTER TABLE public."Faculty" OWNER TO dev;

--
-- Name: Follower; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Follower" (
    id_user_follower bigint NOT NULL,
    id_user_followed bigint NOT NULL,
    status public."FollowRequestStatusType" NOT NULL
);


ALTER TABLE public."Follower" OWNER TO dev;

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
-- Name: Message; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Message" (
    id bigint DEFAULT nextval(('"message_id_seq"'::text)::regclass) NOT NULL,
    uuid character varying(128),
    content character varying(2200),
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    message_type public."MessageType",
    id_user bigint NOT NULL,
    message_status public."MessageStatusType" DEFAULT 'ENVIADO'::public."MessageStatusType" NOT NULL,
    delivery_at timestamp without time zone,
    id_chat bigint,
    id_chatgroup bigint
);


ALTER TABLE public."Message" OWNER TO dev;

--
-- Name: MessageFile; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."MessageFile" (
    id_message bigint NOT NULL,
    filepath character varying(128)
);


ALTER TABLE public."MessageFile" OWNER TO dev;

--
-- Name: MessageLike; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."MessageLike" (
    id_message bigint NOT NULL,
    id_user bigint NOT NULL,
    liked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MessageLike" OWNER TO dev;

--
-- Name: MessageSeen; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."MessageSeen" (
    id_message bigint NOT NULL,
    id_user bigint NOT NULL,
    seen_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MessageSeen" OWNER TO dev;

--
-- Name: Moderator; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Moderator" (
    update_date date,
    id_user bigint
);


ALTER TABLE public."Moderator" OWNER TO dev;

--
-- Name: NestedComment; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."NestedComment" (
    parent_id_comment bigint NOT NULL,
    child_id_comment bigint NOT NULL
);


ALTER TABLE public."NestedComment" OWNER TO dev;

--
-- Name: Personal; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Personal" (
    gender public."GenderType",
    id_user bigint,
    id_career bigint
);


ALTER TABLE public."Personal" OWNER TO dev;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Post" (
    description character varying(2200),
    comments_allowed boolean DEFAULT true NOT NULL,
    likes_allowed boolean DEFAULT true NOT NULL,
    id_user bigint NOT NULL,
    id bigint DEFAULT nextval(('"post_id_seq"'::text)::regclass) NOT NULL,
    uuid character varying(320) NOT NULL,
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Post" OWNER TO dev;

--
-- Name: PostFile; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."PostFile" (
    filename character varying(128) NOT NULL,
    id_post bigint NOT NULL
);


ALTER TABLE public."PostFile" OWNER TO dev;

--
-- Name: PostLike; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."PostLike" (
    id_user bigint NOT NULL,
    id_post bigint NOT NULL,
    liked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PostLike" OWNER TO dev;

--
-- Name: Region; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Region" (
    id bigint DEFAULT nextval(('"region_id_seq"'::text)::regclass) NOT NULL,
    region character varying(120) NOT NULL
);


ALTER TABLE public."Region" OWNER TO dev;

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
-- Name: URLRecover; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."URLRecover" (
    uuid uuid NOT NULL,
    id_user bigint NOT NULL,
    action character varying(50) NOT NULL,
    token text
);


ALTER TABLE public."URLRecover" OWNER TO dev;

--
-- Name: User; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."User" (
    name character varying(64) NOT NULL,
    presentation character varying(150),
    username character varying(30) NOT NULL,
    filepath character varying(120),
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
-- Name: chat_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.chat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_id_seq OWNER TO dev;

--
-- Name: chatgroup_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.chatgroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chatgroup_id_seq OWNER TO dev;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_id_seq OWNER TO dev;

--
-- Name: educationalprogram_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.educationalprogram_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.educationalprogram_id_seq OWNER TO dev;

--
-- Name: faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.faculty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculty_id_seq OWNER TO dev;

--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_id_seq OWNER TO dev;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_id_seq OWNER TO dev;

--
-- Name: region_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.region_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.region_id_seq OWNER TO dev;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO dev;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Account" (password, email, id_user, phone_number, birthday) FROM stdin;
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	adrianc68@uvgram.com	19	239842389	2000-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	memero@uvgram.com	20	2389423894	1981-01-31
\.


--
-- Data for Name: AccountVerification; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."AccountVerification" (account_status, id_user) FROM stdin;
NO_BLOQUEADO	19
NO_BLOQUEADO	20
\.


--
-- Data for Name: Administrator; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Administrator" (created_time, id_user) FROM stdin;
\.


--
-- Data for Name: Block; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Block" (id_user_blocker, id_user_blocked) FROM stdin;
\.


--
-- Data for Name: Business; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Business" (category, city, postal_code, postal_address, contact_email, phone_contact, organization_name, id_user) FROM stdin;
\.


--
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Chat" (id, uuid, id_user1, id_user2, created_at) FROM stdin;
9	8f5cdfc9-ae38-45d0-a603-1f5bd445cc00	19	20	2024-09-20 07:24:01.179854
\.


--
-- Data for Name: ChatGroup; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."ChatGroup" (id, name, uuid, id_administrator, created_at) FROM stdin;
\.


--
-- Data for Name: ChatGroupMembership; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."ChatGroupMembership" (id_user, id_chatgroup, added_at) FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Comment" (comment, created_time, id, id_post, id_user, uuid) FROM stdin;
test	2024-09-20 07:27:41.714787	444	62	19	991aca44144
hahahaha	2024-09-20 07:27:43.817211	445	62	19	0b542fb9024
av a verga wey	2024-09-20 07:27:50.174406	446	62	19	92b6c4ecae1
xddddd	2024-09-20 07:27:51.892214	447	62	19	c63210b43f5
ah pinche perrrrrro\n	2024-09-20 07:27:58.835911	448	62	19	a6d074b6b98
\.


--
-- Data for Name: CommentLike; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."CommentLike" (id_comment, id_user, liked_at) FROM stdin;
447	19	2024-09-20 07:27:54.737495
\.


--
-- Data for Name: EducationalProgram; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."EducationalProgram" (id, educational_program, id_faculty) FROM stdin;
\.


--
-- Data for Name: Faculty; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Faculty" (faculty, id_region, id) FROM stdin;
\.


--
-- Data for Name: Follower; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Follower" (id_user_follower, id_user_followed, status) FROM stdin;
\.


--
-- Data for Name: LoginAttempts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."LoginAttempts" (attempts, login_state, mac_address) FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Message" (id, uuid, content, sent_at, message_type, id_user, message_status, delivery_at, id_chat, id_chatgroup) FROM stdin;
57	40dc92d2-b4d7-4543-b5b2-d2401afefeb2	20/c/9/d41d378a3530106e.zip	2024-09-20 07:26:35.437793	ARCHIVO	20	ENVIADO	\N	9	\N
54	d6eb481a-3604-4bc4-b198-f2e6be63b300	Que onda	2024-09-20 07:24:01.199749	TEXTO	19	ENVIADO	\N	9	\N
55	e044350c-f9d1-4370-91b6-63c0edec2922	Que onda	2024-09-20 07:24:10.899953	TEXTO	20	ENVIADO	\N	9	\N
56	50beae81-dc44-4e7a-a91a-301e9b9b407f	Reply	2024-09-20 07:24:28.800765	TEXTO	20	ENVIADO	\N	9	\N
\.


--
-- Data for Name: MessageFile; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."MessageFile" (id_message, filepath) FROM stdin;
\.


--
-- Data for Name: MessageLike; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."MessageLike" (id_message, id_user, liked_at) FROM stdin;
\.


--
-- Data for Name: MessageSeen; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."MessageSeen" (id_message, id_user, seen_at) FROM stdin;
\.


--
-- Data for Name: Moderator; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Moderator" (update_date, id_user) FROM stdin;
\.


--
-- Data for Name: NestedComment; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."NestedComment" (parent_id_comment, child_id_comment) FROM stdin;
\.


--
-- Data for Name: Personal; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Personal" (gender, id_user, id_career) FROM stdin;
INDIFERENTE	19	\N
INDIFERENTE	20	\N
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Post" (description, comments_allowed, likes_allowed, id_user, id, uuid, created_time) FROM stdin;
El post primero de todo uvgram\n.\nXD\n.\n<h1>test</h1>	f	f	19	62	856467a2134eac8f	2024-09-20 05:07:31.949819
\.


--
-- Data for Name: PostFile; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."PostFile" (filename, id_post) FROM stdin;
19/p/1/eb14fe9901c81bf9.jpg	62
19/p/1/a1d7de4deb7ab6e7.jpg	62
19/p/1/0388d59941fd7564.jpg	62
19/p/1/8f860a4baf87d595.jpg	62
19/p/1/a7cf156a144ac6ac.jpg	62
\.


--
-- Data for Name: PostLike; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."PostLike" (id_user, id_post, liked_at) FROM stdin;
19	62	2024-09-20 05:14:19.467687
\.


--
-- Data for Name: Region; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Region" (id, region) FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Session" (id_user, token, created_time, device) FROM stdin;
19	23012da6-fe9f-452c-96d0-f6ae0376e969	2024-09-20 05:10:47.337769	localhost:8080
20	8bfd1a80-281b-4fa8-b68d-25d2f62b158b	2024-09-20 05:43:11.959213	localhost:8080
19	f80466bc-fda7-4acd-be8a-17a9e0f6cac6	2024-09-20 05:44:03.689105	localhost:8080
20	07c4a787-b1db-45d4-9fe2-90d2ea35770c	2024-09-20 07:23:28.170059	localhost:8080
19	63d8df46-6cc3-4ceb-834e-86a5c30ddb74	2024-09-20 07:23:59.462496	localhost:8080
20	2d80f784-d37a-42bd-b98c-4cfb3099aa46	2024-09-20 07:24:05.034408	localhost:8080
19	e49bf931-0ece-485a-87b7-c8e7aca5bf02	2024-09-20 07:27:32.429894	localhost:8080
\.


--
-- Data for Name: URLRecover; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."URLRecover" (uuid, id_user, action, token) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."User" (name, presentation, username, filepath, id) FROM stdin;
Angel Adrian	\N	adrianc68	19/acc/e35631b288be9fad.jpg	19
memero	\N	memero	\N	20
\.


--
-- Data for Name: UserConfiguration; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."UserConfiguration" (privacy, id_user) FROM stdin;
PUBLICO	19
PUBLICO	20
\.


--
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."UserRole" (id_user, role) FROM stdin;
19	PERSONAL
20	PERSONAL
\.


--
-- Data for Name: VerificationCode; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."VerificationCode" (code, username, created_time) FROM stdin;
\.


--
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.chat_id_seq', 9, true);


--
-- Name: chatgroup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.chatgroup_id_seq', 1, false);


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.comment_id_seq', 448, true);


--
-- Name: educationalprogram_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.educationalprogram_id_seq', 1, false);


--
-- Name: faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.faculty_id_seq', 1, false);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.message_id_seq', 57, true);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.post_id_seq', 62, true);


--
-- Name: region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.region_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.user_id_seq', 20, true);


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
-- Name: Chat PK_Chat; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "PK_Chat" PRIMARY KEY (id);


--
-- Name: Comment PK_Comment; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "PK_Comment" PRIMARY KEY (id);


--
-- Name: EducationalProgram PK_EducationalProgram; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."EducationalProgram"
    ADD CONSTRAINT "PK_EducationalProgram" PRIMARY KEY (id);


--
-- Name: Faculty PK_Faculty; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Faculty"
    ADD CONSTRAINT "PK_Faculty" PRIMARY KEY (id);


--
-- Name: ChatGroup PK_GroupChat; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ChatGroup"
    ADD CONSTRAINT "PK_GroupChat" PRIMARY KEY (id);


--
-- Name: LoginAttempts PK_LoginAttempts; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."LoginAttempts"
    ADD CONSTRAINT "PK_LoginAttempts" PRIMARY KEY (mac_address);


--
-- Name: Message PK_Message; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "PK_Message" PRIMARY KEY (id);


--
-- Name: Post PK_Publication; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "PK_Publication" PRIMARY KEY (id);


--
-- Name: Region PK_Region; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Region"
    ADD CONSTRAINT "PK_Region" PRIMARY KEY (id);


--
-- Name: URLRecover PK_URLRecover; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."URLRecover"
    ADD CONSTRAINT "PK_URLRecover" PRIMARY KEY (id_user);


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
-- Name: IXFK_Block_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Block_User" ON public."Block" USING btree (id_user_blocker);


--
-- Name: IXFK_Block_User_02; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Block_User_02" ON public."Block" USING btree (id_user_blocked);


--
-- Name: IXFK_Business_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Business_UserRole" ON public."Business" USING btree (id_user);


--
-- Name: IXFK_ChatGroupMembership_ChatGroup; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_ChatGroupMembership_ChatGroup" ON public."ChatGroupMembership" USING btree (id_chatgroup);


--
-- Name: IXFK_ChatGroupMembership_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_ChatGroupMembership_User" ON public."ChatGroupMembership" USING btree (id_user);


--
-- Name: IXFK_ChatGroup_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_ChatGroup_User" ON public."ChatGroup" USING btree (id_administrator);


--
-- Name: IXFK_CommentLike_Comment; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_CommentLike_Comment" ON public."CommentLike" USING btree (id_comment);


--
-- Name: IXFK_CommentLike_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_CommentLike_User" ON public."CommentLike" USING btree (id_user);


--
-- Name: IXFK_Comment_Post; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Comment_Post" ON public."Comment" USING btree (id_post);


--
-- Name: IXFK_Comment_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Comment_User" ON public."Comment" USING btree (id_user);


--
-- Name: IXFK_EducationalProgram_Faculty; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_EducationalProgram_Faculty" ON public."EducationalProgram" USING btree (id_faculty);


--
-- Name: IXFK_Faculty_Region; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Faculty_Region" ON public."Faculty" USING btree (id_region);


--
-- Name: IXFK_Follower_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Follower_User" ON public."Follower" USING btree (id_user_follower);


--
-- Name: IXFK_Follower_User_02; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Follower_User_02" ON public."Follower" USING btree (id_user_followed);


--
-- Name: IXFK_MessageFile_Message; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_MessageFile_Message" ON public."MessageFile" USING btree (id_message);


--
-- Name: IXFK_MessageLike_Message; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_MessageLike_Message" ON public."MessageLike" USING btree (id_message);


--
-- Name: IXFK_MessageLike_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_MessageLike_User" ON public."MessageLike" USING btree (id_user);


--
-- Name: IXFK_MessageSeen_Message; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_MessageSeen_Message" ON public."MessageSeen" USING btree (id_message);


--
-- Name: IXFK_MessageSeen_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_MessageSeen_User" ON public."MessageSeen" USING btree (id_user);


--
-- Name: IXFK_Message_Chat; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Message_Chat" ON public."Message" USING btree (id_chat);


--
-- Name: IXFK_Message_ChatGroup; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Message_ChatGroup" ON public."Message" USING btree (id_chatgroup);


--
-- Name: IXFK_Message_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Message_User" ON public."Message" USING btree (id_user);


--
-- Name: IXFK_Moderator_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Moderator_UserRole" ON public."Moderator" USING btree (id_user);


--
-- Name: IXFK_NestedComment_Comment; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_NestedComment_Comment" ON public."NestedComment" USING btree (parent_id_comment);


--
-- Name: IXFK_NestedComment_Comment_02; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_NestedComment_Comment_02" ON public."NestedComment" USING btree (child_id_comment);


--
-- Name: IXFK_Personal_EducationalProgram; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Personal_EducationalProgram" ON public."Personal" USING btree (id_career);


--
-- Name: IXFK_Personal_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Personal_UserRole" ON public."Personal" USING btree (id_user);


--
-- Name: IXFK_PostFile_Post; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_PostFile_Post" ON public."PostFile" USING btree (id_post);


--
-- Name: IXFK_PostLike_Post; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_PostLike_Post" ON public."PostLike" USING btree (id_post);


--
-- Name: IXFK_PostLike_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_PostLike_User" ON public."PostLike" USING btree (id_user);


--
-- Name: IXFK_Publication_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Publication_User" ON public."Post" USING btree (id_user);


--
-- Name: IXFK_Session_Account; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Session_Account" ON public."Session" USING btree (id_user);


--
-- Name: IXFK_URLRecover_Account; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_URLRecover_Account" ON public."URLRecover" USING btree (id_user);


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
-- Name: Block FK_Block_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "FK_Block_User" FOREIGN KEY (id_user_blocker) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Block FK_Blocked_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "FK_Blocked_User" FOREIGN KEY (id_user_blocked) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Business FK_Business_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Business"
    ADD CONSTRAINT "FK_Business_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatGroupMembership FK_ChatGroupMembership_ChatGroup; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ChatGroupMembership"
    ADD CONSTRAINT "FK_ChatGroupMembership_ChatGroup" FOREIGN KEY (id_chatgroup) REFERENCES public."ChatGroup"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatGroupMembership FK_ChatGroupMembership_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ChatGroupMembership"
    ADD CONSTRAINT "FK_ChatGroupMembership_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatGroup FK_ChatGroup_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ChatGroup"
    ADD CONSTRAINT "FK_ChatGroup_User" FOREIGN KEY (id_administrator) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Chat FK_Chat_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "FK_Chat_User" FOREIGN KEY (id_user1) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Chat FK_Chat_User_02; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "FK_Chat_User_02" FOREIGN KEY (id_user2) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommentLike FK_CommentLike_Comment; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "FK_CommentLike_Comment" FOREIGN KEY (id_comment) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment FK_Comment_Post; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "FK_Comment_Post" FOREIGN KEY (id_post) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment FK_Comment_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "FK_Comment_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EducationalProgram FK_EducationalProgram_Faculty; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."EducationalProgram"
    ADD CONSTRAINT "FK_EducationalProgram_Faculty" FOREIGN KEY (id_faculty) REFERENCES public."Faculty"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follower FK_Followed_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Follower"
    ADD CONSTRAINT "FK_Followed_User" FOREIGN KEY (id_user_followed) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follower FK_Follower_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Follower"
    ADD CONSTRAINT "FK_Follower_User" FOREIGN KEY (id_user_follower) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessageFile FK_MessageFile_Message; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."MessageFile"
    ADD CONSTRAINT "FK_MessageFile_Message" FOREIGN KEY (id_message) REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessageLike FK_MessageLike_Message; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."MessageLike"
    ADD CONSTRAINT "FK_MessageLike_Message" FOREIGN KEY (id_message) REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessageLike FK_MessageLike_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."MessageLike"
    ADD CONSTRAINT "FK_MessageLike_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessageSeen FK_MessageSeen_Message; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."MessageSeen"
    ADD CONSTRAINT "FK_MessageSeen_Message" FOREIGN KEY (id_message) REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessageSeen FK_MessageSeen_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."MessageSeen"
    ADD CONSTRAINT "FK_MessageSeen_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message FK_Message_Chat; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "FK_Message_Chat" FOREIGN KEY (id_chat) REFERENCES public."Chat"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message FK_Message_ChatGroup; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "FK_Message_ChatGroup" FOREIGN KEY (id_chatgroup) REFERENCES public."ChatGroup"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message FK_Message_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "FK_Message_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Moderator FK_Moderator_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Moderator"
    ADD CONSTRAINT "FK_Moderator_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NestedComment FK_NestedComment_Comment; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."NestedComment"
    ADD CONSTRAINT "FK_NestedComment_Comment" FOREIGN KEY (parent_id_comment) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NestedComment FK_NestedComment_Comment_02; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."NestedComment"
    ADD CONSTRAINT "FK_NestedComment_Comment_02" FOREIGN KEY (child_id_comment) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Personal FK_Personal_EducationalProgram; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "FK_Personal_EducationalProgram" FOREIGN KEY (id_career) REFERENCES public."EducationalProgram"(id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- Name: Personal FK_Personal_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "FK_Personal_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostFile FK_PostFile_Post; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."PostFile"
    ADD CONSTRAINT "FK_PostFile_Post" FOREIGN KEY (id_post) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLike FK_PostLike_Post; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "FK_PostLike_Post" FOREIGN KEY (id_post) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLike FK_PostLike_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "FK_PostLike_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Post FK_Publication_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "FK_Publication_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session FK_Session_Account; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "FK_Session_Account" FOREIGN KEY (id_user) REFERENCES public."Account"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: URLRecover FK_URLRecover_Account; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."URLRecover"
    ADD CONSTRAINT "FK_URLRecover_Account" FOREIGN KEY (id_user) REFERENCES public."Account"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


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

