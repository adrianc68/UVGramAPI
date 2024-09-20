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
    id_sender bigint NOT NULL,
    id_receiver bigint NOT NULL,
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
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	roberto@uvgram.com	2	349823498	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	carlos@uvgram.com	3	234892398	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	enrique@uvgram.com	4	2348923498	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	josue@uvgram.com	5	238942983	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	matias@uvgram.com	6	2389423894	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	hector@uvgram.com	7	2348923498	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	vulcan@uvgram.com	8	238942389	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	angel@uvgram.com	9	238942389	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	hola@uvgram.com	10	20349290	2022-01-31
0052798e0a085a898c840d57db94b2dd673be8fc25b573063e4617ca42a75ff4	hola23423@uvgram.com	11	42903590	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	mataleon@uvgram.com	18	234890284932	2010-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	ala@ala.com	12	2328942892	2020-09-29
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	coca@coca.com	13	23489023498	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	hola@hola.com	14	24389029	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	fbi@fbi.com	15	2389429384	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	meme@meme.uv	16	2389423894	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	bloqueado@uv.com	17	2389423894	2022-01-31
3e6dc62f220c57f4e44e3dd541c175b3a4fd22986bafa16d47ce3d4c2b224ac8	adrianc68@uvgram.com	1	22892342	2022-01-26
\.


--
-- Data for Name: AccountVerification; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."AccountVerification" (account_status, id_user) FROM stdin;
NO_BLOQUEADO	1
NO_BLOQUEADO	2
NO_BLOQUEADO	3
NO_BLOQUEADO	4
NO_BLOQUEADO	5
NO_BLOQUEADO	6
NO_BLOQUEADO	7
NO_BLOQUEADO	8
NO_BLOQUEADO	9
NO_BLOQUEADO	10
NO_BLOQUEADO	11
NO_BLOQUEADO	12
NO_BLOQUEADO	13
NO_BLOQUEADO	14
NO_BLOQUEADO	15
NO_BLOQUEADO	16
NO_BLOQUEADO	17
NO_BLOQUEADO	18
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
1	17
\.


--
-- Data for Name: Business; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Business" (category, city, postal_code, postal_address, contact_email, phone_contact, organization_name, id_user) FROM stdin;
\.


--
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Chat" (id, uuid, id_sender, id_receiver, created_at) FROM stdin;
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
test	2024-09-08 05:33:31.745303	217	3	2	fe7a8e69391
@roberto test	2024-09-08 05:33:46.21021	218	3	1	b2511b82901
@adrianc68 test	2024-09-08 05:33:56.125347	219	3	2	1bd1e8b17a8
@roberto test	2024-09-08 05:34:05.367278	220	3	1	8050f60b3a9
@adrianc68 test	2024-09-08 05:34:09.221776	221	3	1	2853deaafe1
@roberto test	2024-09-08 05:34:11.259406	222	3	1	5f9106a3748
test\n	2024-09-08 05:34:16.759145	223	3	1	4abc5d073c7
@adrianc68 test	2024-09-08 05:34:19.640073	224	3	1	ca72bf93f55
@adrianc68 test	2024-09-08 05:34:22.658366	225	3	1	f637a7e0635
test	2024-09-08 05:34:27.700121	226	3	2	71abc92e706
23r23r2	2024-09-08 05:34:28.901634	227	3	2	64e725322ac
2r23r23	2024-09-08 05:34:30.093105	228	3	2	2ed25dc7389
@roberto test	2024-09-08 05:34:46.953472	229	3	2	658130506d0
@roberto tasdfafd	2024-09-08 05:34:50.29148	230	3	2	b532e493463
@roberto asdfsadf	2024-09-08 05:34:52.549774	231	3	2	49f656fdb87
@roberto fdsaff	2024-09-08 05:35:03.079849	232	3	1	01eab562558
@roberto fdasfasdf	2024-09-08 05:35:06.719647	233	3	1	51efd648cfe
@adrianc68 fdasfasdfds	2024-09-08 05:35:09.646634	234	3	1	f8fbb4a5ad3
@adrianc68 fasdfasfdsa	2024-09-08 05:35:12.658462	235	3	1	3ad1ed07732
@roberto fasdfsadfsaf	2024-09-08 05:35:16.081456	236	3	1	77ef18c317d
@roberto asdfsafasd	2024-09-08 05:35:19.438527	237	3	1	013398f7637
@adrianc68 fasdfsafdasf	2024-09-08 05:35:23.352994	238	3	1	6226b578e4a
@adrianc68 asdfasfdas	2024-09-08 05:35:55.644941	239	3	13	8443915d0c4
@adrianc68 asdfasfdsa	2024-09-08 05:35:57.838616	240	3	13	11877bce782
@roberto asdfasddfas	2024-09-08 05:35:59.505617	241	3	13	ec360cc82ac
asdfasdfafasd	2024-09-08 05:36:02.078489	242	3	13	a5f6e1c6cfe
@adrianc68 asdfasdf	2024-09-08 05:36:24.984864	243	3	1	49646eec6eb
@coca asdfasdfasd	2024-09-08 05:36:29.89645	244	3	1	160944d7c06
@adrianc68 fasdfasdf	2024-09-08 05:36:32.66341	245	3	1	d1113d8bda5
asdfasdfasf	2024-09-08 05:36:35.067027	246	3	1	93d72db6187
fdsafasdfasd	2024-09-08 05:36:38.545527	247	3	1	75a9a07f77e
@adrianc68 fasdfdsaf	2024-09-08 05:39:16.827692	248	3	1	301a68640e9
@adrianc68 fasdfasdfas	2024-09-08 05:39:19.534335	249	3	1	cb422c178a1
@adrianc68 fdasfsdfdsa	2024-09-08 05:39:23.015049	250	3	1	906c88abfad
@adrianc68 asdfasdfasd	2024-09-08 05:39:26.01628	251	3	1	34fa48f3140
@roberto fdasfsadfsaf	2024-09-08 05:39:29.201129	252	3	1	6802dfb8aeb
@roberto asdfsdfas	2024-09-08 05:39:32.206308	253	3	1	e572b521a6c
@roberto fasdfasdfsafd	2024-09-08 05:39:56.510072	254	3	1	653dd6dd15d
test	2024-09-10 21:25:29.705832	255	7	1	73d12d43b96
test	2024-09-10 21:25:40.009155	256	6	1	d3106a28557
@adrianc68 test\n	2024-09-10 21:46:42.559603	257	7	1	67fb636eece
@adrianc68 test	2024-09-10 21:46:45.722438	258	7	1	601af8d3fd2
@adrianc68 test\n	2024-09-10 21:46:48.978391	259	7	1	8043ba479b5
@adrianc68 test	2024-09-10 21:46:55.535924	260	7	1	489f8b2fedb
gfsdg kgsdf sdjfklgsdjfgkldsjglkdsfjglskdfgj dsklfjgsldkfgjdfklgjsdklfgjklsdfgfksld	2024-09-10 23:33:05.785627	261	3	1	a2b3dbce4f5
fadsfsase!	2024-09-10 23:33:32.164666	262	7	1	d74d7b75638
test	2024-09-10 23:43:51.228062	263	1	1	185d5a78a40
test	2024-09-10 23:44:01.549877	264	1	1	1ecfca2e2a4
test	2024-09-10 23:45:36.589349	265	1	1	52553e893c8
test	2024-09-10 23:46:50.266796	266	1	1	275764da37c
test	2024-09-10 23:47:08.109234	267	1	1	1a0af6bdfe1
test	2024-09-10 23:48:12.429284	268	1	1	095ba7db718
test	2024-09-10 23:48:25.178393	269	1	1	2397fd22df6
@adrianc68 test	2024-09-10 23:48:48.341411	270	1	1	84e18cf3d6c
@adrianc68 test	2024-09-10 23:49:38.671317	271	1	1	a321804d8e4
@adrianc68 test	2024-09-10 23:49:41.14892	272	1	1	0e21965990d
jlk jkl klj ljk jkl jkll jkjkl ljk jkl jkl jl k	2024-09-10 23:56:51.421512	273	7	1	a9a50f1e30b
arreglar el problema de lentitud	2024-09-11 03:21:25.316275	274	7	14	7fc75a862c8
@adrianc68 test	2024-09-11 05:50:49.455885	275	1	1	1a0050ca759
@adrianc68 test	2024-09-11 05:51:04.232485	276	1	1	6944c41fa1e
test	2024-09-11 05:51:13.691952	277	1	1	a2a11dca0be
@adrianc68 test	2024-09-11 05:55:04.562269	278	7	1	0c2411bce30
@adrianc68 test	2024-09-11 05:55:13.018914	279	7	1	b6cfd8cc628
test	2024-09-11 05:55:22.367123	280	7	1	c10966501cf
@hola test	2024-09-11 05:55:26.402633	281	7	1	3d4fe74afd8
asdfsafsa	2024-09-11 05:55:28.45223	282	7	1	6e187ff1d50
@adrianc68 testst	2024-09-11 05:55:32.479617	283	7	1	ecac1ff231d
@adrianc68 sdfsdfsfs	2024-09-11 05:55:35.745219	284	7	1	c78d6b2b2fb
sdafasdf	2024-09-11 05:55:42.429729	285	7	1	250d510b5fd
sdfasdfas	2024-09-11 05:55:45.637122	286	7	1	67212f18a52
test	2024-09-12 20:56:43.330156	287	7	1	b4b3c9f665e
test	2024-09-12 21:09:00.627501	288	8	1	92f24a7805c
@adrianc68 testttt	2024-09-13 00:54:00.758365	289	3	1	56079fd30c9
@adrianc68 holaaaaaa	2024-09-13 00:54:07.789788	290	3	1	c24829c7490
kljjklkljjkll	2024-09-13 04:01:24.286954	291	7	15	21524236679
Hola como estas esto es una prueba y ahora no hay problema con la utilizacion de recursos puesto que ahora la escritura es mas rapida pero aun se siente como lenta, al parecer ahora son los elementos <userProfile> que se cargan convirtiendolos a base64	2024-09-14 23:19:39.179905	292	7	1	6c539224eab
kkkkkk	2024-09-15 05:27:58.187553	293	7	1	26588d2f546
test	2024-09-15 05:36:16.471485	294	7	1	5b982e350f3
jajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajaj	2024-09-16 19:02:15.274833	370	27	16	d51d6a5b68d
AL parecer ya esta funcionando correectamente el sistema con respecto a las imagenes y los comentarios ya que ambos eran lentos tanto para obtenerse. Ahora los comentarios son mas rapidos y las imagenes de los usuarios se obtienen con mayor rapidez supongo que hace uso de la cache del navegador para evitar hacer petiicones innecesarias a la API aun asi se debe cambiar la direccion de la API de los recursos o mas biein seprar la api de la obtencion de los recursos y aumentaremos la velocidad :)	2024-09-15 06:05:12.893533	295	7	1	569ece8e7ba
Este es el comportamiento esperado de los comentarios en instagram\n.\nPero para hacer estos /n/r debe funcionar exactamente igual que en la red social mas grande de la historia	2024-09-15 06:05:55.632905	296	7	1	58c85ec53af
test	2024-09-15 06:07:42.75223	297	7	1	4ce4f7f7a64
@adrianc68 test	2024-09-15 06:10:09.466647	298	7	1	95e2bd509ca
test	2024-09-15 06:11:47.455246	299	7	1	40d8e0dc0b7
@adrianc68 testsetest	2024-09-15 06:11:49.734539	300	7	1	d83bcad4463
@adrianc68 testsetest	2024-09-15 06:11:52.362936	301	7	1	f9532b8edc6
@adrianc68 testeststssts	2024-09-15 06:11:54.666101	302	7	1	fd7f3a334ba
@adrianc68 asdfafsdasdfasdfasdfasdfadfsafsdafdsasdfasdfasdfasdfasdfasdfasdfasdfads lsd fjsaodf jsadlk fjasdlk fjasdkl fjsadklf jsdlkfjasdlk fjsdlkf jsadlk fjsdlk fjasdkla fjaslk fjsadkl fjaslkdf jsakld fjsadklf jsadkl fjsadkl fjsadklf jsklf sjdlkfjkl	2024-09-15 06:12:03.914993	303	7	1	036b22ebb59
test	2024-09-15 06:15:07.829662	304	7	1	e6eb963165e
hola	2024-09-15 06:15:10.413869	305	7	1	677145fe7cc
asfdfasfdsfas	2024-09-15 06:38:06.066279	306	7	16	3e188b419c9
fsadfdasdfaasa	2024-09-15 06:38:08.409003	307	7	16	c61b9c2e66f
hahahahaha	2024-09-15 06:38:11.14596	308	7	16	0c8d1ccfe2c
sadfsadfasdfasfasdfasf	2024-09-15 06:38:12.737413	309	7	16	0907973e6a1
sdfgdfsgdsfgdfsgdsg	2024-09-15 06:38:14.549173	310	7	16	523f3cf41c7
dfgbdvcbsddfsd	2024-09-15 06:38:16.758544	311	7	16	38eb5ff0b8f
sdfgsdgfsgsdgfds	2024-09-15 06:38:18.732454	312	7	16	d2471a41a24
hahaaha	2024-09-15 07:12:30.287768	313	13	16	1e9de7ed5f8
hahahahaha\n	2024-09-15 07:12:32.987617	314	13	16	f1d59846756
yrdy	2024-09-15 19:04:10.65072	317	7	1	774589bb6d9
sfgsdgfs	2024-09-15 19:04:14.786735	318	7	1	7f161a9170f
dfgsfgsd	2024-09-15 19:04:22.076557	319	7	1	a27a47b69d5
@adrianc68 safasfa	2024-09-15 19:04:24.385714	320	7	1	79c10c8b252
asdfasfdas	2024-09-15 19:04:35.811322	321	7	1	212cb99da47
@adrianc68 asfdasfdas	2024-09-15 19:04:38.582446	322	7	1	28ebf016e95
@adrianc68 sdfgdfg	2024-09-15 19:05:29.280567	323	7	1	997c2525b91
test	2024-09-15 19:34:36.844109	324	7	1	ed1e66d1b64
test	2024-09-16 06:17:01.652975	325	22	16	cd675ef29a9
@memero asdfasfdsa	2024-09-16 06:17:04.653098	326	22	16	2ae5a6d7724
@memero asdfasdfadsfa	2024-09-16 06:17:06.743871	327	22	16	10a35dc6b14
asdfdsafsafsaf 	2024-09-16 06:33:16.650681	328	1	1	088671e041e
 asdf sadfsa sff sadf sda sad sad fsd s fsda ds asfas	2024-09-16 06:33:21.071711	329	1	1	4c61b4f6f46
xd Tengo que arreglar esto	2024-09-16 06:41:09.531505	330	27	1	28a4865872e
No se supone que deberia haber pasado eso	2024-09-16 06:41:20.686588	331	27	1	f5b6a18418f
aaaaaa	2024-09-16 06:41:46.986426	332	28	1	26864e3591f
gjfjh	2024-09-16 06:56:32.193963	333	31	1	24c05c32751
sfgsg	2024-09-16 06:56:33.368097	334	31	1	af0964c5919
@adrianc68 sfgsdfgs	2024-09-16 06:56:38.475073	335	31	1	be74b36abb5
@adrianc68 sdgsdg	2024-09-16 06:56:40.085028	336	31	1	1df42f0206d
test	2024-09-16 07:04:17.529601	337	19	1	cae34728a8e
asdff	2024-09-16 07:05:10.486165	338	19	1	b8680356b31
asdfas	2024-09-16 07:10:00.730338	339	31	1	e0c63236f0b
@adrianc68 asdfsdafsa	2024-09-16 07:10:02.635669	340	31	1	521c476a678
asfdasdffd	2024-09-16 07:11:14.899703	341	1	16	35a079958e4
adfasfasdasfaf	2024-09-16 07:11:19.334863	342	1	16	f5614100d1c
afasda	2024-09-16 07:11:46.132679	343	1	16	fb41f544777
@memero asdfasfa	2024-09-16 07:11:48.839277	344	1	16	dffcee48851
@memero asdfasfasf	2024-09-16 07:11:51.584119	345	1	16	f2e9cd1ec9e
@memero asdfsadfasfasf	2024-09-16 07:11:53.960495	346	1	16	ed14371f2c8
@memero sdfgdsfgdsgds	2024-09-16 07:11:56.397165	347	1	16	cc910e91eb3
@memero dsfgsdgsdg	2024-09-16 07:11:57.987053	348	1	16	bfbe43cf729
@memero asdfsafsafsa	2024-09-16 07:12:00.041149	349	1	16	8284c929673
@memero asdfsafaf	2024-09-16 07:12:02.45576	350	1	16	675ab3db003
@memero asfdasfafa	2024-09-16 07:12:04.437813	351	1	16	a4138f4d82c
dfghdfghdfg	2024-09-16 07:12:50.118643	352	19	16	5f6e786120b
@memero dfghdfghdfh	2024-09-16 07:12:52.498929	353	19	16	db12c93b55d
dfghdfhdf	2024-09-16 07:12:54.377505	354	19	16	fa3126dcbb4
dfghfdh	2024-09-16 07:12:55.503301	355	19	16	17459b0a419
@memero dghdfghfd	2024-09-16 07:12:57.714999	356	19	16	0e08462c92d
@memero dfghdfh	2024-09-16 07:12:59.887006	357	19	16	140a271f184
dfghdfhdfhd	2024-09-16 07:13:02.182975	358	19	16	229dad3a926
sfgsg	2024-09-16 07:14:16.364967	359	15	14	72e2dc9f14d
@hola sfgdfsgsdg	2024-09-16 07:14:18.467811	360	15	14	91005b0ca00
drgwwg	2024-09-16 07:14:54.064608	361	15	14	1f6f1dde499
wergerwgwe	2024-09-16 07:14:55.990164	362	15	14	3b8167bc5f3
wregeg	2024-09-16 07:14:57.203845	363	15	14	0a7f5cfd3ce
gwg	2024-09-16 07:14:57.881324	364	15	14	09c05ab22ac
gw	2024-09-16 07:14:58.624314	365	15	14	79dd5e0327c
@hola wergeger	2024-09-16 07:15:00.510552	366	15	14	827cc4f4a02
wergewrgwe	2024-09-16 07:15:01.85042	367	15	14	6962c3dd174
asdfff	2024-09-16 07:15:04.830767	368	15	14	7e2c9c4a2c4
adfdgfsgdgsgdfsgdfsdgfs	2024-09-16 07:15:08.357901	369	15	14	a1786bb68bd
@mataleon asdfsafasdf	2024-09-19 06:19:26.111822	429	58	18	e0304c0e5fe
asdfasfs	2024-09-19 06:19:27.862178	430	58	18	91a0e9e5074
asdfasfsaddfasd	2024-09-19 06:19:30.924444	431	58	18	dabcd5f105b
@mataleon aaaaaa	2024-09-19 06:19:34.458646	432	58	18	9ce089deb5f
jajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajaj	2024-09-16 19:02:38.290292	371	27	16	9becf6dc50e
@memero jajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajaj	2024-09-16 19:02:41.172844	372	27	16	a3646ecf632
Esto es una preuba\n.\nDe sofwtare	2024-09-16 19:05:04.745725	373	37	16	0d469afe7dc
fsdfa	2024-09-16 19:09:47.826182	374	25	16	f75e2a2fc72
adsfasd\nASDFAS\n\nASFDASF\nAS\nDFASFAS\nFAS	2024-09-16 19:09:57.680331	375	23	16	02df3c6746f
ya funciono (Y)	2024-09-16 19:10:44.642608	376	27	16	46eef5fe3f0
asdFASDFSAD\n\n\nASDFASD\nFASF\nSADF\nASDFAS\n\n\n\n\n\nSADFSDAFAS\n\n\nSADFASDFASD\n\n\nCOMENTARIO CON SALTO DE LINEAS\n	2024-09-16 19:41:37.749215	377	7	1	bbac64fcf5f
Esto es una prueba\n\nPARA "\nSABER\n\nCUANTAS\n\nLINEAS\nDE\nSALTOP\nPUEDO\nENVIAR\nJAJAJA\n\nXD\nD\n\nXD\n	2024-09-16 19:44:10.941476	378	7	1	772318375b2
XD\n\n\nXD\n\n\nXD\n\nASDFAS\nDFA\nSDFA\n\n\n\n\n\n\nASDFAS\n	2024-09-16 19:44:55.498451	379	7	1	327ec1779b1
asdfsdafasf	2024-09-16 20:06:16.280814	380	7	1	20ba2e82d45
a	2024-09-16 20:06:21.709269	381	7	1	311878f2a41
a	2024-09-16 20:06:24.645637	382	7	1	3b12a8b4ab8
f	2024-09-16 20:06:28.534752	383	7	1	04d3d6abde0
b	2024-09-16 20:06:30.122344	384	7	1	0d6462ce61d
c	2024-09-16 20:06:31.952564	385	7	1	d954debb976
test	2024-09-16 20:08:07.317263	386	7	1	15eb122d8fd
ESto es una prueba\n.\nDe software para saber\n.\nSi puedo hacer este tipo de texto\n.\nen Parrafos	2024-09-16 20:12:42.054113	387	7	1	b15a4f14a34
ESto es una prueba\n\n.\n\nDe software para saber\n\n.\n\nSi puedo hacer este tipo de texto\n\n.\n\nen Parrafos	2024-09-16 20:13:07.525498	388	7	1	d88c3e14abc
gDXG\n\n\nVXCVZX\n	2024-09-16 20:19:40.215818	389	7	1	22d82143e3f
GDXG\n\n\n\nVZXCVZXC\nV\nXZXCV\nVZXC\nVZX\n\n\nZXCVZXCCV\nXV\nX\nVCZXV\n	2024-09-16 20:19:50.487038	390	7	1	bf64faf80c0
Esto es una prueba\n.\nPara \n.\n\n.SABER	2024-09-16 20:20:14.876274	391	7	1	de889276fee
ESto es una prueba\n\n.\n\nDe software para saber\n\n.\n\nSi puedo hacer este tipo de texto\n\n.\n\nen Parrafos\nA partir de este hay muchos mas parrafos\n\n\n\n\n\n\nEsto es mas de 5 o 6 break lineas\n\n\n\n\n\ntest	2024-09-16 20:29:47.027004	392	7	1	69924bbcdde
ESto es una prueba\n.\nPrueba	2024-09-16 20:32:48.134787	393	7	1	724912651ba
ESto es una prueba\n\n.\nPrueba	2024-09-16 20:33:03.578035	394	7	1	1ad77b16df7
Primer parrafo hablar sobre equis cosa\n.\nSegundo parrafo habla sobre equis 2 cosa\n.\nTercer parrafo habla sobre equis 3 cosa\n..\nDoble salto de linea a partir de aqui\n\n\n.\n\nTriple salto de linea a partir de aqui...\n\n\n\n.\n\n\n>	2024-09-16 20:36:07.637517	395	7	1	5fa63501e81
Esto es una porueba\n.\npara saber si hay salto de linea	2024-09-16 20:38:58.053202	396	42	1	e77c0bf652a
Esto es uan segunda prueba para saber si hay\n.\nSalto de linea\n.\nEn esta seccion\n>.\nxd	2024-09-16 20:39:20.59704	397	42	1	06a92939854
Esto es otra prueba\n\n\n.\n\n\n\n.\n\n\n. XD\n\nXD>\n\n\nXD>\n\n	2024-09-16 20:41:15.694673	398	42	1	550df101056
ESto\n.\nes\n.\nuna prueba\n.\ntest	2024-09-16 21:01:02.562587	399	49	1	9ddb5cac86d
@adrianc68 A poco si?\n.\nEsto es otra prueba\n.\n.\nTest	2024-09-16 21:01:36.878801	400	49	1	65d59683c1f
Viajeeeeee y disfruteeeeee\n./\nNo seeee si mas que otro cualquiera si biennnn..\n.\nTodoooo esto fueeeee\n....\n...\nA mi maneraaaaaaa\n.\nTal vez lorreeeee o tal vez reiiiiii\n....\nTal vezq ganeeeeee o tal vez te viiiiii\n.\nAhora seeeee que fui felizzz\nque si loreeeeee tambien ameeeeee\n.\nVoy a. seguirrrrrr hasta el finaaaaaal\n.\na mi maneraaaaaaaa	2024-09-16 21:06:31.783087	401	3	1	a78f105bb56
asdfas	2024-09-16 21:27:10.672422	402	7	1	86e557764a9
asdds	2024-09-16 21:27:53.664866	403	7	1	ac851654d1b
asfdfasfaf	2024-09-16 22:23:41.144244	404	7	1	4105bbee3e7
<script>alert("test")</script>\n	2024-09-16 22:47:40.414599	405	7	1	56bf0f92772
    <script>\n        // Función que muestra el mensaje al cargar la página\n        function showAlert() {\n            alert('Hola, mundo');\n        }\n        // Llamar a la función cuando la página se cargue\n        window.onload = showAlert;\n    </script>	2024-09-16 22:50:54.013937	406	7	1	110eb475e13
<h1>test</h1>	2024-09-16 22:51:42.716883	407	7	1	1fda8570440
<h1>XDDDD</h1>	2024-09-16 22:51:50.21517	408	7	1	62e0e3a0163
<h1> esto no deberia funcionar </h1>\n	2024-09-17 01:59:36.166376	409	27	1	d34c396c4c7
<script>alert("hello")</script>	2024-09-17 01:59:56.671633	410	27	1	5647d25cde6
Esto es un salto de linea\n.\nEsto es salto de linea	2024-09-17 02:07:30.334197	411	27	1	0c8fe035d35
Holaaa.\n>\nSalto de linea\n>	2024-09-17 02:09:32.694771	412	27	1	cc3767195a6
<script>alert("Take me on")</script>\n<h1> Testing </h1> \nJeje 	2024-09-17 02:16:00.310804	413	12	16	5664c7fbb79
@memero <script>alert("Take me on")</script>\n<h1> Testing </h1> \nJeje 	2024-09-17 02:16:02.821859	414	12	16	98f119713c7
@adrianc68 Ahuevo man	2024-09-17 05:18:32.037623	415	3	16	a4b862b27a5
@memero La de vicente fernandez\n	2024-09-17 05:18:37.57934	416	3	16	ad83e62612d
asdfsdadfs	2024-09-19 04:54:24.420697	417	15	16	57419306a92
adfjadlkfdj	2024-09-19 04:54:28.204899	418	15	16	c1db4ebc6f1
alkdsjfaslkfdasjk\nasdlfkdsa\n.\naskdfdaslfkjas	2024-09-19 04:54:35.881528	419	15	16	800a78c6a7c
<script>alert("test")</script>	2024-09-19 04:54:49.194546	420	15	16	6eeb51a30cb
@memero <script>alert("test")</script>	2024-09-19 04:54:57.699208	421	15	16	49210400ed4
sdfafdsf	2024-09-19 06:18:58.492481	422	58	18	70f1629e090
fasdfsadfasfd	2024-09-19 06:19:01.293877	423	58	18	55cde6a11ba
afsdasdfsaddfasdd	2024-09-19 06:19:02.790442	424	58	18	ec8eb9fb432
asfdasfadsfas	2024-09-19 06:19:03.945029	425	58	18	f3b98b2e4e8
@mataleon asdfsafasfas	2024-09-19 06:19:15.057985	426	58	18	3b87d0aa69b
@mataleon asdfasfs	2024-09-19 06:19:17.143923	427	58	18	4511191fa3c
@mataleon asdfsafsadf	2024-09-19 06:19:21.166795	428	58	18	1d172855465
@mataleon bbbbbb	2024-09-19 06:19:36.888635	433	58	18	dc3710056f2
@mataleon cccccc	2024-09-19 06:19:39.88114	434	58	18	a3bfcfe86ba
@mataleon dddddd	2024-09-19 06:19:42.407814	435	58	18	7534fd3379f
@mataleon eeeeee	2024-09-19 06:19:44.560464	436	58	18	7874e258bae
@mataleon fffff	2024-09-19 06:19:47.235871	437	58	18	1921675a372
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dignissim semper eros sed vestibulum. Cras eu lorem vitae ex imperdiet sagittis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi semper condimentum convallis. Maecenas malesuada leo elit, vitae rhoncus est dictum malesuada. Mauris id purus mi. Nam venenatis, leo in bibendum molestie, urna enim interdum ex, ut ornare tellus nulla ac purus. Quisque porttitor fermentum eros, quis consequat lorem. Duis eu efficitur nulla, nec pellentesque elit. Duis tincidunt sed orci eget volutpat. Sed vel faucibus mauris, id aliquet sapien. Integer vitae sollicitudin sapien. Curabitur in consectetur eros. Sed vulputate gravida convallis.\nCras porta viverra mauris non euismod. Sed imperdiet nisi in porta pellentesque. Quisque commodo sapien nulla, ut fringilla nibh fringilla vel. Duis ultrices rutrum urna eu hendrerit. Pellentesque sapien nisl, luctus sit amet vulputate eu, porta in massa. Etiam iaculis dui eu scelerisque ultricies. Quisque quis tellus ut elit ultricies ornare. Curabitur ut metus congue, accumsan risus vitae, pellentesque arcu.\nProin id justo vel ex consequat volutpat. In eget erat sit amet lacus finibus feugiat. Curabitur eu ultrices eros, sed hendrerit sapien. Aenean non elementum sapien, ut tristique enim. Cras fermentum convallis sapien non venenatis. Nullam luctus pulvinar odio a convallis. Nullam in bibendum metus. Vestibulum et lacinia ante. Donec massa justo, ornare lobortis consequat ut, fringilla feugiat diam. Sed commodo urna eu ultrices porttitor. Phasellus quis risus convallis, porttitor metus non, luctus risus. Nam mattis, tortor dapibus lobortis porta, ipsum ligula luctus purus, ut dapibus sem tellus vitae dui. Etiam blandit magna at mi consequat posuere. Suspendisse congue consectetur elit, eget suscipit risus convallis quis.	2024-09-19 06:29:04.558377	438	33	14	55fe1a192a6
asdfasf	2024-09-19 19:20:10.320042	439	42	18	341ac307b1d
xdddd	2024-09-19 19:20:12.48894	440	42	18	664ef9506eb
fdfdfdfd	2024-09-19 19:20:25.417083	441	58	18	ab08f645fe8
&gttest&lg	2024-09-19 19:25:32.82282	442	59	18	040ee95ea7b
&tghola&lgtest	2024-09-19 19:25:43.146023	443	59	18	2e1508bfa0a
\.


--
-- Data for Name: CommentLike; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."CommentLike" (id_comment, id_user, liked_at) FROM stdin;
241	13	2024-09-19 18:24:15.254826
240	13	2024-09-19 18:24:15.254826
239	13	2024-09-19 18:24:15.254826
242	13	2024-09-19 18:24:15.254826
218	13	2024-09-19 18:24:15.254826
217	13	2024-09-19 18:24:15.254826
217	1	2024-09-19 18:24:15.254826
218	1	2024-09-19 18:24:15.254826
219	1	2024-09-19 18:24:15.254826
220	1	2024-09-19 18:24:15.254826
221	1	2024-09-19 18:24:15.254826
222	1	2024-09-19 18:24:15.254826
248	1	2024-09-19 18:24:15.254826
249	1	2024-09-19 18:24:15.254826
250	1	2024-09-19 18:24:15.254826
256	1	2024-09-19 18:24:15.254826
255	1	2024-09-19 18:24:15.254826
255	13	2024-09-19 18:24:15.254826
257	13	2024-09-19 18:24:15.254826
258	13	2024-09-19 18:24:15.254826
259	13	2024-09-19 18:24:15.254826
260	13	2024-09-19 18:24:15.254826
261	1	2024-09-19 18:24:15.254826
271	1	2024-09-19 18:24:15.254826
270	1	2024-09-19 18:24:15.254826
263	1	2024-09-19 18:24:15.254826
266	1	2024-09-19 18:24:15.254826
265	1	2024-09-19 18:24:15.254826
273	1	2024-09-19 18:24:15.254826
262	1	2024-09-19 18:24:15.254826
257	1	2024-09-19 18:24:15.254826
270	14	2024-09-19 18:24:15.254826
271	14	2024-09-19 18:24:15.254826
255	14	2024-09-19 18:24:15.254826
257	14	2024-09-19 18:24:15.254826
258	14	2024-09-19 18:24:15.254826
259	14	2024-09-19 18:24:15.254826
274	1	2024-09-19 18:24:15.254826
258	1	2024-09-19 18:24:15.254826
259	1	2024-09-19 18:24:15.254826
227	1	2024-09-19 18:24:15.254826
230	1	2024-09-19 18:24:15.254826
232	1	2024-09-19 18:24:15.254826
290	1	2024-09-19 18:24:15.254826
291	1	2024-09-19 18:24:15.254826
260	1	2024-09-19 18:24:15.254826
284	1	2024-09-19 18:24:15.254826
292	1	2024-09-19 18:24:15.254826
295	1	2024-09-19 18:24:15.254826
305	1	2024-09-19 18:24:15.254826
304	1	2024-09-19 18:24:15.254826
308	1	2024-09-19 18:24:15.254826
309	1	2024-09-19 18:24:15.254826
310	1	2024-09-19 18:24:15.254826
313	16	2024-09-19 18:24:15.254826
255	17	2024-09-19 18:24:15.254826
257	17	2024-09-19 18:24:15.254826
258	17	2024-09-19 18:24:15.254826
259	17	2024-09-19 18:24:15.254826
260	17	2024-09-19 18:24:15.254826
312	1	2024-09-19 18:24:15.254826
314	16	2024-09-19 18:24:15.254826
328	1	2024-09-19 18:24:15.254826
329	1	2024-09-19 18:24:15.254826
350	16	2024-09-19 18:24:15.254826
349	16	2024-09-19 18:24:15.254826
351	16	2024-09-19 18:24:15.254826
348	16	2024-09-19 18:24:15.254826
347	16	2024-09-19 18:24:15.254826
263	16	2024-09-19 18:24:15.254826
271	16	2024-09-19 18:24:15.254826
264	16	2024-09-19 18:24:15.254826
337	16	2024-09-19 18:24:15.254826
359	14	2024-09-19 18:24:15.254826
360	14	2024-09-19 18:24:15.254826
395	1	2024-09-19 18:24:15.254826
404	1	2024-09-19 18:24:15.254826
378	1	2024-09-19 18:24:15.254826
392	1	2024-09-19 18:24:15.254826
409	1	2024-09-19 18:24:15.254826
401	16	2024-09-19 18:24:15.254826
420	16	2024-09-19 18:24:15.254826
438	14	2024-09-19 18:24:15.254826
436	18	2024-09-19 19:20:23.219702
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
1	2	ACEPTADO
2	1	ACEPTADO
14	13	ACEPTADO
14	1	ACEPTADO
1	7	ACEPTADO
1	3	ACEPTADO
16	1	ACEPTADO
1	14	ACEPTADO
14	2	ACEPTADO
14	17	ACEPTADO
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
16	fea7b2a4-8553-4516-b253-affbeb6084d7	test	2024-09-20 00:19:42.329274	TEXTO	1	ENVIADO	\N	\N	\N
17	3ae1c022-26aa-4890-8f79-a5b2a86ff54c	test	2024-09-20 00:20:50.801995	TEXTO	1	ENVIADO	\N	\N	\N
18	3d1ca517-d55a-4dc9-970f-128b4890d65c	test	2024-09-20 00:21:46.591157	TEXTO	1	ENVIADO	\N	\N	\N
19	81c48035-3be2-43aa-9074-7b24090a29c1	test	2024-09-20 00:22:28.967916	TEXTO	1	ENVIADO	\N	\N	\N
20	49d3d59c-491a-41a1-a778-9ae37db5bb74	test	2024-09-20 00:22:49.504866	TEXTO	1	ENVIADO	\N	\N	\N
21	e7a78d18-dda2-4f41-b85c-5c51c26df69f	test	2024-09-20 00:27:14.102274	TEXTO	1	ENVIADO	\N	\N	\N
22	f54eafe5-f8c3-4963-a86f-40ca00847143	test	2024-09-20 00:29:37.48035	TEXTO	1	ENVIADO	\N	\N	\N
23	ab6fbce6-c477-4427-b75f-81c411701a3f	test	2024-09-20 00:38:05.457258	TEXTO	1	ENVIADO	\N	\N	\N
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
217	218
217	219
217	220
217	221
217	222
223	224
223	225
226	229
227	230
228	231
227	232
227	233
227	234
227	235
228	236
228	237
228	238
228	239
228	240
228	241
227	243
242	244
242	245
217	248
217	249
217	250
223	251
226	252
227	253
226	254
255	257
255	258
255	259
255	260
263	270
263	271
264	272
265	275
266	276
264	277
255	278
255	279
274	281
274	283
274	284
274	285
227	289
227	290
292	298
299	300
299	301
299	302
299	303
318	320
319	322
318	323
325	326
325	327
333	335
334	336
339	340
343	344
343	345
343	346
343	347
343	348
343	349
343	350
343	351
352	353
354	356
354	357
359	360
364	366
364	368
364	369
371	372
377	378
377	379
399	400
395	404
413	414
401	415
401	416
420	421
422	426
423	427
422	428
422	429
430	432
430	433
430	434
430	435
430	436
430	437
\.


--
-- Data for Name: Personal; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Personal" (gender, id_user, id_career) FROM stdin;
INDIFERENTE	2	\N
INDIFERENTE	3	\N
INDIFERENTE	4	\N
INDIFERENTE	5	\N
INDIFERENTE	6	\N
INDIFERENTE	7	\N
INDIFERENTE	8	\N
INDIFERENTE	9	\N
INDIFERENTE	10	\N
INDIFERENTE	11	\N
INDIFERENTE	12	\N
INDIFERENTE	13	\N
INDIFERENTE	14	\N
INDIFERENTE	15	\N
INDIFERENTE	16	\N
INDIFERENTE	17	\N
MASCULINO	1	\N
INDIFERENTE	18	\N
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Post" (description, comments_allowed, likes_allowed, id_user, id, uuid, created_time) FROM stdin;
Primer post jajaja	t	t	1	1	d126a133f4247359	2024-09-19 04:58:23.303651
Segundo post jajaja	t	t	1	2	44fdc6520f064983	2024-09-19 04:58:23.303651
post jajaja	t	t	1	3	0228a7e9dd8501a1	2024-09-19 04:58:23.303651
post jajaja	t	t	1	4	f8c59d7c24ba0b42	2024-09-19 04:58:23.303651
post jajaja	t	t	1	5	d27f31476921d559	2024-09-19 04:58:23.303651
post jajaja	t	t	1	6	c5cc45e2feeff23a	2024-09-19 04:58:23.303651
post jajaja	t	t	1	7	21daa81d193a962b	2024-09-19 04:58:23.303651
post jajaja	t	t	1	8	cdca6c957136a063	2024-09-19 04:58:23.303651
post jajaja	t	t	1	9	4e2499425bb6a8a6	2024-09-19 04:58:23.303651
Este es un post de otro usuiario	t	t	16	10	23988dd56012310f	2024-09-19 04:58:23.303651
Este es un post de otro usuiario	t	t	16	11	2429d0220750d544	2024-09-19 04:58:23.303651
Este es un post de otro usuiario	t	t	16	12	b18f154795309217	2024-09-19 04:58:23.303651
Este es un post de otro usuiario	t	t	16	13	36c3d4200ffe5277	2024-09-19 04:58:23.303651
Este es un post de otro usuiario	t	t	1	14	ff3209abf38dfb54	2024-09-19 04:58:23.303651
Este es un post de otro usuiario	t	t	14	15	623d5cd93eb7999d	2024-09-19 04:58:23.303651
Este es un post de otro usuiario	t	t	13	16	295985f46c6091d8	2024-09-19 04:58:23.303651
Este es un post de otro usuiario	t	t	1	17	25c753f51c3e823d	2024-09-19 04:58:23.303651
	f	f	1	18	1dc911b61b29ce4c	2024-09-19 04:58:23.303651
asd asd asda das dasdas dasdas	f	f	1	19	1fecf2d92b521657	2024-09-19 04:58:23.303651
asdfasdfasfas	f	f	1	20	3b6ce3c99bdaa8cc	2024-09-19 04:58:23.303651
Inicial mente eran 3 imagenes pero quite dos la del ojo y la del fbi la azul y deje la de Dead by Daylight y tiene 129 caracteres	f	f	1	21	2b7354424ae07132	2024-09-19 04:58:23.303651
eran 4 imagenes pero elimine 3	f	f	16	22	ffd60fa6e33ae8a7	2024-09-19 04:58:23.303651
zazazazaaz	f	f	16	23	74ddef60983234f8	2024-09-19 04:58:23.303651
sfadadfsafsd	f	f	16	24	93fbd060cdf271e6	2024-09-19 04:58:23.303651
adfsdsfasf	f	f	16	25	75b4af4879a17581	2024-09-19 04:58:23.303651
hahahahahahaha hahaha ha ha haha ha ha ha hahahhahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahahahahahahahaha hahaha ha ha haha ha ha ha hahahaa	f	f	1	26	707ff8097eb0caec	2024-09-19 04:58:23.303651
jajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajajjajaj	f	f	1	27	c9d84dd9cab23942	2024-09-19 04:58:23.303651
	f	f	1	28	096f84788fa63b12	2024-09-19 04:58:23.303651
aaaaaaa	f	f	1	29	d8db5c0fdd16c2ba	2024-09-19 04:58:23.303651
	f	f	1	30	fb475fdbeb2063b8	2024-09-19 04:58:23.303651
	f	f	1	31	02c1adcfbee50504	2024-09-19 04:58:23.303651
fb8fb8fb8fb8fb8	f	f	1	32	46d8078757581da7	2024-09-19 04:58:23.303651
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rutrum magna a lorem pretium, in tempus ex accumsan. Ut aliquet volutpat nulla ac hendrerit. Maecenas venenatis, augue sed mollis semper, diam ipsum cursus turpis, ut posuere lectus orci quis justo. Vivamus eget fringilla libero, id commodo dolor. Praesent sit amet risus sed ipsum cursus consectetur. Cras et felis neque. Sed interdum dictum augue, at fringilla dui varius ut. Mauris convallis, turpis quis elementum hendrerit, leo orci sagittis purus, nec ornare nunc nisi in neque.\n\nFusce ultrices mattis bibendum. Vestibulum vel imperdiet turpis. Nullam venenatis, ligula ac dignissim consequat, massa mauris ornare nulla, at molestie dolor leo et risus. Sed ac fermentum erat. Vestibulum rutrum pretium hendrerit. Donec sollicitudin turpis eget sapien consequat volutpat. Donec ut lorem risus. Etiam commodo nisi vitae mi interdum, eget vestibulum mi gravida. Vestibulum interdum varius sapien.\n\nAenean suscipit vitae enim quis ultrices. Aenean aliquam nisi sed lobortis fringilla. Curabitur laoreet egestas lectus id finibus. Etiam cursus orci nec elit pretium, vel ultricies lorem rhoncus. Nam eu ipsum neque. Donec eu turpis pharetra, pellentesque diam pulvinar, feugiat ipsum. Pellentesque augue est, pellentesque ac lacinia id, vestibulum nec odio. Vestibulum non odio at augue ultrices tempus vel non elit. Cras hendrerit mollis ullamcorper. Donec vel condimentum massa. Ut non enim finibus, laoreet tortor non, commodo dui. Proin eu placerat eros, sed viverra libero. Morbi dui risus, vulputate quis dapibus non, ultricies in dui. Pellentesque luctus diam in urna sollicitudin, sit amet suscipit tortor lacinia. Integer placerat velit eget tempus dignissim.\n\nFusce interdum, quam a convallis tristique, nisl sapien viverra nisl, ut bibendum tortor sem sit amet arcu. Proin fermentum ipsum eget gravida fringilla. In vel viverra diam. Ut imperdiet, turpis maximus hendrerit sum, libero in curs	f	f	14	33	c62e0ef6b806fd65	2024-09-19 04:58:23.303651
	f	f	14	34	dcda409ebc582031	2024-09-19 04:58:23.303651
asdasdasdasdas	f	f	16	35	061be86e55ef194e	2024-09-19 04:58:23.303651
dsasdfasddsasdfasddsasdfasddsasdfasddsasdfasddsasdfasddsasdfasddsasdfasddsasdfasddsasdfasd	f	f	16	36	0106755fcf2af703	2024-09-19 04:58:23.303651
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus lorem sit amet dolor tristique, tempor molestie sem fringilla. Morbi ullamcorper lorem id ligula congue ultrices. Maecenas venenatis venenatis ante ac aliquet. Pellentesque nisi ligula, facilisis eget ultricies sed, fermentum mollis ipsum. Sed in magna at ex dapibus lacinia at vel quam. Etiam sit amet convallis urna, eget eleifend tortor. Vestibulum metus orci, gravida vitae elementum volutpat, sodales in urna. Duis id tortor tellus. Mauris eu dui laoreet, fermentum ex ut, iaculis turpis. Vestibulum ullamcorper sagittis orci, sit amet pharetra leo sodales ut. Curabitur viverra est diam, at tempus turpis accumsan id. Fusce sed quam in ligula fermentum tristique in quis nibh.\n\nPraesent bibendum nisi eu massa vestibulum, quis condimentum risus tempor. Vivamus egestas in diam in porttitor. Suspendisse tincidunt euismod nisi, vel pellentesque nulla tincidunt ut. Nam vestibulum convallis sagittis. Proin auctor sem non leo sodales, ut porta ex molestie. Proin vel leo non lorem egestas pretium. Donec molestie semper efficitur. Duis aliquet, est a dapibus maximus, enim felis fermentum ante, non consequat arcu nisl sed libero.\n\nCras elit ipsum, ultricies eget odio at, sodales scelerisque diam. Donec placerat accumsan semper. Etiam faucibus turpis magna, et feugiat lectus consequat ut. Nam viverra arcu vitae lectus laoreet, maximus rutrum justo dapibus. Pellentesque hendrerit nulla at eros pulvinar, a aliquet sem accumsan. Suspendisse vitae diam risus. Ut rhoncus nisi sapien, ac ultrices justo gravida eget. Proin eget aliquam libero.\n\nSuspendisse potenti. Integer dictum mauris mattis mauris ornare, sit amet consequat sapien euismod. Maecenas consequat justo eget eros tincidunt, sed viverra ligula vestibulum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum sed pellentesque purus. In at nulla eget elit vestibulum consectetur a ac est. 	f	f	16	37	7b438ac3a5548e65	2024-09-19 04:58:23.303651
Este es un post de otro usuiario\nopeasdfkj\nasdfasfasf\n	t	t	1	38	49d678e6eb923ab9	2024-09-19 04:58:23.303651
Lorep Ipsum\n\nTESTING\n\n\nBR\n\nSALTO DE L\nIN\nE\n\n\nAS\n	t	t	1	39	1c86dd00fcba0395	2024-09-19 04:58:23.303651
	f	f	1	40	cf5ab7917a8cd9d3	2024-09-19 04:58:23.303651
	f	f	1	41	797c0203125d0bc1	2024-09-19 04:58:23.303651
Primer parrafo hablar sobre equis cosa\n.\nSegundo parrafo habla sobre equis 2 cosa\n.\nTercer parrafo habla sobre equis 3 cosa\n..\nDoble salto de linea a partir de aqui\n.\nTriple salto de linea a partir de aqui...\n.\n>	t	t	1	42	137e826a4bceb1f1	2024-09-19 04:58:23.303651
fsadf\nSDAF\nASDF\nSADF\n\n\n\nSADFAS\n\n\n\nSADFASDF\nAS\n\nSADFSfas	f	f	1	43	7de7fa15b00937cf	2024-09-19 04:58:23.303651
sASDF \nA\nSDF\nASDFSA\nD\n\n\n\n\nA\n\n\nA\n\n\nASDF\nS\n\n\n\nSADF\nA\nA\n.\n.	f	f	1	44	b804d414f37ec737	2024-09-19 04:58:23.303651
H\nO\nL\nA\n\nE\nS\nT\nO\n\nES\nES\nUNA\nPRUIEBA	f	f	1	45	12a2c7594712a376	2024-09-19 04:58:23.303651
VIEJA\nCONCHE\n\nSU\nMADRE\n\nJAJAJA\n\nARRIBA\nBRAZILEIRO	f	f	1	46	4131fe1993e1426e	2024-09-19 04:58:23.303651
Vieja\n\nCONSESAUMA\nESTO \n\nES BRAZIL\nARRIBA BRAZILL\nLEIRODOOOO	f	f	1	47	6203662ec6ec34d2	2024-09-19 04:58:23.303651
ESTO\nES\nBRAZIL\nARRIBA\nLA\nPORRA\nTE\nSALUDA\nXD\nXDDXC\nASD\nFAS\nFSDF\nAS\nF	f	f	1	48	3d7002b9ab317fb4	2024-09-19 04:58:23.303651
ESTO\n.\nES la mejor ayuda\n.\nQue te puede ofrecer jajaja gracias\n.\nAdios Perros	f	f	1	49	a8bca82e205c7534	2024-09-19 04:58:23.303651
Lo mejor de lo mejor pinches putos	f	f	1	50	25a5ab47dcc40af5	2024-09-19 04:58:23.303651
Primer parrafo hablar sobre equis cosa\n.\nSegundo parrafo habla sobre equis 2 cosa\n.\nTercer parrafo habla sobre equis 3 cosa\n..\nDoble salto de linea a partir de aqui\n.\nTriple salto de linea a partir de aqui...\n.\n>	t	t	1	51	9bd391a353976da0	2024-09-19 04:58:23.303651
LOS COMENTARIOS SON VULNERABLES A XSS POR FAVOR DE VERIFICAR Y VALIDAR ESOS COMENTARIOS	f	f	1	52	9beb1d316608833c	2024-09-19 04:58:23.303651
<script>alert("Take me on")</script>\n<h1> Testing </h1> \nJeje 	f	f	16	53	e335e2b7200c1aec	2024-09-19 04:58:23.303651
Say\nAfter\nme\nBefore I go\n.\nTest\n<script>alert("Take me on")</script>\n<h1> Testing </h1> \nJeje \n.\nSalto de linea	f	f	16	54	83a20ac15a18106c	2024-09-19 04:58:23.303651
Primera imagen jajaja	f	f	18	55	9894b6e5cfa61552	2024-09-19 05:54:01.36115
Viendo como matar a la vieja chsm	f	f	18	56	356768b67ff6bfbc	2024-09-19 05:54:21.277547
tercera foto pesando el alma le llamo yo	f	f	18	57	3b1cb0ccaccc4497	2024-09-19 05:54:47.983549
cuarta foto jajaja ya quedo invalida	f	f	18	58	db9cc14162815912	2024-09-19 05:58:27.879193
quinta — la perra es feliz por matar gente	f	f	18	59	2fd3594828543cf2	2024-09-19 05:58:51.269269
hahahah sexta	f	f	18	60	5276dbe36a15a1dc	2024-09-19 06:10:32.546156
\.


--
-- Data for Name: PostFile; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."PostFile" (filename, id_post) FROM stdin;
1/1/93ddee095834157f.jpg	1
1/1/b8c0e3d759074758.jpg	1
1/1/3bbbc145e02f2eaf.jpg	2
1/1/cab2179c99fb6d85.jpg	2
1/1/237eb8d2415fb06f.jpg	3
1/1/ec67b560d2ee0a74.jpg	4
1/1/40decfa13f5a76e2.jpg	5
1/1/5948a206798eb06f.jpg	6
1/1/1ad6dd30a399f5f1.jpg	6
1/1/b01b6216fb977dab.jpg	6
1/1/95da63a6ae02cdfd.jpg	6
1/1/d8558170d7790002.jpg	6
1/1/6fa4575f14c7ffd2.jpg	7
1/1/5146ca1d889885a8.jpg	7
1/1/cdd42f4ca44c9117.jpg	7
1/1/e71ee54cd601eba5.jpg	7
1/1/54008a0a55aff655.jpg	7
1/1/5132d3ec9f0aa314.jpg	7
1/1/090ad25f1c7d7336.jpg	8
1/1/315d3b1373ed1625.jpg	9
16/1/b03835fddf45c231.jpg	10
16/1/90aa6e2b17835ebb.jpg	11
16/1/6057d23116e0fbd2.jpg	12
16/1/7b61b8487c3a7431.jpg	13
16/1/e5be39e746f133a4.jpg	13
16/1/deec09ed7ef6b6ce.jpg	13
16/1/1c7443368c561252.jpg	13
16/1/adfb0d83dda1c549.jpg	13
16/1/91d236236243bdbd.jpg	13
16/1/61cb11f49c95f246.jpg	13
1/1/938301bc90a7c9db.jpg	14
1/1/c516af2f70dc282a.jpg	14
1/1/cb0cba66049ff8f0.jpg	14
1/1/4f0ec3a36d2af77d.jpg	14
1/1/8757e1561d2dae62.jpg	14
1/1/c742328cef4baf16.jpg	14
1/1/85c431451ff37a95.jpg	14
14/1/8b655a7a9f9e685e.jpg	15
14/1/4964d58c256e8f56.jpg	15
14/1/5ea978cfb3ee723f.jpg	15
14/1/ec5e7789e81e6070.jpg	15
14/1/c843c0c7f2f62ef1.jpg	15
14/1/fd8249ec09fd556a.jpg	15
14/1/1b288367ad9d4d61.jpg	15
13/1/cb97bb4c2ba2b32f.jpg	16
13/1/2045c7596b1beb49.jpg	16
13/1/84d0f167039449db.jpg	16
13/1/c8e1c12e79338917.jpg	16
13/1/069c47fb9f93bb07.jpg	16
13/1/c2b268bad221a0de.jpg	16
13/1/3269e554aef6fd56.jpg	16
1/1/1a3042981a3c5402.jpg	17
1/1/2d9e1a0f32f657f4.jpg	18
1/1/9785fb5122898c7d.jpg	18
1/1/c32b9d8780184cec.jpg	19
1/1/506b8f0bf2097c3d.jpg	19
1/1/e159b4f94e5fa098.jpg	19
1/1/10a82a72b64133aa.jpg	19
1/1/609b653ac389630a.jpg	19
1/1/cc33d9cd55c241a7.jpg	20
1/1/bb802971f0fe016b.jpg	21
16/1/2b9776e245560336.jpg	22
16/1/c9cb604e2da8faba.jpg	23
16/1/1ee6e85a876f3a47.jpg	23
16/1/236f321fbf1cb6d2.jpg	23
16/1/d405ca21ebb8cea5.jpg	23
16/1/afca9d9b77916ca2.jpg	23
16/1/948e92e21f213aa5.jpg	24
16/1/8f1ada282b6ed8b8.jpg	24
16/1/61fc834519493d9b.jpg	24
16/1/eb6b575cad0ca37c.jpg	24
16/1/352ec17bcf668183.jpg	25
1/1/f322248cf780844f.jpg	26
1/1/98b85a331b3a1d20.jpg	26
1/1/9aa49290c6744724.jpg	26
1/1/4a680db384293416.jpg	26
1/1/0efd9914331ae7ae.jpg	26
1/1/8f17f48b3a41271e.jpg	26
1/1/025d2d6c11a8882c.jpg	27
1/1/352c00ce1ed0d57b.jpg	28
1/1/2a5aa7c77b75e51b.jpg	29
1/1/95531be294eb73e9.jpg	30
1/1/e9d24e7f4642711f.jpg	31
1/1/80ab0bbf9f5fea5a.jpg	32
14/1/b6e7c778fc6ad339.jpg	33
14/1/c79c86ef411211fd.jpg	34
14/1/d786b65102130f6b.jpg	34
14/1/c53c176236e37970.jpg	34
14/1/a87d137b819291d2.jpg	34
14/1/207c497fd3521e1a.jpg	34
14/1/828509869c8104b7.jpg	34
14/1/e560e40c6938ca1f.jpg	34
16/1/ac7710b1f9e484da.jpg	35
16/1/bb3d86db32835bf1.jpg	35
16/1/63c8428a7702ee5b.jpg	35
16/1/99f2e3fc30a2c856.jpg	35
16/1/9fdc819a72048a24.jpg	36
16/1/8de37e20d90476e4.jpg	36
16/1/047366b6f3efde3e.jpg	36
16/1/161fc2cc62fd9099.jpg	36
16/1/846a26aa3073b0db.jpg	36
16/1/ca7b29a7be5c0010.jpg	37
1/1/0d14c16ff0b76a88.jpg	38
1/1/d705d9c6ec82759b.jpg	39
1/1/fca257719253930e.jpg	40
1/1/c776e793b95c4c48.jpg	41
1/1/e668e3ace202b19c.png	42
1/1/2f24d74c5abe0c0c.jpg	43
1/1/42f6d19a56660789.jpg	44
1/1/b4850b37886feb6c.png	45
1/1/f294193464b58d11.jpg	46
1/1/3d7c5f195e79c1a5.jpg	47
1/1/0e4afc5b3810152e.jpg	48
1/1/22abf85126ac06ef.png	49
1/1/426047fcbd9e41a2.png	50
1/1/29dc843efa6ae431.png	51
1/1/bd0cb4511930fc24.png	52
16/1/18b1bd99449eb39c.jpg	53
16/1/e295be10b8eebd4f.jpg	54
18/1/ece01edaa1ae9e0a.jpg	55
18/1/4508a36fd45d3c3d.jpg	56
18/1/0da3ed8e8cb4b565.jpg	57
18/1/c93c44595841a730.jpg	58
18/1/b4723de13fd9de1e.jpg	59
18/1/9aa0b295ec76a306.jpg	60
18/1/a78114ac872b7a8c.jpg	60
18/1/d7d6dbd5e918451f.jpg	60
18/1/09bad0c5ab761878.jpg	60
18/1/69c07aedb1187bf7.jpg	60
\.


--
-- Data for Name: PostLike; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."PostLike" (id_user, id_post, liked_at) FROM stdin;
1	1	2024-09-19 18:25:03.741503
1	6	2024-09-19 18:25:03.741503
13	3	2024-09-19 18:25:03.741503
13	7	2024-09-19 18:25:03.741503
14	7	2024-09-19 18:25:03.741503
1	8	2024-09-19 18:25:03.741503
1	3	2024-09-19 18:25:03.741503
1	7	2024-09-19 18:25:03.741503
16	7	2024-09-19 18:25:03.741503
16	13	2024-09-19 18:25:03.741503
1	15	2024-09-19 18:25:03.741503
16	22	2024-09-19 18:25:03.741503
16	23	2024-09-19 18:25:03.741503
16	25	2024-09-19 18:25:03.741503
1	26	2024-09-19 18:25:03.741503
1	29	2024-09-19 18:25:03.741503
1	27	2024-09-19 18:25:03.741503
1	31	2024-09-19 18:25:03.741503
1	14	2024-09-19 18:25:03.741503
16	1	2024-09-19 18:25:03.741503
16	19	2024-09-19 18:25:03.741503
14	15	2024-09-19 18:25:03.741503
14	33	2024-09-19 18:25:03.741503
16	24	2024-09-19 18:25:03.741503
16	37	2024-09-19 18:25:03.741503
18	58	2024-09-19 18:25:03.741503
1	60	2024-09-19 18:25:03.741503
18	42	2024-09-19 19:20:13.08738
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
1	aa3ae97a-5b6d-4afe-9532-cc45f0485e64	2024-05-02 06:49:02.765729	localhost:8080
10	0df8e19b-fb48-43a2-a0a8-a76cb42f89ad	2024-05-02 06:51:46.12342	localhost:8080
1	8d07931c-ff0a-4ab7-a799-e38002669315	2024-05-09 16:48:23.043789	localhost:8080
1	ae7ee0af-7845-4f98-a6a8-3bd522a98273	2024-09-05 05:34:50.298167	localhost:8080
1	61fefa0f-3953-4a42-b5f4-c60ef81d6fae	2024-09-05 19:37:04.899386	localhost:8080
2	727b062f-e42d-477b-b49a-6a234445050a	2024-09-06 20:15:38.04831	localhost:8080
1	a1e8511c-7848-443e-8433-5615b2a8da6c	2024-09-06 20:49:34.150746	localhost:8080
1	0b2107a5-4c3b-40d3-8f84-c348974ce751	2024-09-06 21:08:14.547873	localhost:8080
2	02946750-3d37-4957-8668-203810785c15	2024-09-06 23:15:20.901522	localhost:8080
2	71ba13b1-dfa6-40dc-8f9c-56cbc0d20233	2024-09-07 03:50:22.775344	localhost:8080
2	5d884cfc-b31d-4f57-b4c7-cf397181e7f3	2024-09-07 06:07:19.354053	localhost:8080
2	f3114f50-b050-4814-991e-a7689452c2e9	2024-09-07 07:01:09.595036	localhost:8080
1	8aa05bce-9b18-4833-8c88-02da2909934a	2024-09-07 07:01:46.294096	localhost:8080
1	9fd5fa8b-5428-4857-a520-26ee500857ef	2024-09-08 04:45:39.565523	localhost:8080
13	3d63fe77-6fa9-4feb-a831-012a5eaa026d	2024-09-08 05:35:45.387377	localhost:8080
1	1497e5be-b7b2-4097-827f-5bce0ef7cb73	2024-09-10 21:28:21.714663	localhost:8080
13	292b29a1-4af4-46f8-af07-043da3b444b8	2024-09-10 22:23:59.899428	localhost:8080
13	16cfc765-42da-4a34-87dc-38602bd41769	2024-09-10 23:13:17.281005	localhost:8080
14	98958322-7147-4757-b271-b4443a1aff8a	2024-09-11 03:19:47.616177	localhost:8080
1	5dab30da-0446-4d90-aaf9-2c026c828626	2024-09-11 05:54:56.955456	localhost:8080
1	4ba09a08-c107-441e-a467-5bf9acc74efa	2024-09-12 22:25:50.173107	localhost:8080
2	1c34d20e-71f9-4c61-82f9-fbc0eb59a275	2024-09-13 06:40:31.045735	localhost:8080
1	a1a21ce6-18ec-4e27-bdc2-4c22b676036a	2024-09-13 06:42:15.218814	localhost:8080
1	a90fb47a-0fa0-493c-96c0-a2ee68c9291d	2024-09-13 06:42:45.07387	localhost:8080
1	38717a7e-1a0e-49cc-8f3e-6930634898a5	2024-09-13 07:15:12.816581	localhost:8080
1	b49d8904-c565-4af9-a2dc-f8e4ee836ab8	2024-09-14 21:45:56.709073	localhost:8080
16	03be4f5a-b447-4d92-b987-73bf22f89964	2024-09-15 06:35:29.679205	localhost:8080
16	89587a47-1284-4561-a15e-a29e9281ddfc	2024-09-15 07:04:40.588527	localhost:8080
1	d6985493-74ef-4a67-9eb5-ca0921789f6b	2024-09-15 07:14:33.587519	localhost:8080
14	8160a7ce-0d77-4538-8f2d-b5fa56805d6f	2024-09-15 07:43:52.785414	localhost:8080
1	b53b624b-4e83-45e1-a14f-d60e16e403e5	2024-09-15 07:44:15.303084	localhost:8080
13	4ea589dd-3b9d-434b-b5da-02c76c846f96	2024-09-15 07:51:54.998031	localhost:8080
16	f1c1b9f0-37c2-4837-8414-61e344b6c747	2024-09-15 07:52:32.310336	localhost:8080
1	ad02964a-09c1-4eeb-81db-e02ec8590f8c	2024-09-15 08:20:00.006749	localhost:8080
1	22830b6a-2614-4835-ad27-e0916450a5e5	2024-09-16 00:43:23.398591	localhost:8080
16	86dc0674-4641-4b17-9b63-a3e609103d3d	2024-09-17 02:00:43.568146	localhost:8080
16	cbdbdc1e-55b8-447d-a6d8-6a580176010f	2024-09-17 02:12:22.743246	localhost:8080
1	7921c49b-246b-4fe1-9af5-8fa94e09549a	2024-09-19 05:11:13.428751	localhost:8080
18	b0f8587c-2268-4637-8ed6-715493c8470a	2024-09-19 06:39:42.169663	localhost:8080
\.


--
-- Data for Name: URLRecover; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."URLRecover" (uuid, id_user, action, token) FROM stdin;
31574f97-4968-4e04-afe9-7819c404b529	1	CONFIRM_EMAIL	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."User" (name, presentation, username, filepath, id) FROM stdin;
Carlos Sacarlos	\N	carlos	\N	3
Enrique	\N	enrique	\N	4
Josue	\N	josue	\N	5
Matias	\N	matias	\N	6
Hector	\N	hector	\N	7
Vulcan Asesino	\N	vulcan	\N	8
Angel	\N	angel	\N	9
holfdsla	\N	hola1234	\N	10
wefpewokef	\N	wekrwpo	\N	11
Robert Carlos	\N	roberto	2/9ce38185f50e0540.jpg	2
bloqueado jajaja	\N	bloqueado	\N	17
memero	\N	memero	16/c2032531c100ad0d.jpg	16
hola	\N	hola	14/11c0aabbc46ba22b.jpg	14
hol	Esta es la cuenta principal de prueba	adrianc68	1/db7ee3cc57674cb0.jpg	1
Matador Leonidas Salazar	\N	mataleon	18/1992e2dd92c4d311.jpg	18
Hola	\N	ala	\N	12
coca loca	\N	coca	13/fbe70c16a1630b8c.jpg	13
Federal Bureau International	\N	fbi	15/b5f798e3a316db3f.jpg	15
\.


--
-- Data for Name: UserConfiguration; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."UserConfiguration" (privacy, id_user) FROM stdin;
PUBLICO	3
PUBLICO	4
PUBLICO	5
PUBLICO	6
PUBLICO	7
PUBLICO	8
PUBLICO	9
PUBLICO	10
PUBLICO	11
PUBLICO	12
PUBLICO	14
PUBLICO	15
PUBLICO	17
PRIVADO	13
PUBLICO	1
PRIVADO	16
PRIVADO	2
PUBLICO	18
\.


--
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."UserRole" (id_user, role) FROM stdin;
1	PERSONAL
2	PERSONAL
3	PERSONAL
4	PERSONAL
5	PERSONAL
6	PERSONAL
7	PERSONAL
8	PERSONAL
9	PERSONAL
10	PERSONAL
11	PERSONAL
12	PERSONAL
13	PERSONAL
14	PERSONAL
15	PERSONAL
16	PERSONAL
17	PERSONAL
18	PERSONAL
\.


--
-- Data for Name: VerificationCode; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."VerificationCode" (code, username, created_time) FROM stdin;
\.


--
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.chat_id_seq', 2, true);


--
-- Name: chatgroup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.chatgroup_id_seq', 1, false);


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.comment_id_seq', 443, true);


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

SELECT pg_catalog.setval('public.message_id_seq', 23, true);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.post_id_seq', 60, true);


--
-- Name: region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.region_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.user_id_seq', 18, true);


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
-- Name: IXFK_Chat_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Chat_User" ON public."Chat" USING btree (id_sender);


--
-- Name: IXFK_Chat_User_02; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Chat_User_02" ON public."Chat" USING btree (id_receiver);


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
    ADD CONSTRAINT "FK_Chat_User" FOREIGN KEY (id_sender) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Chat FK_Chat_User_02; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "FK_Chat_User_02" FOREIGN KEY (id_receiver) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


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

