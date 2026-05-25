SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict mtAMPgB5XNsEreIosUv0MXuoKj8FMr7BFTapMRDM0uTq3dT92iN9ceLE0qPno6a

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: pacientes_pii; Type: TABLE DATA; Schema: operaciones; Owner: postgres
--

INSERT INTO "operaciones"."pacientes_pii" ("id_paciente", "curp", "nombre_completo", "email", "telefono", "password_hash", "fecha_registro") VALUES
	(1, 'PEGM900101HDFRXX01', 'Juan Pérez Gómez', 'juan.perez@doctu.com', '5511223344', 'Ju4n#Perez26', '2026-05-01'),
	(2, 'GOMA920202MDFRXX02', 'María González', 'maria.gonzalez@doctu.com', '5522334455', 'M@riaG0nzalez', '2026-05-05'),
	(3, 'LOCA950303HDFRXX03', 'Carlos López', 'carlos.lopez@doctu.com', '5533445566', 'C@rlosL0pez!', '2026-05-10'),
	(4, 'PIRP260524HASNMDA9', 'Pedro Pineda Ramírez', 'pedro_piadas_@gmail.com', '5511223344', '1234', '2026-05-24'),
	(5, 'REXL880619HMCYXS06', 'Luisito Rey', 'luisito_mejor_quel_werever@gmail.com', '5525526449', 'el werever es un chango', '2026-05-23'),
	(1001, 'AAAA800101HDFRR01', 'Alberto Álvarez', 'alberto@ejemplo.com', '5511223344', 'hash_simulado', '2026-05-24'),
	(1002, 'BBBB900202MDFRR02', 'Berenice Bueno', 'berenice@ejemplo.com', '5522334455', 'hash_simulado', '2026-05-24'),
	(1003, 'CCCC000303HDFRR03', 'Carlos Campos', 'carlos_c@ejemplo.com', '5533445566', 'hash_simulado', '2026-05-24');


--
-- Data for Name: profesionales_perfiles; Type: TABLE DATA; Schema: operaciones; Owner: postgres
--

INSERT INTO "operaciones"."profesionales_perfiles" ("id_profesional", "nombre_completo", "especialidad", "cedula_profesional", "email", "password_hash") VALUES
	(1, 'Dr. Arturo Mendoza', 'Médico General', 'CED1234567', 'arturo.medico@doctu.com', 'Artur0!Mend0za'),
	(2, 'Dra. Elena Ruiz', 'Psicología', 'CED7654321', 'elena.psico@doctu.com', 'El3na!Ruiz26'),
	(3, 'Dr. Roberto Sánchez', 'Odontología', 'CED1122334', 'roberto.odonto@doctu.com', 'R0bert0#2026'),
	(1001, 'Dr. Roberto Muelas', 'Odontología', 'CED-ODO-001', 'roberto@doctu.com', 'hash_simulado'),
	(1002, 'Dra. Laura Mente', 'Psicología', 'CED-PSI-002', 'laura@doctu.com', 'hash_simulado'),
	(1003, 'Dr. Carlos Cuerpo', 'Medicina General', 'CED-MED-003', 'carlos@doctu.com', 'hash_simulado');


--
-- Data for Name: agenda_citas; Type: TABLE DATA; Schema: operaciones; Owner: postgres
--

INSERT INTO "operaciones"."agenda_citas" ("id_cita", "id_paciente", "id_profesional", "fecha_hora", "estado") VALUES
	(1, 1, 1, '2026-05-20 10:00:00', 'Completada'),
	(2, 2, 2, '2026-05-23 14:00:00', 'Pendiente de Pago'),
	(3, 3, 3, '2026-05-23 16:30:00', 'Confirmada (Pagado)'),
	(4, 1, 1, '2026-05-25 11:00:00', 'Pendiente'),
	(5, 2, 3, '2026-05-28 12:00:00', 'Confirmada (Pagado)'),
	(1001, 1001, 1001, '2026-05-25 10:00:00', 'Completada'),
	(1002, 1002, 1002, '2026-05-25 11:30:00', 'Completada'),
	(1003, 1003, 1003, '2026-05-25 13:00:00', 'Completada');


--
-- Data for Name: expediente_general; Type: TABLE DATA; Schema: operaciones; Owner: postgres
--

INSERT INTO "operaciones"."expediente_general" ("id_expediente", "id_cita", "id_paciente", "id_profesional", "tipo_formato", "fecha_creacion") VALUES
	(1, 1, 1, 1, 'GENERAL', '2026-05-20'),
	(2, 3, 3, 3, 'ODONTOLOGIA', '2026-05-23'),
	(1001, 1001, 1001, 1001, 'ODONTOLOGIA', '2026-05-24'),
	(1002, 1002, 1002, 1002, 'PSICOLOGIA', '2026-05-24'),
	(1003, 1003, 1003, 1003, 'GENERAL', '2026-05-24');


--
-- Data for Name: formato_medico_general; Type: TABLE DATA; Schema: operaciones; Owner: postgres
--



--
-- Data for Name: formato_odontologia; Type: TABLE DATA; Schema: operaciones; Owner: postgres
--



--
-- Data for Name: formato_psicologia; Type: TABLE DATA; Schema: operaciones; Owner: postgres
--



--
-- Data for Name: pagos_transacciones; Type: TABLE DATA; Schema: operaciones; Owner: postgres
--

INSERT INTO "operaciones"."pagos_transacciones" ("id_pago", "id_cita", "monto_mxn", "metodo_pago", "id_transaccion_stripe", "fecha_pago") VALUES
	(1, 3, 800.00, 'Stripe', 'pi_1H2j3kL4m5n6o7p8', '2026-05-22 10:00:00'),
	(2, 5, 1200.00, 'Stripe', 'pi_9H8j7kL6m5n4o3p2', '2026-05-21 15:30:00');


--
-- Data for Name: log_accesos_seguridad; Type: TABLE DATA; Schema: seguridad; Owner: postgres
--

INSERT INTO "seguridad"."log_accesos_seguridad" ("id_log", "id_paciente", "usuario_db", "sentencia_sql", "fecha_acceso", "alerta_enviada") VALUES
	(1, 101, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-23 03:22:06.025203', 0),
	(3, 1, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-23 03:29:33.928168', 0),
	(4, 101, 'service_role', 'Modificación DML en Bóveda PII', '2026-05-23 20:53:02.640508', 0),
	(5, 102, 'service_role', 'Modificación DML en Bóveda PII', '2026-05-23 20:53:02.640508', 0),
	(6, 2, 'service_role', 'Modificación DML en Bóveda PII', '2026-05-23 21:06:37.911249', 0),
	(7, 999, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-23 22:10:39.700566', 0),
	(14, 10, 'service_role', 'Modificación DML en Bóveda PII', '2026-05-24 01:36:38.732098', 0),
	(15, 13, 'service_role', 'Modificación DML en Bóveda PII', '2026-05-24 05:28:21.526835', 0),
	(16, 1, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 05:53:33.882591', 0),
	(17, 2, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 05:53:33.882591', 0),
	(18, 3, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 05:53:33.882591', 0),
	(19, 1, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 05:56:25.95402', 0),
	(20, 2, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 05:56:25.95402', 0),
	(21, 3, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 05:56:25.95402', 0),
	(22, 4, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 06:08:26.237105', 0),
	(23, 5, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 06:14:20.559717', 0),
	(33, 1001, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 20:23:12.732772', 0),
	(34, 1002, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 20:23:12.732772', 0),
	(35, 1003, 'postgres', 'Modificación DML en Bóveda PII', '2026-05-24 20:23:12.732772', 0);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

INSERT INTO "supabase_functions"."hooks" ("id", "hook_table_id", "hook_name", "created_at", "request_id") VALUES
	(1, 17558, 'Alerta Acceso PII', '2026-05-24 06:08:26.237105+00', 1),
	(2, 17558, 'Alerta Acceso PII', '2026-05-24 06:14:20.559717+00', 2),
	(12, 17558, 'Alerta Acceso PII', '2026-05-24 20:23:12.732772+00', 12),
	(13, 17558, 'Alerta Acceso PII', '2026-05-24 20:23:12.732772+00', 13),
	(14, 17558, 'Alerta Acceso PII', '2026-05-24 20:23:12.732772+00', 14);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: agenda_citas_id_cita_seq; Type: SEQUENCE SET; Schema: operaciones; Owner: postgres
--

SELECT pg_catalog.setval('"operaciones"."agenda_citas_id_cita_seq"', 1003, true);


--
-- Name: expediente_general_id_expediente_seq; Type: SEQUENCE SET; Schema: operaciones; Owner: postgres
--

SELECT pg_catalog.setval('"operaciones"."expediente_general_id_expediente_seq"', 1003, true);


--
-- Name: formato_medico_general_id_formato_gen_seq; Type: SEQUENCE SET; Schema: operaciones; Owner: postgres
--

SELECT pg_catalog.setval('"operaciones"."formato_medico_general_id_formato_gen_seq"', 2, true);


--
-- Name: formato_odontologia_id_formato_odo_seq; Type: SEQUENCE SET; Schema: operaciones; Owner: postgres
--

SELECT pg_catalog.setval('"operaciones"."formato_odontologia_id_formato_odo_seq"', 4, true);


--
-- Name: formato_psicologia_id_formato_psi_seq; Type: SEQUENCE SET; Schema: operaciones; Owner: postgres
--

SELECT pg_catalog.setval('"operaciones"."formato_psicologia_id_formato_psi_seq"', 3, true);


--
-- Name: pacientes_pii_id_paciente_seq; Type: SEQUENCE SET; Schema: operaciones; Owner: postgres
--

SELECT pg_catalog.setval('"operaciones"."pacientes_pii_id_paciente_seq"', 1003, true);


--
-- Name: pagos_transacciones_id_pago_seq; Type: SEQUENCE SET; Schema: operaciones; Owner: postgres
--

SELECT pg_catalog.setval('"operaciones"."pagos_transacciones_id_pago_seq"', 3, false);


--
-- Name: profesionales_perfiles_id_profesional_seq; Type: SEQUENCE SET; Schema: operaciones; Owner: postgres
--

SELECT pg_catalog.setval('"operaciones"."profesionales_perfiles_id_profesional_seq"', 4, false);


--
-- Name: log_accesos_seguridad_id_log_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: postgres
--

SELECT pg_catalog.setval('"seguridad"."log_accesos_seguridad_id_log_seq"', 35, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 14, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict mtAMPgB5XNsEreIosUv0MXuoKj8FMr7BFTapMRDM0uTq3dT92iN9ceLE0qPno6a

RESET ALL;
