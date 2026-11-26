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
git clone URL_DEL_REPOSITORIO
```

Ingresar a la carpeta del proyecto:

```bash
cd AsisTI
```

## 4. Configurar las variables de entorno

En la raíz del proyecto, crear el archivo `.env` a partir del archivo `.env.example`:

En Windows:

```powershell
Copy-Item .env.example .env
```

En Linux/macOS:

```bash
cp .env.example .env
```

Editar el archivo `.env` y configurar las variables:

```env
POSTGRES_PASSWORD=CAMBIAR_POR_UNA_CLAVE_SEGURA

AI_SERVICE_URL=http://ai-service:8001

GRAFANA_USER=admin
GRAFANA_PASSWORD=CAMBIAR_POR_UNA_CLAVE_SEGURA
```

Las contraseñas deben ser reemplazadas por valores propios.

## 5. Construir y levantar los servicios

Desde la raíz del proyecto, ejecutar:

```bash
docker compose up -d --build
```

Docker Compose construirá las imágenes necesarias y levantará los contenedores.

Durante la primera ejecución:

- Se descargará la imagen de Ollama.
- Se descargarán los modelos Qwen 2.5 3B y Nomic Embed Text.
- Se inicializará PostgreSQL con pgvector y las tablas correspondientes.
- Se ejecutará el indexador de documentos del sistema RAG.
- Se iniciarán los servicios de backend, frontend, IA y monitoreo.

**Importante:** la primera instalación puede demorar debido a la descarga de imágenes Docker y modelos de inteligencia artificial.

Para consultar el estado de los contenedores:

```bash
docker compose ps
```

Para consultar los registros:

```bash
docker compose logs -f
```

## 6. Acceso a los servicios

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

## 7. Configuración de n8n

El proyecto incluye un workflow exportado para la captura y gestión de contactos:

`n8n/workflows/asisti-contactos.json`

Para importarlo:

1. Ingresar a http://localhost:5678.
2. Completar la configuración inicial de usuario propietario de n8n, si se solicita.
3. Importar el workflow desde el archivo JSON incluido en el repositorio.
4. Configurar las credenciales de PostgreSQL del workflow.

Los datos de conexión son:

| Parámetro | Valor |
|---|---|
| Host | postgres-asisti |
| Puerto | 5432 |
| Base de datos | asisti |
| Usuario | asisti_user |
| Contraseña | Valor de POSTGRES_PASSWORD del archivo .env |
| SSL | Desactivado para la conexión interna local |

La credencial debe guardarse en n8n antes de ejecutar el workflow.

## 8. Base de datos y documentos RAG

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

## 9. Monitoreo

El proyecto incorpora Prometheus y Grafana para observar el funcionamiento del servicio de inteligencia artificial.

- Prometheus recopila métricas del servicio FastAPI.
- Grafana permite visualizar las métricas mediante dashboards.

Acceso:

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

## 10. Detener los servicios

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

## 11. Solución de problemas

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

## 12. Consideraciones finales

AsisTI está diseñado para ejecutarse localmente mediante Docker Compose, sin depender de servicios pagos de inteligencia artificial.

El proyecto integra desarrollo web, procesamiento de lenguaje natural, recuperación aumentada por generación (RAG), automatización y monitoreo de servicios en una única solución.

**Proyecto integrador – Licenciatura en Inteligencia Artificial.**
