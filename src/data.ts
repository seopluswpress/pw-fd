import { Organization, Asset, MaintenanceSchedule, WorkOrderTicket, AuditLog, SystemHealthMetric } from "./types";

// ----------------- MULTI-TENANT CONFIGURATION SATELLITES -----------------

export const ORGANIZATIONS: Organization[] = [
  {
    id: "org_mayo_med",
    name: "Mayo Clinical Research Group",
    industry: "Hospital",
    tier: "Ultimate Enterprise",
    assetsCount: 1420,
  },
  {
    id: "org_amazon_wh",
    name: "Amazon Fulfillment Center WH-B4",
    industry: "Warehouse",
    tier: "Ultimate Enterprise",
    assetsCount: 3850,
  },
  {
    id: "org_tesla_giga",
    name: "Tesla Giga-Assembly Plant 5",
    industry: "Manufacturing",
    tier: "Ultimate Enterprise",
    assetsCount: 8900,
  },
  {
    id: "org_marriott_fac",
    name: "Marriott Luxury Towers & Resorts",
    industry: "Hospitality",
    tier: "Professional",
    assetsCount: 650,
  }
];

// ----------------- ENTERPRISE ASSET CORES -----------------

export const INITIAL_ASSETS: Asset[] = [
  // Org 1: Hospital (Mayo Clinical)
  {
    id: "asset_mayo_chiller_1",
    name: "Carrier 19XR Centrifugal Chiller Node 1",
    category: "HVAC",
    status: "Nominal",
    serialNumber: "SN-CAR-90812-HVC",
    location: "Surgical Tower Roof Deck A",
    department: "Clinical Facilities Group",
    warrantyExpiry: "2027-12-15",
    vendorName: "Carrier Industrial Systems",
    amcContractId: "AMC-HVC-2026-004",
    depreciationRate: 8.5,
    purchaseValue: 245000,
    healthScore: 94,
    utilizationRate: 82,
    lastMaintenanceDate: "2026-05-10",
    telemetryStream: {
      temperature: 42.4, // C (oil cooling temp)
      vibration: 2.1, // mm/s RMS (concentric shaft rotation)
      runHours: 14520,
      loadFactor: 76,
    }
  },
  {
    id: "asset_mayo_autoclave_A",
    name: "Tuttnauer 3870EHP Class B Laboratory Autoclave",
    category: "Biomedical",
    status: "Warning",
    serialNumber: "SN-TUT-43211-BIO",
    location: "Sterility Control Room 12-B",
    department: "Pathology Sub-division",
    warrantyExpiry: "2026-08-01",
    vendorName: "Tuttnauer Biomedical Corp",
    amcContractId: "AMC-BIO-2025-109",
    depreciationRate: 12.0,
    purchaseValue: 85000,
    healthScore: 68,
    utilizationRate: 91,
    parentId: "asset_mayo_chiller_1", // linked as part of water recirculation loop
    lastMaintenanceDate: "2026-04-20",
    telemetryStream: {
      temperature: 134.5, // C (pressure peak)
      vibration: 5.8, // mm/s (increasing due to loose vibration damping gasket)
      runHours: 6810,
      loadFactor: 94,
    }
  },
  {
    id: "asset_mayo_mri_3",
    name: "Siemens Magnetom Vida 3T MRI Core",
    category: "Biomedical",
    status: "Nominal",
    serialNumber: "SN-SIE-77098-MRI",
    location: "Imaging Lab Annex Ground Level",
    department: "Radiology Department & Diagnostics",
    warrantyExpiry: "2029-01-30",
    vendorName: "Siemens Healthineers",
    amcContractId: "AMC-BIO-2025-001",
    depreciationRate: 15.0,
    purchaseValue: 1850000,
    healthScore: 98,
    utilizationRate: 64,
    lastMaintenanceDate: "2026-05-02",
    telemetryStream: {
      temperature: -269.1, // C (Liquid Helium Core Temp)
      vibration: 0.15,
      runHours: 2470,
      loadFactor: 80,
    }
  },

  // Org 2: Warehouse (Amazon)
  {
    id: "asset_amzn_sorter_belt",
    name: "Dematic High-Speed Crossbelt Sorting Deck",
    category: "Mechanical",
    status: "Nominal",
    serialNumber: "SN-DEM-22340-SOR",
    location: "South Sort Bay Platform 4",
    department: "Material Flow & Conveyance",
    warrantyExpiry: "2028-06-30",
    vendorName: "Dematic Logistics Solutions",
    amcContractId: "AMC-MECH-2025-88",
    depreciationRate: 10.0,
    purchaseValue: 450000,
    healthScore: 89,
    utilizationRate: 98,
    lastMaintenanceDate: "2026-05-18",
    telemetryStream: {
      temperature: 58.2,
      vibration: 3.4,
      runHours: 28430,
      loadFactor: 95,
    }
  },
  {
    id: "asset_amzn_power_panel_A",
    name: "Schneider Electric MasterPact MTZ Main Power Distribution Panel",
    category: "Electrical",
    status: "Critical",
    serialNumber: "SN-SCH-00293-PWR",
    location: "Substation Sub-vault West",
    department: "High Voltage Operations",
    warrantyExpiry: "2031-10-15",
    vendorName: "Schneider Electric Services",
    amcContractId: "AMC-ELEC-2024-991",
    depreciationRate: 5.0,
    purchaseValue: 125000,
    healthScore: 41,
    utilizationRate: 88,
    lastMaintenanceDate: "2026-03-10",
    telemetryStream: {
      temperature: 92.8, // Extremely hot electrical breaker junction
      vibration: 0.5,
      runHours: 35000,
      loadFactor: 92,
    }
  },

  // Org 3: Tesla Manufacturing
  {
    id: "asset_tsla_kuka_robot",
    name: "KUKA KR 1000 Titan Heavy Duty Robotic Arm Node B2",
    category: "Mechanical",
    status: "Nominal",
    serialNumber: "SN-KUK-99881-ROB",
    location: "Stamping & Chassis Alignment Row 12",
    department: "Advanced Body Framing Unit",
    warrantyExpiry: "2027-04-12",
    vendorName: "KUKA Robotics USA",
    amcContractId: "AMC-ROB-KUKA-33",
    depreciationRate: 14.5,
    purchaseValue: 320000,
    healthScore: 92,
    utilizationRate: 94,
    lastMaintenanceDate: "2026-05-14",
    telemetryStream: {
      temperature: 61.3,
      vibration: 1.9,
      runHours: 19800,
      loadFactor: 89,
    }
  },

  // Org 4: Hospitality
  {
    id: "asset_mari_boiler_1",
    name: "Patterson-Kelley P-K SONIC Stainless Condensing Gas Water Boiler",
    category: "Plumbing",
    status: "Nominal",
    serialNumber: "SN-PK-55610-PLB",
    location: "Basement Plant Room East",
    department: "Central Utility Heating Services",
    warrantyExpiry: "2028-11-20",
    vendorName: "Patterson-Kelley LLC Office",
    amcContractId: "AMC-BOI-MARR-10",
    depreciationRate: 7.5,
    purchaseValue: 78000,
    healthScore: 95,
    utilizationRate: 70,
    lastMaintenanceDate: "2026-05-01",
    telemetryStream: {
      temperature: 71.1,
      vibration: 0.82,
      runHours: 12050,
      loadFactor: 64,
    }
  }
];

// ----------------- PREVENTIVE MAINTENANCE SCHEDULES -----------------

export const INITIAL_SCHEDULES: MaintenanceSchedule[] = [
  {
    id: "sched_hvc_bimonthly",
    title: "Bi-Monthly HVAC Chiller Compressor Test & Recalibration",
    assetId: "asset_mayo_chiller_1",
    assetName: "Carrier 19XR Centrifugal Chiller Node 1",
    recurrence: "Monthly",
    checklist: [
      "Analyze oil levels and inspect auxiliary heater elements.",
      "Execute high vibration test sweep on compressor coupling spindles.",
      "Calibrate water-side and refrigerant static temperature transmitters.",
      "Recover refrigerant moisture content sample for certified lab gas logs.",
      "Inspect secondary circuit flow safety solenoids and record static resistance."
    ],
    lastRunDate: "2026-05-10",
    nextDueDate: "2026-06-10",
    slaLimitHrs: 24,
    assignedTeam: "Carrier Technical Field Force"
  },
  {
    id: "sched_bio_sterilizer",
    title: "Weekly Biomedical Pressure Safety Release Gasket Check",
    assetId: "asset_mayo_autoclave_A",
    assetName: "Tuttnauer 3870EHP Class B Laboratory Autoclave",
    recurrence: "Weekly",
    checklist: [
      "Examine perimeter silicon high-temp airtight door safety seal.",
      "Clear condensate drain mesh of micro-particulate blockage.",
      "Test emergency solenoid steam vent dump release button in manual bypass.",
      "Log baseline standard chamber pressure buildup rate to peak limits."
    ],
    lastRunDate: "2026-05-20",
    nextDueDate: "2026-05-27",
    slaLimitHrs: 4,
    assignedTeam: "Hospital In-House Bio-Med Engineers"
  },
  {
    id: "sched_schneider_thermal",
    title: "Weekly Thermal Scan and Breaker Calibration Sequence",
    assetId: "asset_amzn_power_panel_A",
    assetName: "Schneider Electric MasterPact Main Distribution Panel",
    recurrence: "Weekly",
    checklist: [
      "Capture infrared thermal imaging signatures across main bus-bars.",
      "Verify manual exhaust mechanical fan air-discharge rate.",
      "Tighten bus coupling terminal hardware fasteners (Spec: 48 Nm torque limit).",
      "Upload high-temp scan charts into Schneider secure site repository."
    ],
    lastRunDate: "2026-05-19",
    nextDueDate: "2026-05-26",
    slaLimitHrs: 8,
    assignedTeam: "High-Voltage Electrical Response Team"
  }
];

// ----------------- WORK ORDER / BREAKDOWN TICKETS -----------------

export const INITIAL_TICKETS: WorkOrderTicket[] = [
  {
    id: "tkt_001",
    title: "Sub-junction heat signature threshold exceeded (92°C)",
    description: "FLIR Thermography audit flagged severe electrical thermal stress centered on breaker panel circuit node E4. Current temperatures spikes are nearing physical degradation margins. High load runs must be capped immediately, or power diverted to backup generator bus-bars.",
    assetId: "asset_amzn_power_panel_A",
    assetName: "Schneider Electric MasterPact Distribution Panel",
    priority: "EMERGENCY",
    status: "Waiting for Parts",
    assignee: "Mark Alvarez",
    assigneeRole: "Technician",
    reportedAt: "2026-05-24T14:20:00Z",
    slaDeadline: "2026-05-25T08:00:00Z",
    downtimeMinutes: 180,
    rootCauseAnalysis: "Accelerated resistance corrosion on secondary mechanical jumper connectors caused by loose fastener tightness during the last assembly lifecycle shift.",
    troubleshootingSteps: [
      "Perform secure lockout tagout (LOTO) protocols on breaker panel 12A.",
      "Evacuate any latent internal static charge with localized safety grounding poles.",
      "Scrub corroded jumper blades with specialized copper oxides cleaner cleaner.",
      "Replace physical connector bridge using high-conductivity plating, lockwashers, and secure mounting lugs."
    ],
    suggestedSpares: [
      { partName: "240A Silver-Plated Core Breaker Connector Segment", partNumber: "SCS-240-SCHN", estimatedCost: "$145.00", inStock: false },
      { partName: "Deoxidizing Contact Prep Spray Duo-Cleanse", partNumber: "S-OX-129", estimatedCost: "$18.50", inStock: true }
    ],
    comments: [
      { id: "c_1", author: "Sarah Jenkins", role: "Maintenance Manager", content: "LOTO clearances approved. Breaker isolated. Awaiting urgent delivery of copper jumpers from Schneider central stash.", timestamp: "2026-05-24T15:00:00Z" }
    ],
    isAiOptimized: true
  },
  {
    id: "tkt_002",
    title: "Screeching sound and pressure release lags observed on Autoclave",
    description: "Sterility lab personnel reported unusual loud harmonic whining noises during steam vent and purge sequences. Micro-seal vacuum chamber indicates pressure drop rates are slower than nominal. Suspect micro-fissure wear in high-vacuum exhaust safety solenoid.",
    assetId: "asset_mayo_autoclave_A",
    assetName: "Tuttnauer 3870EHP Class B Laboratory Autoclave",
    priority: "HIGH",
    status: "In Progress",
    assignee: "Zoe Chen",
    assigneeRole: "Technician",
    reportedAt: "2026-05-25T02:10:00Z",
    slaDeadline: "2026-05-25T06:10:00Z",
    downtimeMinutes: 45,
    rootCauseAnalysis: "Dry piston cylinder seal scoring the chamber shaft core and warping outer gasket alignments.",
    troubleshootingSteps: [
      "Evacuate autoclave water loop chambers completely.",
      "Visually inspect chamber sleeve with localized fiberscope.",
      "Dismount pressure control valve stem node and exchange silicon O-Rings."
    ],
    suggestedSpares: [
      { partName: "Tuttnauer High-Pressure Silicon Ring Gasket Kit", partNumber: "RG-TUT-3870", estimatedCost: "$42.00", inStock: true }
    ],
    comments: [
      { id: "c_2", author: "Zoe Chen", role: "Technician", content: "Disassembling autoclave vent port. Discovered extensive wear inside gaskets, micro-particles of soot from boiler are inside. Cleaning now.", timestamp: "2026-05-25T03:30:00Z" }
    ],
    isAiOptimized: true
  },
  {
    id: "tkt_003",
    title: "Centrifugal HVAC Compressor vibration warning flagged",
    description: "IoT telemetry alerts show oil temperature has drifted from normal bounds to 42.4°C. More importantly, vibration readings on the primary motor shaft housing have triggered a Warning status at 2.1 mm/s. Maintenance timeline recommends alignment verification.",
    assetId: "asset_mayo_chiller_1",
    assetName: "Carrier 19XR Centrifugal Chiller Node 1",
    priority: "MEDIUM",
    status: "Open",
    assignee: "Mark Alvarez",
    assigneeRole: "Technician",
    reportedAt: "2026-05-25T04:45:00Z",
    slaDeadline: "2026-05-26T04:45:00Z",
    downtimeMinutes: 0,
    comments: []
  }
];

// ----------------- MULTI-TENANT AUDIT TRACKING LOGS -----------------

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log_001",
    timestamp: "2026-05-25T01:10:00Z",
    actorName: "Sarah Jenkins",
    actorRole: "Maintenance Manager",
    action: "Onboarding Tenant Organization",
    resourceType: "Organization",
    details: "Configured multi-tenant secure isolation partition block Mayo Clinical Research Group.",
    tenantId: "org_mayo_med"
  },
  {
    id: "log_002",
    timestamp: "2026-05-25T02:00:00Z",
    actorName: "Zoe Chen",
    actorRole: "Technician",
    action: "Trigger QR Label Generation",
    resourceType: "QR Engine",
    details: "Generated 35 scannable asset labels for Radiology & Surgical Suite Equipment vectors.",
    tenantId: "org_mayo_med"
  },
  {
    id: "log_003",
    timestamp: "2026-05-25T03:15:00Z",
    actorName: "Systems Gateway (Cognito)",
    actorRole: "Security Core",
    action: "Enforced TLS Tenant Routing",
    resourceType: "API Gateway",
    details: "Successfully validated JWT authentication structure enclosing tenant-claim 'org_amazon_wh'. Request authorized.",
    tenantId: "org_amazon_wh"
  },
  {
    id: "log_004",
    timestamp: "2026-05-25T04:30:00Z",
    actorName: "Admin Console Manager",
    actorRole: "Super Admin",
    action: "Adjust Subscription Plan",
    resourceType: "Billing Module",
    details: "Upgraded 'Mayo Clinical Research Group' partition line from standard Premium to Ultimate Enterprise tier with dual-region mirroring.",
    tenantId: "org_mayo_med"
  }
];

// ----------------- REAL-TIME CLOUDWATCH METRIC STREAMS -----------------

export const SYSTEM_METRICS: SystemHealthMetric[] = [
  {
    id: "met_node_1",
    serverNode: "AWS Cloud Run Core Ingress - Main Region",
    cpuLoad: 24.5,
    memoryUsage: 61.2,
    apiLatencyMs: 42,
    activeSockets: 489,
    status: "Nominal"
  },
  {
    id: "met_node_2",
    serverNode: "Secure Key Manager Node - IAM Guardrail",
    cpuLoad: 12.8,
    memoryUsage: 45.4,
    apiLatencyMs: 12,
    activeSockets: 1105,
    status: "Nominal"
  },
  {
    id: "met_node_3",
    serverNode: "IoT Telemetry Streaming Kinesis Cluster",
    cpuLoad: 78.4,
    memoryUsage: 84.6,
    apiLatencyMs: 95,
    activeSockets: 14200,
    status: "Nominal"
  }
];

// =========================================================================
//                  ENTERPRISE ARCHITECTURE DOCUMENTATION BLOCKS
// =========================================================================

export const ARCHITECTURE_BLOCKS = {
  highLevel: {
    title: "Enterprise Multi-Tenant SaaS High-Level System Architecture",
    description: `AEPMA leverages a modern, serverless-first, securely partitioned multi-tenant SaaS architecture designed in alignment with the AWS Well-Architected Framework.`,
    markdown: `
### High-Level System Design & Multi-Tenant Partitioning

\`\`\`
                                  +---------------------------------------+
                                  |         Route 53 / CloudFront MDN     |
                                  +---------------------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |    AWS WAF (Web Application Firewall)  |
                                  |   - Anti-DDoS, Rate Limit Thresholds  |
                                  +---------------------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |       REST & IoT WebSocket APIs       |
                                  |        (AWS API Gateway Service)      |
                                  +---------------------------------------+
                                        /                           \\
                 [Tenant JWT Verified] /                             \\ [JWT Claims Authenticated]
                                      v                               v
                       +-----------------------------+ +-------------------------------+
                       |  Compute: AWS Lambda Proxy  | |  Real-Time streams: Kinesis  |
                       |  - Handles Tenant Routing   | |  - High-Speed Sensor Queues  |
                       +-----------------------------+ +-------------------------------+
                          /          |             \\                  |
                         /           |              \\                 v
                        v            v               v      +-------------------------------+
        +------------------+ +-----------------+ +---------+| Lambda Processing Spark Pipes |
        | Metadata / Cache | | Operational RDB | | AI Core |+-------------------------------+
        | DynamoDB Tables  | | RDS PostgreSQL  | | Bedrock |               |
        | - Tenant Isolated| | (Schema-Locked) | | Gemini  |               v
        +------------------+ +-----------------+ +---------++-------------------------------+
                                                            |  TimeSeries: DynamoDB Stream  |
                                                            +-------------------------------+
\`\`\`

### Tenant Isolation Model (Database & Compute Tier Isolation)

1. **Logical Compute Isolation**: All API queries travel via an **AWS API Gateway** backed by modular **AWS Lambda** instances written in TypeScript. Our API Gateway is armed with a **Cognito Custom Authorizer**. Upon receipt of a user JWT, the authorizer decodes custom tenant claims, appending the verified \`tenant_id\` parameter directly into the Lambda context. The Lambda payload handlers are *unable* to query standard storage pools without specifying the compiled authenticated \`tenantId\` value.

2. **Isolated Database Storage Scenarios**:
   - **Operational Transactions (DynamoDB)**: AEPMA uses a single-table architecture for high-speed technician workflows. The primary key structure relies on compound strings: \`Partition Key (PK) = TENANT#<tenant_id>\` and \`Sort Key (SK) = ASSET#<asset_id>\` or \`TICKET#<ticket_id>\`. This achieves total, mathematical IAM-enforced row-level isolation on DynamoDB tables since policies govern that a user can only query keys prefixing their audited Cognito tenant slug.
   - **Relational Analytics & BI (RDS PostgreSQL)**: Implements **Row Level Security (RLS)** which applies policies automatically filtering table queries with current tenant contexts (e.g. \`ALTER TABLE assets ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation_policy ON assets USING (tenant_id = current_setting('app.current_tenant_id'));\`).

3. **Rate Limiting & Tenant Sinking**:
   - Configured via **AWS API Gateway Usage Plans**. Limits are attached to organizations based on billing tier models: Free Trial (50 reqs/sec burst), Professional (500 reqs/sec), and Ultimate Enterprise (unlimited throttled by custom agreements) to prevent noisy-neighbor workloads from exhausting container ingress pipes.
`,
  },

  awsArchitecture: {
    title: "AWS Serverless-First Production Cloud Infrastructure Diagram",
    markdown: `
### Complete AWS Service Blueprint & Groundwork Topology

\`\`\`
                                  +----------------------------------+
                                  |       AWS Route 53 DNS Core      |
                                  +----------------------------------+
                                                   |
                                                   v
                                  +----------------------------------+
                                  |     Amazon CloudFront CDN (SSL)  |
                                  +----------------------------------+
                                                   |
                                                   v
                                  +----------------------------------+
                                  |       AWS Web App Firewall       |
                                  +----------------------------------+
                                                   |
                                                   v
  +--------------------------------------------------------------------------------------------------+
  |                                        AWS API Gateway                                           |
  |         /api/v1 (REST Lambda Controller)       |       /stream (WebSocket IoT Broker)             |
  +--------------------------------------------------------------------------------------------------+
           |                                                      |
           v                                                      v
  +----------------------+                               +------------------------+
  | Cognito Auth Handshake|                               | AWS Kinesis Data Stream |
  | - MFA Verification   |                               | - Buffers millions reqs|
  +----------------------+                               +------------------------+
           |                                                      |
           | [Tenant Identified]                                  v
           v                                             +------------------------+
  +----------------------------------------+             | AWS Lambda IoT Parser |
  |           AWS Lambda Modules           |             +------------------------+
  |   (Auth-Middleware, Tenant-Claim Core) |                      |
  +----------------------------------------+                      |
       /              |           \\                               v
      v               v            v                     +------------------------+
+-----------+   +-----------+ +-----------+              |   Amazon DynamoDB      |
|S3 Buckets |   |Amazon RDS | |AWS Bedrock|              | (Telemetry / Audit Log)|
| (Assets,  |   |PostgreSQL | | - Claude  |              +------------------------+
| QR Codes) |   | (Replica) | | - Gemini  |                       |
+-----------+   +-----------+ +-----------+                       v
                                                         +------------------------+
                                                         |  Amazon EventBridge    |
                                                         |  (PM Recurrence Engine)|
                                                         +------------------------+
                                                                  |
                                                                  v
                                                         +------------------------+
                                                         |  AWS Step Functions   |
                                                         |  - SLA SLA escalations |
                                                         +------------------------+
                                                              /          \\
                                                             v            v
                                                       +-----------+ +------------+
                                                       |  AWS SNS  | |  AWS SES   |
                                                       | (SMS,Push)| |(SMTP Email)|
                                                       +-----------+ +------------+
\`\`\`

### Network Security & VPC Construct Parameters (AWS VPC Framework)

- **VPC Boundaries**: Dual-region infrastructure spanning 3 Availability Zones (AZ) for High Availability (HA).
- **Public Subnets**: Houses application CloudFront origin target nodes, AWS ALB endpoints, NAT Gateways, and internet-facing Bastion infrastructure.
- **Private Subnets**: Compute Layers (AWS Lambda instances attached to VPC interfaces, AWS ECS Fargate tasks) executing under private routing.
- **Isolated Database Subnets**: Houses Multi-AZ Amazon RDS PostgreSQL cluster nodes and Amazon ElastiCache Redis endpoints with no direct public route connections.
- **Encryption Topology**: Active SSL (TLS 1.3) client-to-API-Gateway. Encryption-at-Rest enforced globally across Amazon S3, RDS PostgreSQL instance storage volumes, and DynamoDB tables using dedicated custom **KMS customer-managed keys (CMK)** owned by individual SaaS tenant structures where requested.
- **Secrets Management**: Live service configs, API keys, and database server credentials reside securely inside **AWS Secrets Manager** with Automated Cron Rotation enabled every 30 days. No parameters are exposed in clear text or committed inside repositories.
`,
  },

  dbSchema: {
    markdown: `
### Relational Analytics Schema DDL (PostgreSQL Blueprint)

Used for complex historical asset performance calculations, MTTR/MTBF tracking, department performance statistics, and accounting procedures.

\`\`\`sql
-- Enable UUID generator extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenant Organizations Table Segment
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'Professional',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Granular Users & Profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    cognito_sub VARCHAR(255) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Super Admin', 'Organization Admin', 'Facility Manager', 'Maintenance Manager', 'Technician', 'Supervisor', 'Auditor', 'Viewer')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Assets & Equipment Lifecycle Registry
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Nominal',
    serial_number VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    department VARCHAR(150) NOT NULL,
    purchase_value NUMERIC(12,2) NOT NULL,
    depreciation_rate_pct NUMERIC(5,2) DEFAULT 10.0,
    warranty_expiry DATE,
    vendor_name VARCHAR(255),
    amc_contract_id VARCHAR(150),
    health_score INT DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    utilization_pct INT DEFAULT 0 CHECK (utilization_pct BETWEEN 0 AND 100),
    parent_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    last_maintenance_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_serial UNIQUE(tenant_id, serial_number)
);

-- 4. Preventive Maintenance Schedules & Recurrences
CREATE TABLE maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    recurrence_rule VARCHAR(50) NOT NULL CHECK (recurrence_rule IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual')),
    checklist JSONB NOT NULL, -- list of check points
    assigned_role VARCHAR(50) NOT NULL,
    sla_limit_hours INT NOT NULL DEFAULT 24,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_due_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. Breakdown & Corrective Work Order Tickets
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY')),
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    assignee_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    downtime_minutes INT NOT NULL DEFAULT 0,
    root_cause_analysis TEXT,
    troubleshooting_steps JSONB DEFAULT '[]',
    suggested_spares JSONB DEFAULT '[]',
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Row Level Security (RLS) Configuration Example
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON assets
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM users WHERE cognito_sub = current_setting('request.jwt.claim.sub')));
\`\`\`
`,
  },

  iacCDK: {
    markdown: `
### Infrastructure as Code (AWS CDK - Python/TS Core Example)

Declares standard cloud-native components cleanly, demonstrating how to deploy Serverless API resources dynamically with least-privilege IAM configurations.

\`\`\`typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AepmaServerlessCoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Audit Log & Telemetry Single-Table Construct
    const telemetryTable = new dynamodb.Table(this, 'AepmaTenantSingleTable', {
      partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'entityKey', type: dynamodb.AttributeType.STRING }, // Compounded value (e.g., ASSET#101)
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Keep customer records safe
    });

    // 2. Compute Segment: Main Tenancy Routing Lambda Gateway
    const gatewayHandler = new lambda.Function(this, 'AepmaIngressLambdaRouter', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist/lambda/core'),
      environment: {
        DATABASE_TABLE: telemetryTable.tableName,
        AWS_DEPLOY_ENV: 'Production',
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });

    // 3. Grant Database access to Lambda with Least Privilege
    telemetryTable.grantReadWriteData(gatewayHandler);

    // 4. Secure API Gateway Container Wrapper
    const api = new apigateway.RestApi(this, 'AepmaRestApiGate', {
      restApiName: 'Enterprise AI Preventative Maintenance API Core',
      description: 'API proxy route securing multi-tenant hospital/logistics workloads.',
      deployOptions: {
         stageName: 'v1',
         loggingLevel: apigateway.MethodLoggingLevel.INFO,
         dataTraceEnabled: true,
      },
      defaultCorsPreflightOptions: {
         allowOrigins: apigateway.Cors.ALL_ORIGINS,
         allowMethods: apigateway.Cors.ALL_METHODS,
      }
    });

    // Define Integration Proxy Target
    const routerIntegration = new apigateway.LambdaIntegration(gatewayHandler);
    api.root.addMethod('ANY', routerIntegration); // Master proxy funnel

    // Secure endpoint Resource
    const securedResource = api.root.addResource('metrics');
    securedResource.addMethod('GET', routerIntegration);
  }
}
\`\`\`
`,
  },

  cicdWorkflow: {
    markdown: `
### Automated CI/CD Lifecycle Pipeline (GitHub Actions Workspace YAML)

Handles continuous security inspection (SonarQube/OWASP Dependency Check), lint verification, unit testing, Docker image building, and serverless terraform/CDK deployment securely.

\`\`\`yaml
name: Enterprise Enterprise Deploy Pipeline (Prod Guard)

on:
  push:
    branches: [ "main" ]

permissions:
  id-token: write # Mandatory for secure OpenID Connect AWS connection
  contents: read

jobs:
  static-security-scan:
    name: OWASP Linter and Vulnerability Verification
    runs-on: ubuntu-latest
    steps:
      - name: Code Extraction
        uses: actions/checkout@v4

      - name: Setup Node Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Secure Dependencies
        run: npm ci

      - name: Check Static Lints & Compile
        run: npm run lint

      - name: OWASP Snyk Dependency Inspection Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_AUTH_TOKEN }}

  compile-and-deploy:
    name: Bundling & AWS Cloud Assembly Deployment
    needs: [ static-security-scan ]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code Repository
        uses: actions/checkout@v4

      - name: Configure AWS Cloud Auth Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v3
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GithubActionsOIDCDeployRole
          aws-region: us-east-1

      - name: Serverless Transpiling
        run: |
          npm install
          npm run build

      - name: AWS CDK Deployment Hook
        run: |
          npx aws-cdk deploy --require-approval never
\`\`\`
`,
  },

  rbacMatrix: {
    markdown: `
### RBAC (Role-Based Access Control) Fine-Grained Authorization Matrix

The security platform acts under a strict zero-trust identity layer. Standard capabilities mapped per functional identity:

| RBAC Role | Tenants & Billing | Asset Hierarchy | Scheduled PMs | Create Work Orders | Close Tickets | Direct AI Diagnostics | View Audit Logs |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Super Admin** | Full (All) | Full (All) | Full (All) | Write | Write | Yes | Full (Universal) |
| **Organization Admin**| Self Tenant Only | Self (Full) | Self (Full) | Write | Write | Yes | Tenant Specific |
| **Facility Manager** | No | Self (Full) | Self (Full) | Write | Write | Yes | Tenant Specific |
| **Maintenance Manager**| No | Read / Modify | Self (Full) | Write | Write | Yes | Tenant Specific |
| **Technician** | No | Read Only | Execute Check | Write | Self Assign | Yes (SOP/Diagnosis) | No |
| **Supervisor** | No | Read Only | Read Only | Write | Verify & Close | Yes | No |
| **Auditor** | No | Read Only | Read for Compliance| No | No | Yes (Reports Only) | Full Read Only |
| **Viewer** | No | Read Only | Read Only | No | No | Chat Only | No |

### Security Verification Details (SaaS Tenant-Secure Isolation Rules)
- **Token Claims**: Access Tokens must contain mapping assertions \`custom:tenant_id\` and \`custom:role_rank\`.
- **API Guardrails**: Checked on entry points via API Gateway Lambda authorization interceptors. All database queries automatically format their keys/WHERE clauses using these JWT-supplied fields, totally mitigating cross-tenant unauthorized extraction failures.
`,
  },

  disasterRecovery: {
    markdown: `
### AWS High Availability & Disaster Recovery (DR) Strategy

AEPMA prioritizes standard uptime rules and maintains regulatory compliance frameworks required across the hospital, pharmaceutical, and logistics divisions.

1. **RTO & RPO Threshold Requirements**:
   - **Recovery Time Objective (RTO)**: **< 15 Minutes** (Full Failover recovery timeline)
   - **Recovery Point Objective (RPO)**: **< 5 Seconds** (Data replication timeline latency gaps)

2. **Active-Active Cross-Region Multi-Site Topology**:
   - The operational application serves traffic concurrently from **us-east-1 (Primary)** and **us-west-2 (Hot Standby)**. Route 53 Multi-Value and Latency-Based routing direct user endpoints.
   - **Amazon Aurora Global Database**: Database clusters span both regions with cross-region physical storage engine replication operating asynchronously under sub-second latency targets.
   - **AWS DynamoDB Global Tables**: Multi-region tables enable regional writes while standard automatic consolidation replicates items symmetrically across selected areas.

3. **Hourly Automated Snapshots & Restoration Checkpoints**:
   - **AWS Backup**: Manages hourly incremental encrypted snapshot plans of RDS databases and DynamoDB operational registries. Snapshots are stored inside air-gapped secure **AWS Backup Vaults** protected by secure worm lock policies (prevention from modifications or deletes).
   - Monthly simulated drills execute automated restoration cycles onto specialized staging units to audit integrity scores.
`,
  },

  awsServicesMapping: {
    markdown: `
### Core AWS Service Inventory Matrix

How individual SaaS features map to cloud-native AWS capabilities:

| Functional SaaS Area | Chosen AWS Service | Engineering Rationale / AWS Framework Alignment |
| :--- | :--- | :--- |
| **Multi-Tenancy Auth** | **AWS Cognito** | Multi-tenant user pools, custom attributes for tenant IDs, password policies, automated MFA, and federated identity loops. |
| **Client-Side Edge CDN** | **Amazon CloudFront** | Distributes compiled React artifacts with safe low-latency caching, armed with custom SSL certificates. |
| **Boundary Protection**| **AWS WAF** | Web-vulnerabilities block (SQLi, XSS, automated brute force bots, rate limit barriers). |
| **API Load-Ingress** | **AWS API Gateway** | Managed execution of REST routes and IoT websocket connections. Attached to custom Lambda authorizers. |
| **Serverless Compute** | **AWS Lambda** | Scales compute execution from zero to high peaks on pay-per-use billing models. Configured inside secure subnets. |
| **Event Scheduling** | **Amazon EventBridge** | Managed event backbone. Automates bimonthly/weekly cron rules to check schedule timelines. |
| **Workflow State ML** | **AWS Step Functions** | Coordinates SLA ticket escalations, multi-stage technician assignments, and alert failures. |
| **Static Document Stash**| **Amazon S3** | Encrypted object container stashing asset images, technician photo proofs, and QR code decals. |
| **Operational NoSQL** | **Amazon DynamoDB** | Single-table index layout handles sub-second high-load real-time sensor streams and telemetry values. |
| **Relational BI Analytics**| **Amazon RDS PostgreSQL** | Relational analytics querying, asset depreciation formulas, cost reporting with Multi-AZ replica failover. |
| **Notification Engine** | **AWS SNS & SES** | SNS pushes app notifications, SMS alerts; SES dispatches PDF executive audit reports and contract expiry. |
| **Generative AI core** | **AWS Bedrock / Gemini** | Fast text analysis, failure telemetry risk predictions, root-causes, voice transcript parsing. |
`
  }
};
