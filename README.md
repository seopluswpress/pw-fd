# AEPMA: Enterprise AI-Powered Preventive Maintenance SaaS Platform

AEPMA is an enterprise-grade, multi-tenant AI-powered Preventive Maintenance SaaS platform designed in alignment with the AWS Well-Architected Framework. It features robust tenant isolation, advanced machine learning diagnostics powered by Gemini (via AWS Bedrock/Gemini client APIs), asset lifecycle registries, scheduled maintenance templates, breakdown work orders (Kanban board), and an interactive maintenance copilot assistant.

The user interface follows a modern **High Density** design philosophy inspired by systems like ServiceNow, Monday.com, and IBM Maximo.

---

## 🚀 Key Architectural & Product Capabilities

1. **Multi-Tenant SaaS Boundary Isolation**
   - Enforces strict row-level partitioning for multi-tenant organizations (e.g., Mayo Clinical Research, Amazon Fulfillment WH-B4, Tesla Giga Plant).
   - Role-Based Access Control (RBAC) supporting identities from **Super Admin** down to **Field Technician** and **Auditor**.
   - Offline status sync mechanism to buffer technician activities locally before syncing downstream to AWS.

2. **Full AWS Cloud Native Topology**
   - **Ingress Protections**: Route53, CloudFront Content Delivery, AWS Web Application Firewall (WAF).
   - **Load Routing**: REST and WebSocket capabilities via Amazon API Gateway proxies backed by secure custom Cognito JWT token authorizations.
   - **Serverless Compute**: Elastic scaling using TypeScript-based **AWS Lambda** compute models.
   - **Event-Driven Schedules**: Auto-recurring checklists driven by **Amazon EventBridge** cron expressions and orchestrated by **AWS Step Functions**.
   - **Database Hybrid Schema**: Single-Table DynamoDB structures optimized for real-time IoT metrics and telemetry queues; and RDS PostgreSQL for multi-tenant relational historical tracking and asset depreciation calculations.

3. **Cognitive Machine Learning (Gemini API Integration)**
   - **Telemetry Predictive Diagnostics**: Real-time evaluation of vibration frequencies and thermal streams to deliver precise failure probability.
   - **Unstructured Voice-to-Ticket Transcription**: Technicians can record issues to automatically compile formatted priority work orders.
   - **AI Troubleshooting & Spare-Parts Suggestions**: Instant recommendations for physical mechanics diagnostics alongside part SKUs and budget margins.
   - **Interactive Copilot Chat**: An interactive chat terminal providing safety guidelines, lockout tag-out (LOTO) protocols, and vendor agreement lookups.

---

## 🛠️ Technology Stack Used

- **Frontend Core**: React 19, TypeScript, Tailwind CSS v4 (incorporating modern high-density metrics and custom SVG graphing pipelines), Lucide SVG Icons.
- **Backend Service**: Node.js, Express, tsx (for direct server TypeScript bootstrapper), esbuild (compiling server logic to self-contained production bundle targets).
- **Core AI Integration**: `@google/genai` (Gemini 3.5 Flash Model API SDK).
- **Security & Build**: TypeScript Type-Check Lints, dotenv secure environment mapping, local-storage offline fallbacks.

---

## 💻 Local Installation & Setup

Ensure you have **Node.js 20.x or higher** and **npm** installed.

### 1. Extract and Install Dependencies
Navigate to your project root workspace directory and populate `node_modules` vectors:
```bash
npm install
```

### 2. Configure Environment Parameters
Create a `.env` file referencing the parameters declared in `.env.example`:
```env
# Secure Gemini Access Token
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Local Server Reference
PORT=3000
NODE_ENV=development
```
*Note: AI Studio automatically manages this parameter injection at runtime when running from Cloud Run sandboxes.*

### 3. Start Development Web Server
The App operates on a Full-Stack architecture (Custom Express Gateway + Vite Client Middleware). Run the unified dev script:
```bash
npm run dev
```
The server will boot and listen directly on [http://localhost:3000](http://localhost:3000).

### 4. Direct Production Compilation
Compile the frontend bundle assets and pack the TypeScript Express backend into a single consolidated `.cjs` bundle under `dist/`:
```bash
npm run build
npm run start
```

---

## 📂 Project Architecture Directories
```
/
├── .env.example          # Environment parameter template specs
├── server.ts             # Express gateway hosting REST AI diagnostics and Vite middleware
├── index.html            # Gateway DOM entry node template
├── package.json          # Node dependency orchestrations
├── metadata.json         # High level permissions & workspace configurations
├── src/
│   ├── App.tsx           # Primary UI, dashboard segments, forms, and copilot terminal
│   ├── main.tsx          # React StrictMode bootstrap pipeline
│   ├── types.ts          # Strongly typed TypeScript interfaces (Asset, Ticket, AuditLog)
│   ├── data.ts           # Enterprise datasets, IoT telemetry metrics, and AWS system guides
│   └── index.css         # Import rules pairing "Space Grotesk" display with Inter and Mono
└── README.md             # This structural platform documentation
```
