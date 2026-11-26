# AsisTI – Asistente Inteligente para Soporte Técnico

Sistema de asistencia técnica basado en Inteligencia Artificial, desarrollado como proyecto integrador de la Licenciatura en Inteligencia Artificial.

AsisTI permite a los usuarios realizar consultas sobre problemas informáticos mediante un asistente conversacional que utiliza modelos de lenguaje locales y una arquitectura RAG (*Retrieval-Augmented Generation*). También incorpora un sistema de captura de contactos y herramientas de monitoreo de infraestructura.

## 1. Arquitectura y tecnologías

El proyecto está compuesto por los siguientes servicios:

| Componente | Tecnología | Función |
|---|---|---|
| Frontend | React + Vite | Interfaz de usuario y chat |
| Backend | Laravel 13 + PHP 8.3 | API y lógica de aplicación |
| Servicio de IA | Python + FastAPI | Procesamiento de consultas y RAG |
| Modelo de lenguaje | Ollama + Qwen 2.5 3B | Generación de respuestas |
| Embeddings | Nomic Embed Text | Generación de vectores |
| Base de datos | PostgreSQL 17 + pgvector | Almacenamiento de contactos y documentos vectorizados |
| Automatización | n8n | Captura y gestión de contactos |
| Monitoreo | Prometheus + Grafana | Métricas y visualización |

Todos los servicios se ejecutan mediante Docker Compose.

## 2. Requisitos previos

Antes de instalar el proyecto, es necesario contar con:

- Windows 10/11, Linux o macOS.
- Docker Desktop instalado y funcionando (en Windows, con WSL 2).
- Git.
- Conexión a Internet durante la primera instalación.

Se recomienda disponer de al menos 8 GB de memoria RAM, preferentemente 16 GB, debido a la ejecución simultánea de los servicios y los modelos de inteligencia artificial.

No es necesario instalar manualmente PHP, Composer, Python, Node.js, PostgreSQL ni Ollama en el equipo anfitrión. Docker se encarga de ejecutar sus respectivos entornos.

## 3. Clonar el repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/geroalles7/AsisTI.git
```

Ingresar a la carpeta del proyecto:

```bash
cd AsisTI
```

## 4. Iniciar el proyecto

Desde la raíz del repositorio, ejecutar:

```bash
docker compose up -d
```

No hace falta instalar Composer, importar el workflow de n8n ni crear un archivo `.env` para la primera ejecución local. Compose construye las imágenes, instala las dependencias PHP del backend, crea la base de datos y configura n8n con el workflow y la credencial PostgreSQL.

Durante el primer inicio se descargan las imágenes Docker y los modelos Qwen 2.5 3B y Nomic Embed Text. La descarga puede demorar según la conexión y el equipo. Para consultar el estado:

```bash
docker compose ps
docker compose logs -f
```

## 5. Acceso a los servicios

Una vez iniciados correctamente los contenedores, los servicios estarán disponibles en las siguientes direcciones:

| Servicio | Dirección |
|---|---|
| Aplicación web | http://localhost:5173 |
| API Laravel | http://localhost:8000 |
| Servicio de IA | http://localhost:8001 |
| Documentación FastAPI | http://localhost:8001/docs |
| Health Check IA | http://localhost:8001/health |
| n8n | http://localhost:5678 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

Para Grafana se utilizan las credenciales configuradas en el archivo `.env`.

## 6. Configuracion de n8n

Al iniciar el contenedor, n8n importa automaticamente el workflow de captura de contactos y configura su credencial PostgreSQL para conectarse al servicio `postgres-asisti`. No es necesario importar el archivo manualmente.

En el primer acceso a http://localhost:5678, n8n solicitara crear la cuenta propietaria de la instancia. Completar ese registro una sola vez; en los siguientes accesos, iniciar sesion con esa cuenta. El workflow ya estara cargado y disponible con su webhook en `/webhook/asisti/contactos`.

## 7. Base de datos y documentos RAG

PostgreSQL utiliza la extensión pgvector para almacenar los embeddings de los documentos.

El archivo de inicialización se encuentra en:

`database/init/01-init.sql`

La carpeta de documentos que utiliza el indexador está ubicada en:

`ai-service/documents/`

El indexador procesa los documentos y almacena sus fragmentos y representaciones vectoriales en PostgreSQL.

Los modelos utilizados son:

- `qwen2.5:3b`
- `nomic-embed-text:latest`

Los modelos se descargan automáticamente durante la primera ejecución mediante el servicio de inicialización de Ollama.

**Nota:** los scripts de `/docker-entrypoint-initdb.d` se ejecutan únicamente cuando PostgreSQL inicializa un volumen de datos vacío. No se vuelven a ejecutar automáticamente cuando se reinicia un contenedor o se utiliza una base de datos existente.

## 8. Monitoreo

El proyecto incorpora Prometheus y Grafana para observar el funcionamiento del servicio de inteligencia artificial.

- Prometheus recopila métricas del servicio FastAPI.
- Grafana permite visualizar las métricas mediante dashboards.

Acceso:

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

## 9. Detener los servicios

Para detener los contenedores sin eliminar los datos almacenados:

```bash
docker compose down
```

Para volver a iniciar los servicios:

```bash
docker compose up -d
```

Los datos persistentes se conservan en los volúmenes de Docker.

**Importante:** no utilizar `docker compose down -v`, ya que ese comando elimina también los volúmenes y los datos persistentes.

## 10. Solución de problemas

### Los servicios no inician correctamente

Consultar los registros:

```bash
docker compose logs -f
```

También se puede consultar un servicio específico:

```bash
docker compose logs -f ai-service
```

### Ollama todavía está descargando los modelos

Consultar:

```bash
docker logs asisti-ollama-init
```

La descarga puede demorar dependiendo de la conexión a Internet.

### El indexador presenta errores

Consultar:

```bash
docker logs asisti-rag-indexer
```

Verificar que PostgreSQL y Ollama estén funcionando correctamente.

### No se puede acceder a la aplicación

Verificar que los contenedores estén activos:

```bash
docker compose ps
```

Comprobar también que los puertos utilizados no estén ocupados por otras aplicaciones.

---

## 11. Consideraciones finales

AsisTI está diseñado para ejecutarse localmente mediante Docker Compose, sin depender de servicios pagos de inteligencia artificial.

El proyecto integra desarrollo web, procesamiento de lenguaje natural, recuperación aumentada por generación (RAG), automatización y monitoreo de servicios en una única solución.

**Proyecto integrador – Licenciatura en Inteligencia Artificial.**