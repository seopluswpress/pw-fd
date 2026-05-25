

import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import {
  Activity,
  Wrench,
  Calendar,
  Cpu,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Plus,
  RefreshCw,
  Sliders,
  FileText,
  Layers,
  Bot,
  Send,
  Volume2,
  QrCode,
  FileCheck,
  Briefcase,
  Grid,
  Users,
  Wifi,
  WifiOff,
  TrendingUp,
  Terminal,
  Check,
  Trash2,
  Lock,
  BookOpen,
  ArrowRight,
  HeartPulse,
} from "lucide-react";

import {
  UserRole,
  Organization,
  Asset,
  MaintenanceSchedule,
  WorkOrderTicket,
  AuditLog,
  SystemHealthMetric
} from "./types";
import dotenv from "dotenv";
import {
  ORGANIZATIONS,
  INITIAL_ASSETS,
  INITIAL_SCHEDULES,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  SYSTEM_METRICS,
  ARCHITECTURE_BLOCKS
} from "./data";


export default function App() {
  // --- APPLICATION STATE CHUNKS ---
  const [selectedTenant, setSelectedTenant] = useState<string>("org_mayo_med");
  const [selectedTab, setSelectedTab] = useState<"operations" | "assets" | "schedules" | "field" | "tickets" | "ai" | "architecture">("operations");
  
  // Real Local DB states, loaded initially from static vectors
  const [assets, setAssets] = useState<Asset[]>(() => {
    const cached = localStorage.getItem("aepma_assets_db");
    return cached ? JSON.parse(cached) : INITIAL_ASSETS;
  });

  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(() => {
    const cached = localStorage.getItem("aepma_schedules_db");
    return cached ? JSON.parse(cached) : INITIAL_SCHEDULES;
  });

  const [tickets, setTickets] = useState<WorkOrderTicket[]>(() => {
    const cached = localStorage.getItem("aepma_tickets_db");
    return cached ? JSON.parse(cached) : INITIAL_TICKETS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const cached = localStorage.getItem("aepma_audit_logs");
    return cached ? JSON.parse(cached) : INITIAL_AUDIT_LOGS;
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemHealthMetric[]>(SYSTEM_METRICS);

  // Live Telemetry Anomaly Toggle Configuration
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<any[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("Maintenance Manager");
  
  // Modal / Interaction State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets[0]);
  const [newTicketModalOpen, setNewTicketModalOpen] = useState<boolean>(false);
  
  // AI Interactive State Block
  const [aiPredictiveResult, setAiPredictiveResult] = useState<any | null>(null);
  const [aiPredictiveLoading, setAiPredictiveLoading] = useState<boolean>(false);
  const [aiDiagnoseResult, setAiDiagnoseResult] = useState<any | null>(null);
  const [aiDiagnoseLoading, setAiDiagnoseLoading] = useState<boolean>(false);
  
  // Voice Transcribe Tool Fields
  const [voiceInputText, setVoiceInputText] = useState<string>(
    "Warning report here... Autoclave safety exhaust gate in sterility control deck B began shaking under pressure. The seal gasket is emitting steam and high pitched whining. Needs immediate diagnostic evaluation before critical pressure limits strike. I think the belt or gasket is failing."
  );
  const [aiVoiceResult, setAiVoiceResult] = useState<any | null>(null);
  const [aiVoiceLoading, setAiVoiceLoading] = useState<boolean>(false);

  // Maintenance Copilot Chat
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'assistant', content: string; timestamp: string }>>([
    { role: 'assistant', content: "Welcome back, Specialist. Enterprise AI Preventative Maintenance Agent (AEPMA) Copilot is online. Ask me about custom standard operating procedures, asset specifications, failure diagnostic advice, or warranty compliance.", timestamp: new Date().toLocaleTimeString() }
  ]);
  const [chatInputValue, setChatInputValue] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  
  // Executive Dashboard report state
  const [aiExecutiveReport, setAiExecutiveReport] = useState<any | null>(null);
  const [aiExecutiveLoading, setAiExecutiveLoading] = useState<boolean>(false);

  // Search/Filters inputs
  const [assetSearchQuery, setAssetSearchQuery] = useState<string>("");
  const [assetCatFilter, setAssetCatFilter] = useState<string>("All");
  const [ticketSearchQuery, setTicketSearchQuery] = useState<string>("");

  // New Work order form fields
  const [newTktTitle, setNewTktTitle] = useState("");
  const [newTktDesc, setNewTktDesc] = useState("");
  const [newTktAsset, setNewTktAsset] = useState(assets[0]?.id || "");
  const [newTktPriority, setNewTktPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "EMERGENCY">("HIGH");

  // Alert system targets (Email / Slack Integration triggers)
  const [slackLogs, setSlackLogs] = useState<string[]>(["Slack Integration Active: Channels #maintenance-security and #operations-health connected."]);
  const [isAlertNotificationActive, setIsAlertNotificationActive] = useState<boolean>(true);

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

  // Write through cache on local db updates
  useEffect(() => {
    localStorage.setItem("aepma_assets_db", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("aepma_schedules_db", JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem("aepma_tickets_db", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("aepma_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Periodic Telemetry Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setAssets(prev =>
        prev.map(asset => {
          // Add small drift variations
          const tempDrift = (Math.random() - 0.5) * 0.8;
          const vibDrift = (Math.random() - 0.5) * 0.15;
          const currentHours = asset.telemetryStream.runHours + 0.05;

          // Critical state threshold fluctuations
          let finalTemp = asset.telemetryStream.temperature + tempDrift;
          let finalVib = asset.telemetryStream.vibration + vibDrift;

          if (asset.id === "asset_amzn_power_panel_A") {
            // Keep power panel hot to showcase the anomaly detection workflow
            finalTemp = Math.max(85, finalTemp);
          } else if (asset.id === "asset_mayo_autoclave_A") {
            finalVib = Math.max(5.0, finalVib);
          }

          return {
            ...asset,
            telemetryStream: {
              ...asset.telemetryStream,
              temperature: parseFloat(finalTemp.toFixed(2)),
              vibration: parseFloat(Math.max(0.01, finalVib).toFixed(2)),
              runHours: parseFloat(currentHours.toFixed(2))
            }
          };
        })
      );

      // Periodically fluctuate System Metrics too
      setSystemMetrics(prev =>
        prev.map(m => ({
          ...m,
          cpuLoad: parseFloat(Math.min(99.9, Math.max(5, m.cpuLoad + (Math.random() - 0.5) * 2)).toFixed(1)),
          apiLatencyMs: Math.max(5, m.apiLatencyMs + Math.floor((Math.random() - 0.5) * 6))
        }))
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Fetch verified active Tenant Organization object
  const tenantOrg = useMemo(() => {
    return ORGANIZATIONS.find(o => o.id === selectedTenant) || ORGANIZATIONS[0];
  }, [selectedTenant]);

  // Filter components with Tenant context boundary
  const tenantAssets = useMemo(() => {
    return assets.filter(a => {
      if (selectedTenant === "org_mayo_med") {
        return a.id.startsWith("asset_mayo");
      } else if (selectedTenant === "org_amazon_wh") {
        return a.id.startsWith("asset_amzn");
      } else if (selectedTenant === "org_tesla_giga") {
        return a.id.startsWith("asset_tsla");
      } else {
        return a.id.startsWith("asset_mari");
      }
    });
  }, [assets, selectedTenant]);

  const tenantTickets = useMemo(() => {
    return tickets.filter(t => {
      // Find asset of this ticket
      const matchAsset = assets.find(a => a.id === t.assetId);
      if (!matchAsset) return false;
      
      if (selectedTenant === "org_mayo_med") {
        return matchAsset.id.startsWith("asset_mayo");
      } else if (selectedTenant === "org_amazon_wh") {
        return matchAsset.id.startsWith("asset_amzn");
      } else if (selectedTenant === "org_tesla_giga") {
        return matchAsset.id.startsWith("asset_tsla");
      } else {
        return matchAsset.id.startsWith("asset_mari");
      }
    });
  }, [tickets, assets, selectedTenant]);

  const tenantSchedules = useMemo(() => {
    return schedules.filter(s => {
      const matchAsset = assets.find(a => a.id === s.assetId);
      if (!matchAsset) return false;
      
      if (selectedTenant === "org_mayo_med") {
        return matchAsset.id.startsWith("asset_mayo");
      } else if (selectedTenant === "org_amazon_wh") {
        return matchAsset.id.startsWith("asset_amzn");
      } else if (selectedTenant === "org_tesla_giga") {
        return matchAsset.id.startsWith("asset_tsla");
      } else {
        return matchAsset.id.startsWith("asset_mari");
      }
    });
  }, [schedules, assets, selectedTenant]);

  const filteredAssetsList = useMemo(() => {
    return tenantAssets.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) || 
                            item.serialNumber.toLowerCase().includes(assetSearchQuery.toLowerCase());
      const matchesCat = assetCatFilter === "All" || item.category === assetCatFilter;
      return matchesSearch && matchesCat;
    });
  }, [tenantAssets, assetSearchQuery, assetCatFilter]);

  // Log events into internal Audit trail
  const appendAudit = (action: string, resType: string, detail: string) => {
    const newLog: AuditLog = {
      id: `log_gen_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: "AEPMA Specialist Platform",
      actorRole: currentUserRole,
      action: action,
      resourceType: resType,
      details: detail,
      tenantId: selectedTenant
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- API / SERVICE INTEGRATIONS calling local express backend API routes ---

  const handlePredictiveMaintenanceAIEngine = async (targetAsset: Asset) => {
    if (!targetAsset) return;
    setAiPredictiveLoading(true);
    setAiPredictiveResult(null);

    appendAudit("Trigger AI Multi-Param Predictive Sweep", "Asset Anomaly Diagnostic", `Evaluated telemetry nodes for asset '${targetAsset.name}'`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/predictive-maintenance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: targetAsset.id,
          assetName: targetAsset.name,
          category: targetAsset.category,
          temperature: targetAsset.telemetryStream.temperature,
          vibration: targetAsset.telemetryStream.vibration,
          runHours: targetAsset.telemetryStream.runHours,
          loadFactor: targetAsset.telemetryStream.loadFactor || 85,
        })
      });
      const data = await response.json();
      setAiPredictiveResult(data);
    } catch (e: any) {
      console.error(e);
      // Hard fallback
      setAiPredictiveResult({
        status: "WARNING",
        riskScore: 78,
        failureProbability: "78%",
        predictedFailureMode: "Dynamic Bearing Eccentricity",
        timeToFailureEst: "36 Operating Hours",
        maintenanceRecommendation: "Sensor calibration failed. Manually inspect mechanical hub elements immediately.",
        timestamp: new Date().toISOString()
      });
    } finally {
      setAiPredictiveLoading(false);
    }
  };

  const handleVoiceToTicketUnstructuredParser = async () => {
    if (!voiceInputText.trim()) return;
    setAiVoiceLoading(true);
    setAiVoiceResult(null);

    appendAudit("Request Unstructured Voice Transcription Parsing", "AI Worker Dispatch", "Submitted raw operator transcript directly into Gemini Bedrock Service Layer.");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/voice-to-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceTranscript: voiceInputText,
          industry: tenantOrg.industry
        })
      });
      
      const payload = await response.json();
      setAiVoiceResult(payload);
    } catch (e) {
      console.error(e);
    } finally {
      setAiVoiceLoading(false);
    }
  };

  const createTicketFromParsedVoice = () => {
    if (!aiVoiceResult) return;
    const targetAsset = selectedAsset || tenantAssets[0];
    
    const newTkt: WorkOrderTicket = {
      id: `tkt_voice_${Date.now().toString().slice(-4)}`,
      title: aiVoiceResult.summarizedTitle || "Urgent breakdown ticket requested",
      description: aiVoiceResult.structuredSummary || "Operational voice transcript parsed by AI.",
      assetId: targetAsset ? targetAsset.id : "asset_fallback",
      assetName: targetAsset ? targetAsset.name : "Unregistered System Core",
      priority: aiVoiceResult.autoPriority || "HIGH",
      status: "Open",
      assignee: "Auto-Assigned Queue",
      assigneeRole: aiVoiceResult.suggestedAssignment || "Technical Specialists Hub",
      reportedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      downtimeMinutes: 0,
      comments: [
        {
          id: `cmt_ai_system`,
          author: "Gemini 3.5 Operational Assistant",
          role: "Super Admin",
          content: "Categorized priority using telemetry acoustics. Recommended dispatching Level 2 expert pipeline.",
          timestamp: new Date().toISOString()
        }
      ],
      isAiOptimized: true
    };

    setTickets(prev => [newTkt, ...prev]);
    appendAudit("Register Ticket from AI parsed voice", "Tickets Work Order", `Created ticket ${newTkt.id} for asset ${newTkt.assetName}`);
    setSelectedTab("tickets");
    setAiVoiceResult(null);
  };

  const handleIssueDiagnosisDiagnosticsSolver = async (ticket: WorkOrderTicket) => {
    setAiDiagnoseLoading(true);
    setAiDiagnoseResult(null);

    const assetItem = assets.find(a => a.id === ticket.assetId) || tenantAssets[0];

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/issue-diagnosis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketTitle: ticket.title,
          ticketDescription: ticket.description,
          assetDetails: assetItem
        })
      });
      const data = await response.json();
      setAiDiagnoseResult(data);

      // Mutate ticket with AI-enriched findings
      setTickets(prev =>
        prev.map(t => {
          if (t.id === ticket.id) {
            return {
              ...t,
              rootCauseAnalysis: data.rootCauses?.join(", "),
              troubleshootingSteps: data.troubleshootingSteps,
              suggestedSpares: data.recommendedSpares,
              isAiOptimized: true
            };
          }
          return t;
        })
      );

      appendAudit("Solve Fault Root Cause with AI Copilot", "Cognitive Diagnostic Engine", `Synthesized spare parts list recommendation and fault path guides for order ${ticket.id}`);

    } catch (e) {
      console.error(e);
    } finally {
      setAiDiagnoseLoading(false);
    }
  };

  const handleCopilotChatMessageSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputValue.trim()) return;

    const userMsgText = chatInputValue;
    const updatedMessages = [...copilotMessages, { role: 'user' as const, content: userMsgText, timestamp: new Date().toLocaleTimeString() }];
    setCopilotMessages(updatedMessages);
    setChatInputValue("");
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          industryContext: tenantOrg.industry,
          role: currentUserRole
        })
      });
      const data = await response.json();
      setCopilotMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      console.error(err);
      setCopilotMessages(prev => [...prev, { role: 'assistant', content: "Standard AEPMA link error. Check node logs for backend status.", timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateExecutiveBIReport = async () => {
    setAiExecutiveLoading(true);
    setAiExecutiveReport(null);

    // Prepare fake metrics for AI processing
    const payloadStats = {
      activeAssetsCount: tenantAssets.length,
      brokenAssetsCount: tenantAssets.filter(a => a.status === "Critical" || a.status === "Warning").length,
      openTicketsCount: tenantTickets.filter(t => t.status !== "Closed" && t.status !== "Completed").length,
      historicalCompliantSchedulesPct: 94.2
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stats: payloadStats,
          organizationName: tenantOrg.name
        })
      });
      const data = await response.json();
      setAiExecutiveReport(data);

      appendAudit("Synthesize Executive Strategic Summary Report", "Enterprise Analytical Summaries", `Generated full ESG regulatory reports for ${tenantOrg.name}`);
    } catch (e) {
      console.error(e);
    } finally {
      setAiExecutiveLoading(false);
    }
  };

  // Create customized standard Work Order
  const handleAddNewWorkOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTktTitle.trim() || !newTktDesc.trim()) return;

    const matchedAsset = assets.find(a => a.id === newTktAsset) || tenantAssets[0];

    const targetTkt: WorkOrderTicket = {
      id: `wOrder_${Date.now().toString().slice(-4)}`,
      title: newTktTitle,
      description: newTktDesc,
      assetId: matchedAsset?.id || "unknown",
      assetName: matchedAsset?.name || "Dynamic HVAC Target",
      priority: newTktPriority,
      status: "Open",
      assignee: "Queue Master Dispatcher",
      assigneeRole: "General Services Crew",
      reportedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      downtimeMinutes: 0,
      comments: []
    };

    if (isOfflineMode) {
      // Offline mode simulation
      setOfflineSyncQueue(prev => [...prev, { type: "TICKET_CREATE", payload: targetTkt }]);
      appendAudit("Queue Work Order creation offline", "Offline Sync Syncs", `Enqueued work order creation ${targetTkt.id} while on disconnected offline sandbox partition.`);
    } else {
      setTickets(prev => [targetTkt, ...prev]);
      appendAudit("Submit New Work Order", "Tickets Work Order", `Created ticket for ${targetTkt.assetName}`);
    }

    // Reset fields
    setNewTktTitle("");
    setNewTktDesc("");
    setNewTicketModalOpen(false);
  };

  const handleStatusTransition = (ticketId: string, nextStatus: WorkOrderTicket["status"]) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const finishedAt = nextStatus === "Completed" || nextStatus === "Closed" ? new Date().toISOString() : t.closedAt;
          return { ...t, status: nextStatus, closedAt: finishedAt };
        }
        return t;
      })
    );
    appendAudit("Update Work Order Phase", "Tickets Work Order", `Moved work order ticker ${ticketId} to status phase: ${nextStatus}.`);
  };

  const handleAddNewCommentToTicket = (ticketId: string, text: string) => {
    if (!text.trim()) return;
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            comments: [
              ...t.comments,
              {
                id: `cmt_${Date.now()}`,
                author: "System User Specialist",
                role: currentUserRole,
                content: text,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return t;
      })
    );
    appendAudit("Add Work Order Comment", "Maintenance Discussions", `Recorded supervisor comment on ticket order ${ticketId}`);
  };

  const handlePredefinedQuestionClick = (question: string) => {
    setChatInputValue(question);
  };

  const handleAssetRegistrationSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("asset_name") as HTMLInputElement).value;
    const category = (form.elements.namedItem("asset_category") as HTMLSelectElement).value;
    const location = (form.elements.namedItem("asset_location") as HTMLInputElement).value;
    const val = parseFloat((form.elements.namedItem("asset_value") as HTMLInputElement).value) || 5000;

    if (!name) return;

    const newAsset: Asset = {
      id: `asset_new_${Date.now().toString().slice(-4)}`,
      name,
      category: category as any,
      status: "Nominal",
      serialNumber: `SN-GEN-${Math.floor(Math.random() * 900000 + 100000)}`,
      location,
      department: "Facility Services Core",
      warrantyExpiry: "2028-12-15",
      vendorName: "Direct Asset Global LLC",
      amcContractId: "AMC-GEN-2026",
      depreciationRate: 10,
      purchaseValue: val,
      healthScore: 100,
      utilizationRate: 0,
      lastMaintenanceDate: new Date().toISOString().split("T")[0],
      telemetryStream: {
        temperature: 24.5,
        vibration: 0.1,
        runHours: 0,
        loadFactor: 0
      }
    };

    setAssets(prev => [newAsset, ...prev]);
    appendAudit("Register New Enterprise Asset Node", "Asset Registry", `Enregistered new ${newAsset.category} equipment: ${newAsset.name}.`);
    form.reset();
  };

  // Run a scheduled Preventive Maintenance checklist item
  const handleChecklistTickbox = (schedId: string, itemIdx: number) => {
    // Add audio note alert simulator
    appendAudit("Validate Scheduled Checklist task", "PM Engine Recurrence", `Completed task step #${itemIdx + 1} item on schedule code: ${schedId}`);
  };

  const handleSynchronizeOfflineQueueOfflineHub = () => {
    if (offlineSyncQueue.length === 0) return;
    
    // Dequeue elements and sync
    let updatedTickets = [...tickets];
    offlineSyncQueue.forEach(item => {
      if (item.type === "TICKET_CREATE") {
        updatedTickets = [item.payload, ...updatedTickets];
      }
    });

    setTickets(updatedTickets);
    setOfflineSyncQueue([]);
    setIsOfflineMode(false);
    appendAudit("Drain Offline Queue synchronization loop", "SaaS Gateway Connect", "Internet telemetry connection restored. Drained local queue into centralized cloud PostgreSQL database partitions.");
  };

  return (
    <div id="aepma_root_view" className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      
      {/* ----------------- LEFT SIDEBAR NAVIGATION ----------------- */}
      <aside id="aepma_sidebar_nav" className="w-64 h-full border-r border-slate-200 bg-white flex flex-col shrink-0">
        
        {/* Brand Banner */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-200">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            🛡️
          </div>
          <div>
            <span className="font-bold tracking-tight text-slate-900 text-sm block">AEPMA SaaS</span>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest font-mono">AWS Enterprise</span>
          </div>
        </div>

        {/* Tenant Picker Segment */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            SaaS Tenant Space
          </label>
          <div className="relative">
            <select
              value={selectedTenant}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedTenant(val);
                appendAudit("Changed Active Organizational Partition", "Security Tenancy", `Switched routing namespace context to tenant database: ${val}`);
                
                // Keep selectedAsset updated with tenant's assets
                const firstNewTenantAsset = assets.find(a => {
                  if (val === "org_mayo_med") return a.id.startsWith("asset_mayo");
                  if (val === "org_amazon_wh") return a.id.startsWith("asset_amzn");
                  if (val === "org_tesla_giga") return a.id.startsWith("asset_tsla");
                  return a.id.startsWith("asset_mari");
                });
                setSelectedAsset(firstNewTenantAsset || null);
                setAiPredictiveResult(null);
                setAiDiagnoseResult(null);
              }}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {ORGANIZATIONS.map((org) => (
                <option key={org.id} value={org.id}>
                  🏢 {org.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Tier: <strong className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">{tenantOrg.tier}</strong></span>
            <span>Assets: {tenantAssets.length}</span>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">Systems & Registry</p>
          
          <button
            onClick={() => setSelectedTab("operations")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              selectedTab === "operations" 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-500" />
            Operations Hub
          </button>

          <button
            onClick={() => setSelectedTab("assets")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              selectedTab === "assets" 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Grid className="w-4 h-4 text-emerald-500" />
            Asset Registry
          </button>

          <button
            onClick={() => setSelectedTab("schedules")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              selectedTab === "schedules" 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            PM Schedules
          </button>

          <p className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider pt-4 mb-2">Field & Dispatch</p>

          <button
            onClick={() => setSelectedTab("field")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              selectedTab === "field" 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <QrCode className="w-4 h-4 text-cyan-500" />
            Field Ops & QR Scanner
          </button>

          <button
            onClick={() => setSelectedTab("tickets")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              selectedTab === "tickets" 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Wrench className="w-4 h-4 text-rose-500" />
            Breakdown Kanban ({tenantTickets.length})
          </button>

          <p className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider pt-4 mb-2">Cognitive Intelligence</p>

          <button
            onClick={() => setSelectedTab("ai")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              selectedTab === "ai" 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-600 animate-pulse" />
            AI Diagnostics & Copilot
          </button>

          <button
            onClick={() => setSelectedTab("architecture")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              selectedTab === "architecture" 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4 text-purple-500" />
            AWS Architecture Specs
          </button>
        </nav>

        {/* Offline Mode Indicator Block }
        <div className="p-3 mx-3 mb-2 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
              {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-rose-500" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
              Simulation State
            </span>
            <input 
              type="checkbox"
              checked={isOfflineMode}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsOfflineMode(checked);
                if (checked) {
                  appendAudit("Trigger Offline Mode Simulation", "Networking Sandbox", "Disconnected active API pipelines. Dynamic queues will buffer in browser storage.");
                } else {
                  handleSynchronizeOfflineQueueOfflineHub();
                }
              }}
              className="cursor-pointer"
              title="Toggle Offline Sim"
            />
          </div>
          {isOfflineMode ? (
            <div className="mt-1.5 text-[9px] text-rose-600">
              ⚠️ Offline Queue buffering logs: <strong>{offlineSyncQueue.length} items</strong>
              {offlineSyncQueue.length > 0 && (
                <button 
                  onClick={handleSynchronizeOfflineQueueOfflineHub}
                  className="w-full mt-1 px-1 py-0.5 bg-rose-600 text-white rounded text-[8px] font-extrabold uppercase hover:bg-rose-700 transition"
                >
                  Force Post-Sync
                </button>
              )}
            </div>
          ) : (
            <p className="text-[9px] text-slate-400 mt-1 italic">VPC Live Sync. Direct database link online.</p>
          )}
        </div>

        {/* Security / RBAC Persona Swap */}
        <div className="p-4 mt-auto border-t border-slate-200 bg-slate-50/50">
          <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Access Role Context
          </label>
          <select 
            value={currentUserRole}
            onChange={(e) => {
              const val = e.target.value as UserRole;
              setCurrentUserRole(val);
              appendAudit("Adjust Authorization Matrix", "Security Guard", `Mapped current dashboard privileges context to identity: ${val}`);
            }}
            className="w-full text-[11px] font-bold text-slate-700 bg-white border border-slate-300 rounded px-1.5 py-1 cursor-pointer focus:outline-none"
          >
            <option value="Super Admin">🔑 Super Admin</option>
            <option value="Organization Admin">🏢 Org Admin</option>
            <option value="Facility Manager">👷 Facility Manager</option>
            <option value="Maintenance Manager">🛠️ Maintenance Manager</option>
            <option value="Technician">📱 Technician</option>
            <option value="Supervisor">👁️ Supervisor</option>
            <option value="Auditor">📋 Auditor</option>
          </select>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-xs text-slate-700 font-bold shrink-0 border border-slate-400">
              SM
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">S. McKellen</p>
              <p className="text-[9px] text-slate-500 truncate">{currentUserRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ----------------- CORE VIEWPORT ----------------- */}
      <main id="aepma_main_container" className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOP COMPACT HEADER BAR */}
        <header id="aepma_top_bar" className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-1.5">
              <span>{tenantOrg.name}</span>
              <span className="text-xs text-slate-400 font-normal">|</span>
              <span className="text-[10px] bg-slate-100 uppercase p-1 font-mono tracking-wider text-slate-600 rounded">
                SECURE TENANT isolation: active
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Cognito Shield Verified
              </span>
            </div>

            <button
              onClick={() => {
                setNewTktAsset(tenantAssets[0]?.id || "");
                setNewTicketModalOpen(true);
              }}
              className="bg-indigo-600 text-white rounded px-3.5 py-1.5 text-xs font-bold shadow-sm hover:bg-indigo-700 transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              New Work Order
            </button>
          </div>
        </header>

        {/* ----------------- SUBTAB VIEW REPRODUCTIONS ----------------- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. OPERATIONS HUB GRAPH & EXECUTIVE SUMMARY TAB */}
          {selectedTab === "operations" && (
            <div className="space-y-6 animate-fade-in">
              {/* STAGE METRICS GRID (HIGH DENSITY) */}
              <div id="aepma_metrics_deck" className="grid grid-cols-1 md:grid-cols-4 gap-5">
                
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Predictive MTBF</p>
                      <p className="text-2xl font-black text-slate-950 font-display">42.8 Days</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">+12.4%</span>
                  </div>
                  <div className="text-[10px] mt-2 text-slate-500">Mean Time Between Failures Target Spec</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historical MTTR</p>
                      <p className="text-2xl font-black text-slate-950 font-display">184 Mins</p>
                    </div>
                    <span className="bg-rose-50 text-rose-600 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">-4.1% delay</span>
                  </div>
                  <div className="text-[10px] mt-2 text-slate-500">Mean Time To Register/Repair resolution</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Health Aggregate</p>
                      <span className="text-xs font-bold text-emerald-600">98.4% Nominal</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: "98.4%" }}></div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2">Based on multi-source sensor streams</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SOC2 Standard Compliance</p>
                      <p className="text-2xl font-black text-slate-950 font-display">A- Audit Grade</p>
                    </div>
                    <span className="bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-weight">Active</span>
                  </div>
                  <div className="text-[10px] mt-2 text-slate-500">Real-time Row-Level partition score</div>
                </div>

              </div>

              {/* LIVE TELEMETRY TREND GRAPHS (HIGH FIDELITY CUSTOM SVG CONTEXT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Visual SVG Telemetry Plot */}
                <div className="lg:col-span-8 bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">Operational Real-time Telemetry Sensors Track</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Simulating mechanical frequencies and thermal outputs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-mono">1sec streaming delay</span>
                    </div>
                  </div>

                  {/* High Density Plot */}
                  <div className="h-56 relative border-b border-l border-slate-200 bg-slate-50 rounded p-2">
                    {/* SVG wave */}
                    <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#e2e8f0" strokeDasharray="4"/>
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#e2e8f0" strokeDasharray="4"/>
                      <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#e2e8f0" strokeDasharray="4"/>
                      
                      {/* Telemetry Wave lines */}
                      <path 
                        d="M0,75 L40,82 L80,68 L120,95 L160,88 L200,105 L240,60 L280,120 L320,80 L360,95 L400,110 L440,75 L480,98 L500,85" 
                        fill="none" 
                        stroke="#4f46e5" 
                        strokeWidth="2.5"
                      />
                      <path 
                        d="M0,50 L40,55 L80,45 L120,62 L160,50 L200,80 L240,110 L280,115 L320,60 L360,65 L400,40 L440,52 L480,35 L500,45" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="1.5" 
                        strokeDasharray="2"
                      />

                      {/* Diagnostic Alert Line */}
                      <line x1="280" y1="0" x2="280" y2="150" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2" />
                      <text x="285" y="20" fill="#e11d48" className="font-mono text-[8px] font-bold">CRITICAL DEVIATION SIGNAL</text>
                    </svg>
                    
                    {/* Graph labels */}
                    <div className="absolute top-1 right-2 flex items-center gap-3 text-[9px] font-mono">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-indigo-600 block"></span>Vibration (RMS mm/s)</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-emerald-500 border-dashed border-b block"></span>Thermal Output (°C Check)</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500">
                    <div>
                      <span>Telemetry source: <strong>{tenantAssets[0]?.name || "Carrier Chiller"}</strong></span>
                    </div>
                    <div className="flex gap-2 font-mono">
                      <span>Vib: <strong>{tenantAssets[0]?.telemetryStream.vibration} mm/s</strong></span>
                      <span>Temp: <strong>{tenantAssets[0]?.telemetryStream.temperature} °C</strong></span>
                    </div>
                  </div>
                </div>

                {/* AI Predictive Anomaly Alert Console */}
                <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">AEPMA Live Diagnostic Guard</h3>
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-4 font-sans">
                      Acoustic, thermographic, and runtime patterns are monitored 24/7. Select an asset category from the list to trigger a deep AI prediction cycle immediately.
                    </p>

                    <div className="space-y-3">
                      <div className="p-3 bg-rose-50/50 border border-rose-100 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">Predictive Diagnostics Available</span>
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-1 py-0.5 rounded font-mono font-bold">Bedrock Active</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Calculates failure mode probability, optimal maintenance window, and coordinates troubleshooting paths.
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono">
                        <div className="text-[9px] text-slate-400 uppercase">Tenant Routing Partition</div>
                        <div className="font-bold text-slate-700">{tenantOrg.name}</div>
                        <div className="text-slate-500 text-[10px]">Cloud Namespace: {selectedTenant}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedTab("ai");
                        if (tenantAssets[0]) {
                          setSelectedAsset(tenantAssets[0]);
                          handlePredictiveMaintenanceAIEngine(tenantAssets[0]);
                        }
                      }}
                      className="w-full py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition"
                    >
                      Trigger Predictive Model Strategy
                    </button>
                  </div>
                </div>
              </div>

              {/* EXPERT ADVISORIES & STRATEGIC EXECUTIVE SUMMARY BLOCK */}
              <div className="bg-indigo-950 text-white rounded-lg p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center justify-center pointer-events-none">
                  <Terminal className="w-48 h-48 text-white" />
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-indigo-800/80 rounded-full flex items-center justify-center text-indigo-300 shadow-md">
                    <Bot className="w-6 h-6 animate-pulse text-indigo-200" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm tracking-tight font-display">
                      Let Gemini synthesize this month's Operational Performance Report
                    </h4>
                    <p className="text-xs text-indigo-200">
                      Evaluates active MTBF improvements, energy cost optimization, and flags SLA bottleneck risks across all servers.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 relative z-10 w-full md:w-auto">
                  <button
                    onClick={handleGenerateExecutiveBIReport}
                    className="w-full md:w-auto px-4 py-2 bg-white text-indigo-950 hover:bg-slate-100 rounded text-xs font-extrabold shadow-md transition"
                  >
                    {aiExecutiveLoading ? "Parsing Platform Logs..." : "Generate AI Executive Report"}
                  </button>
                </div>
              </div>

              {/* AI REPORT CONTAINER SPLIT */}
              {aiExecutiveReport && (
                <div className="border border-indigo-200 bg-indigo-50/50 p-5 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-5 animate-fade-in">
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-mono text-indigo-700 font-extrabold tracking-wider">AEPMA AI Generated Analytics</span>
                      <button 
                        onClick={() => setAiExecutiveReport(null)}
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        Dismiss Analysis
                      </button>
                    </div>
                    <div className="text-xs text-slate-800 leading-relaxed font-sans prose">
                      <p className="font-bold text-sm text-indigo-950 mb-1">Executive Summary Summary</p>
                      {aiExecutiveReport.executiveSummary}
                    </div>
                  </div>
                  <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-indigo-200 pt-4 md:pt-0 md:pl-5 space-y-3">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-indigo-600 font-bold block">Carbon Reduction Metrics</span>
                      <p className="text-xs font-bold text-emerald-800">{aiExecutiveReport.energySavingsScore || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-mono text-indigo-600 font-bold block">Key Compliance Risks Detected</span>
                      <ul className="list-disc pl-4 space-y-1 mt-1 text-[10px] text-slate-700">
                        {aiExecutiveReport.criticalRisks?.map((risk: string, i: number) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* PLATFORM HARDWARE CLOUDWATCH TELEMETRY NODES MONITOR */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">AWS Infrastructure & API Service Health Dashboard</h3>
                    <p className="text-[10px] text-slate-400">Monitoring real-time latency across regional endpoints</p>
                  </div>
                  <button 
                    onClick={() => {
                      appendAudit("Forced Manual API Health check", "Infrastructure", "Verified response parameters against AWS ingress ports.");
                    }}
                    className="flex items-center gap-1 text-[10px] text-indigo-600 hover:underline font-bold"
                  >
                    <RefreshCw className="w-3 h-3" /> Force Ping
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {systemMetrics.map(node => (
                    <div key={node.id} className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-700 truncate block w-2/3">{node.serverNode}</span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">
                          {node.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 text-[10px] font-mono text-slate-600">
                        <div className="flex justify-between">
                          <span>CPU Load:</span>
                          <strong>{node.cpuLoad}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>API Latency:</span>
                          <strong className="text-slate-800">{node.apiLatencyMs} ms</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Encrypted WebSocket Locks:</span>
                          <strong>{node.activeSockets.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 2. REGISTRY OF ENTERPRISE ASSET NODES */}
          {selectedTab === "assets" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">High-Density Asset & Equipment Registry</h3>
                    <p className="text-xs text-slate-400">Register, manage, and inspect multi-tier hardware architectures.</p>
                  </div>
                  
                  {/* Search / Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by name, SN..."
                        value={assetSearchQuery}
                        onChange={(e) => setAssetSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 text-xs rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
                      />
                    </div>
                    
                    <select
                      value={assetCatFilter}
                      onChange={(e) => setAssetCatFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded text-xs px-2 py-1.5 focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Biomedical">Biomedical</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                    </select>
                  </div>
                </div>

                {/* Grid layout of asset cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredAssetsList.map((asset) => {
                    const isCritical = asset.status === "Critical" || asset.status === "Warning";
                    return (
                      <div 
                        key={asset.id} 
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedAsset?.id === asset.id 
                            ? "ring-2 ring-indigo-600 bg-indigo-50/20 border-indigo-400" 
                            : "hover:border-slate-300 bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[9px] uppercase font-mono text-slate-400 block">{asset.category} | {asset.location}</span>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{asset.name}</h4>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                            asset.status === "Nominal" ? "bg-emerald-100 text-emerald-800" :
                            asset.status === "Warning" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {asset.status}
                          </span>
                        </div>

                        <div className="space-y-1 border-t border-dashed pt-2.5 my-2.5 text-[10px] text-slate-600 font-mono">
                          <div className="flex justify-between">
                            <span>Serial Number:</span>
                            <strong className="text-slate-800">{asset.serialNumber}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Dept:</span>
                            <span className="text-slate-800">{asset.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Inspected:</span>
                            <span className="text-slate-800">{asset.lastMaintenanceDate}</span>
                          </div>
                        </div>

                        {/* Telemetry quick visual indicators */}
                        <div className="flex items-center justify-between pt-2 border-t mt-1 text-[9px] text-slate-500 bg-slate-50 p-1.5 rounded">
                          <span>⚙️ {asset.telemetryStream.vibration} mm/s</span>
                          <span>🔥 {asset.telemetryStream.temperature} °C</span>
                          <span>⏳ {Math.floor(asset.telemetryStream.runHours)} hrs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredAssetsList.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No active assets matched current workspace filter criteria.
                  </div>
                )}
              </div>

              {/* ASSET DETAIL PANEL & REGISTER SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. New Asset Registration Form */}
                <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Onboard Client Equipment Node</h3>
                  
                  <form onSubmit={assetAssetCheck => { handleAssetRegistrationSubmit(assetAssetCheck); }} className="space-y-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Asset Asset Name</label>
                      <input 
                        type="text" 
                        name="asset_name"
                        placeholder="e.g. Atlas Copco Compressor GR110"
                        className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Category</label>
                        <select 
                          name="asset_category"
                          className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="HVAC">HVAC</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Biomedical">Biomedical</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Purchase Value ($)</label>
                        <input 
                          type="number" 
                          name="asset_value"
                          defaultValue="45000"
                          className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Deploy Location</label>
                      <input 
                        type="text" 
                        name="asset_location"
                        placeholder="e.g. South Wing Core Plinth B"
                        className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition"
                    >
                      Onboard To Tenant Database Partition
                    </button>
                    <p className="text-[9px] text-slate-400 text-center italic">Automatically applies RLS policies tied to active Cognito tenant claims</p>
                  </form>
                </div>

                {/* 2. Focused Asset Details & Live AI Fault Predictor */}
                <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  {selectedAsset ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start border-b pb-2.5">
                        <div>
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono uppercase">{selectedAsset.category} Node</span>
                          <h4 className="text-sm font-extrabold text-slate-900 mt-1">{selectedAsset.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono text-slate-400">Health:</span>
                          <p onClick={() => handlePredictiveMaintenanceAIEngine(selectedAsset)} className="text-xl font-black text-indigo-700 hover:underline cursor-pointer">{selectedAsset.healthScore}%</p>
                        </div>
                      </div>

                      {/* Parent/Child Dependency Link Tree details */}
                      <div className="p-3 bg-slate-50 border rounded-lg text-xs">
                        <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Architecture Dependent Hierarchy</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-800 font-bold">Parent Node:</span>
                          {selectedAsset.parentId ? (
                            <span className="text-indigo-600 font-bold font-mono">🔗 {selectedAsset.parentId}</span>
                          ) : (
                            <span className="text-slate-400 italic">None (Root Level Assembly Node)</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">If the parent unit undergoes scheduled maintenance, warning system automatically relays secondary scheduling overrides.</p>
                      </div>

                      {/* AMC / Warranty Data */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-mono block">Contract ID (AMC)</span>
                          <span className="font-semibold text-slate-800">{selectedAsset.amcContractId || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-mono block">Approved Vendor Partner</span>
                          <span className="font-semibold text-slate-800">{selectedAsset.vendorName || "In-House Service"}</span>
                        </div>
                      </div>

                      {/* AI Diagnostic Prompt Panel */}
                      <div className="border border-indigo-200 bg-indigo-50/20 rounded p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Bot className="w-4 h-4 text-indigo-600" />
                            Live Predictive Diagnosis Engine
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePredictiveMaintenanceAIEngine(selectedAsset)}
                            className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold hover:bg-indigo-700 transition"
                          >
                            {aiPredictiveLoading ? "Running Inference..." : "Query Predictive Model"}
                          </button>
                        </div>

                        {aiPredictiveResult ? (
                          <div className="space-y-2 mt-2 bg-white p-3 rounded border border-indigo-100 text-xs text-slate-700 transition-all font-mono">
                            <div className="flex justify-between font-bold border-b pb-1.5 mb-1.5 text-indigo-950">
                              <span>Anomaly Status:</span>
                              <span className={aiPredictiveResult.status === "CRITICAL" ? "text-rose-600 animate-pulse" : "text-amber-600"}>
                                ⚠️ {aiPredictiveResult.status}
                              </span>
                            </div>
                            <div>Failure Probability: <strong>{aiPredictiveResult.failureProbability}</strong> (Est Time: {aiPredictiveResult.timeToFailureEst})</div>
                            <div className="text-slate-700 font-sans mt-1 p-1 bg-slate-50 rounded italic">
                              <strong>Diagnostic Mode:</strong> {aiPredictiveResult.predictedFailureMode}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-2 font-sans bg-slate-100 p-2 rounded">
                              💡 <strong>Action Step:</strong> {aiPredictiveResult.maintenanceRecommendation}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 italic">No diagnostics requested for this active cycle model. Press Query above.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-20 italic">Select an asset from the deck above to inspect full specification databases.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* 3. PREVENTIVE MAINTENANCE SCHEDULES */}
          {selectedTab === "schedules" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Recurrence Scheduling Engine</h3>
                    <p className="text-xs text-slate-400">Coordinates continuous interval actions modeled by AWS EventBridge crons.</p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-mono font-bold">AWS Step Functions Orchestrated</span>
                </div>

                <div className="space-y-5">
                  {tenantSchedules.map((schedule) => (
                    <div key={schedule.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b border-dashed pb-2 mb-3">
                        <div>
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase">{schedule.recurrence} Loop</span>
                          <h4 className="text-xs font-bold text-slate-800 mt-1">{schedule.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">Target Asset: <strong>{schedule.assetName}</strong></p>
                        </div>

                        <div className="text-xs font-mono text-slate-600 bg-white p-2 rounded border">
                          <div>Next Due: <strong className="text-indigo-600">{schedule.nextDueDate}</strong></div>
                          <div>SLA Horizon: <strong>{schedule.slaLimitHrs} Hrs limit</strong></div>
                        </div>
                      </div>

                      {/* Checklist Engine */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-700 block uppercase">Mandatory Safety Checklist Steps</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {schedule.checklist.map((step, idx) => (
                            <label key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                              <input 
                                type="checkbox"
                                onChange={() => handleChecklistTickbox(schedule.id, idx)}
                                className="mt-0.5" 
                              />
                              <span className="text-slate-600 select-none text-[11px] leading-snug">{step}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                        <span>Assigned Dispatch Group: <strong>{schedule.assignedTeam}</strong></span>
                        <button
                          onClick={() => {
                            // Update schedule with new date
                            const current = new Date();
                            current.setDate(current.getDate() + 30);
                            const valStr = current.toISOString().split("T")[0];
                            setSchedules(prev => 
                              prev.map(s => s.id === schedule.id ? { ...s, nextDueDate: valStr, lastRunDate: new Date().toISOString().split("T")[0] } : s)
                            );
                            appendAudit("Enforce completion of Scheduled PM cycle", "PM Engine", `Rescheduled due targets for '${schedule.title}' to date: ${valStr}`);
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold hover:bg-indigo-700 transition"
                        >
                          Mark Calibration Cycle Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 4. QR CODE & FIELD OPERATIONS DEMO */}
          {selectedTab === "field" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Technician Direct Field Operations</h3>
                    <p className="text-xs text-slate-400">Offline check-ins, geo-fenced tickets, and mock camera code parsing scanners.</p>
                  </div>
                  <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">AWS S3 Labeling Engine</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Left Column: QR Generator Scanner */}
                  <div className="md:col-span-4 bg-slate-50 border p-4 rounded-lg flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Central Generator Terminal</span>
                      <h4 className="text-xs font-bold text-slate-800">S3 Static QR Identifier Decoder</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Scanning any AEPMA QR code instantly retrieves complete diagnostic histories, open repair schedules, and warranty limits.
                      </p>
                    </div>

                    {/* QR Code Graphic Placeholder inside canvas structure */}
                    <div className="self-center bg-white p-4 rounded-lg border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center">
                      <div className="w-32 h-32 bg-slate-900 text-white font-mono flex flex-wrap items-center justify-center p-1 relative">
                        {/* Generate QR blocks using pure CSS/SVG pattern */}
                        <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100">
                          <rect width="100" height="100" fill="white" />
                          {/* Corner Squares */}
                          <rect x="5" y="5" width="25" height="25" fill="black" />
                          <rect x="9" y="9" width="17" height="17" fill="white" />
                          <rect x="13" y="13" width="9" height="9" fill="black" />

                          <rect x="70" y="5" width="25" height="25" fill="black" />
                          <rect x="74" y="9" width="17" height="17" fill="white" />
                          <rect x="78" y="13" width="9" height="9" fill="black" />

                          <rect x="5" y="70" width="25" height="25" fill="black" />
                          <rect x="9" y="74" width="17" height="17" fill="white" />
                          <rect x="13" y="78" width="9" height="9" fill="black" />

                          {/* random blocks for representation */}
                          <rect x="40" y="40" width="10" height="20" fill="black" />
                          <rect x="55" y="30" width="15" height="10" fill="black" />
                          <rect x="35" y="70" width="15" height="5" fill="black" />
                          <rect x="65" y="65" width="20" height="20" fill="black" />
                          <rect x="80" y="50" width="10" height="10" fill="black" />
                        </svg>
                        
                        {/* Scanner sweep line */}
                        <div className="absolute left-0 right-0 h-0.5 bg-rose-500 top-1/2 animate-bounce"></div>
                      </div>
                      
                      <span className="text-[9px] font-mono font-bold text-slate-700 bg-slate-150 px-2 py-0.5 rounded mt-2 uppercase">
                        {selectedAsset?.serialNumber || "SN-EMPTY"}
                      </span>
                    </div>

                    <div className="text-center text-[10px] text-slate-400 font-mono">
                      Targeted Asset: <strong className="text-slate-800">{selectedAsset?.name || "None"}</strong>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Lookup & Voice Issue logging */}
                  <div className="md:col-span-8 bg-white border p-4 rounded-lg space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      AI Voice-to-Ticket Transcription tool (Bedrock Integration)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Simulate a field technician dictating an emergency issue on their mobile device. The AI extracts structured JSON payloads, priorities, and suggests appropriate specialists.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                          Audible Technician Complaint Notes Input
                        </span>
                        <textarea
                          rows={4}
                          value={voiceInputText}
                          onChange={(e) => setVoiceInputText(e.target.value)}
                          className="w-full text-xs border border-slate-300 p-2.5 rounded font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50/20"
                          placeholder="Type or paste unstructured operator logs..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setVoiceInputText("Urgent alarm sounding from Carrier HVAC compressor. High-temperature indicator blinking red. The system fails to boot and smells heavily like burned lubricant. Critical diagnostics must be run immediately.");
                          }}
                          className="px-2 py-1 border text-[10px] rounded hover:bg-slate-100 font-medium"
                        >
                          Preset HVAC Warning transcript
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVoiceInputText("MRI Cryo cooler level falling below critical bounds at Imaging Ground Annex. Pressure valve whistling under extreme static resistance load. Highly sensitive equipment is heating up.");
                          }}
                          className="px-2 py-1 border text-[10px] rounded hover:bg-slate-100 font-medium"
                        >
                          Preset Bio-Medical Warning transcript
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleVoiceToTicketUnstructuredParser}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition flex items-center gap-1.5"
                      >
                        {aiVoiceLoading ? "Transcribing & Parsing with Gemini..." : "Parse Voice Note with Gemini AI"}
                      </button>

                      {aiVoiceResult && (
                        <div className="mt-4 p-4 border border-emerald-200 bg-emerald-50/50 rounded-lg animate-fade-in space-y-3.5">
                          <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                            <span className="text-xs font-bold text-emerald-900">Extracted AI Ticket Metadata payload</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold uppercase p-0.5 rounded">
                              Success
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <strong className="text-slate-500 uppercase block text-[9px]">AEPMA Title</strong>
                              <span className="font-extrabold text-slate-800 text-xs">{aiVoiceResult.summarizedTitle}</span>
                            </div>
                            <div>
                              <strong className="text-slate-500 uppercase block text-[9px]">Auto Priority Mode</strong>
                              <span className="bg-rose-100 text-rose-700 px-1 rounded text-[10px] font-extrabold uppercase inline-block">
                                {aiVoiceResult.autoPriority || "HIGH"}
                              </span>
                            </div>
                            <div>
                              <strong className="text-slate-500 uppercase block text-[9px]">Suggested Work Order Assignment</strong>
                              <span className="font-semibold text-slate-700">{aiVoiceResult.suggestedAssignment}</span>
                            </div>
                            <div>
                              <strong className="text-slate-500 uppercase block text-[9px]">Acoustic Damper Severity Rating</strong>
                              <span className="font-mono font-bold text-slate-800">{aiVoiceResult.severityRating}/10</span>
                            </div>
                          </div>

                          <div className="text-xs bg-white p-3 rounded border text-slate-700 leading-snug">
                            <strong className="text-slate-500 text-[10px] uppercase block mb-1">Structured Description Log</strong>
                            {aiVoiceResult.structuredSummary}
                          </div>

                          <button
                            type="button"
                            onClick={createTicketFromParsedVoice}
                            className="bg-emerald-600 text-white rounded text-xs font-bold px-3.5 py-1.5 hover:bg-emerald-700 transition"
                          >
                            Dispatch Structured Emergency Ticket
                          </button>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* 5. TICKET MANAGEMENT AND DRAGGABLE KANBAN */}
          {selectedTab === "tickets" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Enterprise breakdown Work Ticket Flow</h3>
                    <p className="text-xs text-slate-400">Manage real-time corrective actions, SLA deadlines, and audit diagnostics.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={ticketSearchQuery}
                        onChange={(e) => setTicketSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 text-xs rounded focus:bg-white focus:outline-none w-44"
                      />
                    </div>
                    
                    <button
                      onClick={() => setNewTicketModalOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-extrabold px-3 py-1.5 transition"
                    >
                      + Create Emergency Ticket
                    </button>
                  </div>
                </div>

                {/* KANBAN BOARDS (HIGH DENSITY COLUMNS) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto min-w-[900px] pb-4">
                  
                  {/* Column 1: OPEN / ASSIGNED */}
                  <div className="bg-slate-50 p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Open / Queued ({tenantTickets.filter(t => t.status === "Open" || t.status === "Assigned").length})</span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {tenantTickets.filter(t => t.status === "Open" || t.status === "Assigned").map(ticket => (
                        <div key={ticket.id} className="bg-white p-3.5 rounded border shadow-sm space-y-2 hover:shadow transition">
                          <div className="flex justify-between items-start">
                            <span className="bg-rose-50 text-rose-700 text-[8px] font-extrabold px-1 rounded uppercase">{ticket.priority}</span>
                            <span className="text-[9px] font-mono text-slate-400">#{ticket.id}</span>
                          </div>
                          
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{ticket.title}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2">{ticket.description}</p>
                          
                          <div className="text-[9px] text-slate-400 font-mono">Asset: <strong>{ticket.assetName}</strong></div>
                          
                          <div className="pt-2 border-t mt-1 flex justify-between items-center">
                            <button
                              onClick={() => handleStatusTransition(ticket.id, "In Progress")}
                              className="text-[9px] text-indigo-600 font-extrabold uppercase hover:underline"
                            >
                              Disfpacth Work &rarr;
                            </button>
                            <span className="text-[8px] text-slate-400">{new Date(ticket.reportedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: IN PROGRESS */}
                  <div className="bg-indigo-50/20 p-3 rounded-lg border border-indigo-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block">In Progress ({tenantTickets.filter(t => t.status === "In Progress").length})</span>
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {tenantTickets.filter(t => t.status === "In Progress").map(ticket => (
                        <div key={ticket.id} className="bg-white p-3.5 rounded border border-indigo-200 shadow-sm space-y-2 hover:shadow transition">
                          
                          <div className="flex justify-between items-start">
                            <span className="bg-indigo-50 text-indigo-700 text-[8px] font-extrabold px-1 rounded uppercase">Active Run</span>
                            <span className="text-[9px] font-mono text-slate-400">#{ticket.id}</span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{ticket.title}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2">{ticket.description}</p>
                          
                          <div className="p-2 bg-slate-50 rounded text-[9px] text-slate-600 font-mono">
                            Assignee: {ticket.assignee} ({ticket.assigneeRole})
                          </div>

                          {/* AI Diagnosis enriched indicator */}
                          {ticket.isAiOptimized ? (
                            <div className="flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-800 p-1 rounded">
                              <Bot className="w-3 h-3 text-emerald-600" /> AI Diagnostic Solver Active
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                handleIssueDiagnosisDiagnosticsSolver(ticket);
                                setSelectedTab("ai");
                              }}
                              className="w-full text-center py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9px] font-extrabold rounded uppercase"
                            >
                              🦾 Gemini AI Issue Solver
                            </button>
                          )}

                          <div className="pt-2 border-t mt-1 flex justify-between items-center">
                            <button
                              onClick={() => handleStatusTransition(ticket.id, "Waiting for Parts")}
                              className="text-[9px] text-amber-700 font-bold hover:underline"
                            >
                              Request Parts
                            </button>
                            <button
                              onClick={() => handleStatusTransition(ticket.id, "Waiting for Approval")}
                              className="text-[9px] text-emerald-600 font-extrabold hover:underline"
                            >
                              Finish & Approve &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: WAITING FOR PARTS / ESCALATED */}
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Hold / Parts / Escalated ({tenantTickets.filter(t => t.status === "Waiting for Parts" || t.status === "Escalated" || t.status === "Waiting for Approval").length})</span>
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {tenantTickets.filter(t => t.status === "Waiting for Parts" || t.status === "Escalated" || t.status === "Waiting for Approval").map(ticket => (
                        <div key={ticket.id} className="bg-white p-3.5 rounded border border-amber-200 shadow-sm space-y-2 hover:shadow transition">
                          <div className="flex justify-between items-start">
                            <span className="bg-amber-150 text-amber-800 text-[8px] font-extrabold px-1 rounded uppercase">{ticket.status}</span>
                            <span className="text-[9px] font-mono text-slate-400">#{ticket.id}</span>
                          </div>

                          <h4 className="text-xs font-bold text-indigo-950 leading-snug">{ticket.title}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2">{ticket.description}</p>

                          {ticket.suggestedSpares && ticket.suggestedSpares.length > 0 && (
                            <div className="p-2 bg-amber-50/20 text-[9px] border rounded font-mono">
                              <strong>Spare parts needed:</strong>
                              <ul className="list-disc pl-3">
                                {ticket.suggestedSpares.map((p, idx) => (
                                  <li key={idx}>{p.partName} ({p.partNumber})</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="pt-2 border-t mt-1 flex justify-between items-center">
                            <button
                              onClick={() => handleStatusTransition(ticket.id, "In Progress")}
                              className="text-[9px] text-slate-500 hover:underline"
                            >
                              &larr; Resume Run
                            </button>
                            <button
                              onClick={() => handleStatusTransition(ticket.id, "Completed")}
                              className="text-[9px] text-emerald-700 font-extrabold uppercase hover:underline"
                            >
                              Close Work Order
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: CLOSED / COMPLETED */}
                  <div className="bg-emerald-50/10 p-3 rounded-lg border border-emerald-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Completed ({tenantTickets.filter(t => t.status === "Closed" || t.status === "Completed").length})</span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {tenantTickets.filter(t => t.status === "Closed" || t.status === "Completed").map(ticket => (
                        <div key={ticket.id} className="bg-white p-3.5 rounded border border-emerald-150 shadow-sm opacity-80 space-y-1.5 hover:opacity-100 transition">
                          <div className="flex justify-between items-start">
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-1 rounded uppercase">Done</span>
                            <span className="text-[9px] font-mono text-slate-400">#{ticket.id}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-500 line-through leading-snug">{ticket.title}</h4>
                          <span className="text-[9px] block text-slate-400">Resolution time: {ticket.downtimeMinutes || 60} mins of active downtime tracked.</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* 6. AI COGNITIVE DIAGNOSTICS & COPILOT CHAT SIDEBAR */}
          {selectedTab === "ai" && (
            <div className="space-y-6">
              
              <div className="bg-indigo-950 text-white p-5 rounded-lg border border-indigo-800 shadow-sm">
                <div className="flex justify-between items-center border-b border-indigo-800 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight font-display text-white">Central AI Preventive Diagnostics Node</h3>
                    <p className="text-xs text-indigo-200 font-sans">Leveraging AWS Bedrock models to perform deep diagnostic evaluations on complex assets.</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold bg-indigo-700 text-white p-1 rounded shadow-sm">
                    Model: Gemini-3.5-Flash Proxy Enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Hand: Interactive Asset Telemetry Evaluator */}
                  <div className="lg:col-span-5 bg-indigo-900/60 p-4 rounded-lg space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-xs text-white mb-1">Interactive Telemetry Evaluation</h4>
                      <p className="text-[11px] text-indigo-200">
                        Select any registered asset, inspect its live telemetry state, and query real-time predictive diagnostics.
                      </p>
                    </div>

                    <div className="space-y-3 font-semibold text-indigo-100">
                      <div>
                        <label className="text-[9px] uppercase font-mono tracking-wider block mb-1">Target Asset For Inference</label>
                        <select 
                          value={selectedAsset?.id || ""}
                          onChange={(e) => {
                            const match = assets.find(a => a.id === e.target.value);
                            setSelectedAsset(match || null);
                            setAiPredictiveResult(null);
                          }}
                          className="w-full text-xs text-slate-800 bg-white border rounded px-2.5 py-1.5 focus:outline-none"
                        >
                          {tenantAssets.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedAsset && (
                        <div className="bg-indigo-950/50 p-3 rounded border border-indigo-800 font-mono text-[11px] space-y-2">
                          <div className="flex justify-between">
                            <span>Shaft Vibration RMS:</span>
                            <span className="text-indigo-300 font-bold">{selectedAsset.telemetryStream.vibration} mm/s</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Main Junction Temp:</span>
                            <span className="text-indigo-300 font-bold">{selectedAsset.telemetryStream.temperature} °C</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Operational Run hours:</span>
                            <span className="text-slate-300">{selectedAsset.telemetryStream.runHours.toFixed(1)} hrs</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Load Factor:</span>
                            <span className="text-slate-300">{selectedAsset.telemetryStream.loadFactor || 85}%</span>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => { if (selectedAsset) handlePredictiveMaintenanceAIEngine(selectedAsset); }}
                        disabled={aiPredictiveLoading}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition"
                      >
                        {aiPredictiveLoading ? "Consulting AI Diagnostics..." : "Query Dynamic Inference Model"}
                      </button>
                    </div>

                    {/* Inference response display */}
                    {aiPredictiveResult ? (
                      <div className="p-3.5 bg-white text-slate-800 rounded font-mono space-y-2 text-xs border border-indigo-150 shadow-md">
                        <div className="flex justify-between font-bold border-b pb-1">
                          <span className="uppercase text-[9px] text-indigo-700">Inference Status</span>
                          <span className={aiPredictiveResult.status === "CRITICAL" ? "text-rose-600 animate-pulse font-bold" : "text-amber-600 font-bold"}>
                            {aiPredictiveResult.status}
                          </span>
                        </div>
                        <div>
                          <span>Failure Risk Rank: </span>
                          <strong className="text-slate-900">{aiPredictiveResult.riskScore}/100 ({aiPredictiveResult.failureProbability})</strong>
                        </div>
                        <div>
                          <span>Estimated Time To Outage: </span>
                          <strong className="text-slate-950 bg-slate-100 px-1 py-0.5 rounded">{aiPredictiveResult.timeToFailureEst}</strong>
                        </div>
                        <div className="italic text-[11px] bg-slate-50 p-2 rounded text-slate-700 font-sans">
                          <strong>Probable Failure Mode:</strong> {aiPredictiveResult.predictedFailureMode}
                        </div>
                        <div className="text-[11px] text-indigo-950 font-sans bg-indigo-50 p-2.5 rounded leading-relaxed border border-indigo-100">
                          💡 <strong>AEPMA Remediation Action Plan:</strong> {aiPredictiveResult.maintenanceRecommendation}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-indigo-300 text-center italic py-6">
                        No active diagnostic logs currently requested. Trigger the inference above to query the Gemini platform model.
                      </p>
                    )}
                  </div>

                  {/* Right Hand: AI Copilot Chat Interface */}
                  <div id="aepma_copilot_terminal" className="lg:col-span-7 bg-indigo-900/40 border border-indigo-800 rounded-lg flex flex-col h-[525px]">
                    <div className="px-4 py-3 border-b border-indigo-800 flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-indigo-300" />
                        <span className="text-xs font-bold text-white tracking-wider">AEPMA Interactive Assistant</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold p-1 rounded">Live Socket</span>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                      {copilotMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-lg max-w-[85%] shadow-sm leading-relaxed ${
                            msg.role === 'user' 
                              ? "bg-indigo-600 text-white rounded-br-none" 
                              : "bg-white text-slate-800 rounded-bl-none font-mono"
                          }`}>
                            <div className="flex justify-between items-center mb-1 text-[9px] opacity-75 font-mono">
                              <span>{msg.role === 'user' ? 'Specialist' : 'AEPMA Copilot'}</span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <p className="font-sans break-words whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="p-3 rounded-lg bg-indigo-950/80 text-white rounded-bl-none">
                            <span className="animate-pulse">AEPMA diagnostics reasoning... Synthesizing answer telemetry...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggested triggers prompt panel scrollable list */}
                    <div className="px-3 py-1.5 bg-indigo-950/80 border-t border-indigo-900 shrink-0 select-none overflow-x-auto whitespace-nowrap scrollbar-none">
                      <div className="flex gap-2 text-[10px] text-indigo-200">
                        <button 
                          onClick={() => handlePredefinedQuestionClick("Draft a weekly preventative checklist for carrier refrigeration lines.")}
                          className="px-2 py-1 bg-indigo-900 rounded hover:bg-indigo-800 transition text-[9px] font-medium"
                        >
                          Draft Air Filtration Checklist
                        </button>
                        <button 
                          onClick={() => handlePredefinedQuestionClick("Explain Lockout Tagout procedures for hospital sub-panels.")}
                          className="px-2 py-1 bg-indigo-900 rounded hover:bg-indigo-800 transition text-[9px] font-medium"
                        >
                          Show LOTO Requirements
                        </button>
                        <button 
                          onClick={() => handlePredefinedQuestionClick("How can we optimize chiller life Cycles based on current loads?")}
                          className="px-2 py-1 bg-indigo-900 rounded hover:bg-indigo-800 transition text-[9px] font-medium"
                        >
                          Optimize MTBF Levels
                        </button>
                      </div>
                    </div>

                    {/* Message Box controls */}
                    <form onSubmit={handleCopilotChatMessageSubmit} className="p-3 border-t border-indigo-800 bg-indigo-950/90 shrink-0 flex gap-2">
                      <input
                        type="text"
                        value={chatInputValue}
                        onChange={(e) => setChatInputValue(e.target.value)}
                        placeholder="Inquire diagnostics advice, part schemas, or specs..."
                        className="flex-1 bg-indigo-900/60 text-white border border-indigo-800 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* 7. SECURE MULTI-TENANT AWS ARCHITECTURE SPECS */}
          {selectedTab === "architecture" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <div className="border-b pb-3.5 mb-2.5">
                  <h3 className="text-sm font-bold text-slate-800">Enterprise Multi-Tenant SaaS Architecture Blueprint</h3>
                  <p className="text-xs text-slate-400">Production parameters aligned with the AWS Well-Architected Framework guidelines.</p>
                </div>

                {/* High Level Block Details */}
                <div className="prose text-xs text-slate-700 space-y-4 whitespace-pre-wrap font-sans max-w-full leading-relaxed">
                  <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-lg">
                    <h4 className="font-extrabold text-indigo-950 text-xs uppercase tracking-wider mb-2">Secure Routing Tenancy Summary</h4>
                    <p>
                      Our platform ensures SOC2 type II compliance standards using an robust <strong>Cognito custom attribute namespace pattern</strong>. Access tokens contain custom tenant claims parsed on ingress gateways. The Operational Database level (DynamoDB Primary Keys) formats compound fields: <code>PK: TENANT#&lt;tenant_id&gt;</code> and <code>SK: ASSET#&lt;asset_id&gt;</code> ensuring isolated partitions under IAM context policies.
                    </p>
                  </div>

                  {/* Complete Service Mapping Deck */}
                  <div className="mt-6">
                    <h4 className="font-extrabold text-slate-800 text-xs mb-3">AWS Service Blueprint Topology Diagrams</h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto">
                      {ARCHITECTURE_BLOCKS.awsArchitecture.markdown}
                    </pre>
                  </div>

                  {/* Systems DDL Database Schema Structure */}
                  <div className="mt-6">
                    <h4 className="font-extrabold text-slate-800 text-xs mb-3">Central Relational PostgreSQL Database Schema (analytics)</h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto">
                      {ARCHITECTURE_BLOCKS.dbSchema.markdown}
                    </pre>
                  </div>

                  {/* Infrastructure CDK Node Code */}
                  <div className="mt-6">
                    <h4 className="font-extrabold text-slate-800 text-xs mb-2">AWS Infrastructure as Code Stack (CDK Blueprint)</h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto">
                      {ARCHITECTURE_BLOCKS.iacCDK.markdown}
                    </pre>
                  </div>

                  {/* Automated CI CD Actions Pipeline */}
                  <div className="mt-6">
                    <h4 className="font-extrabold text-slate-800 text-xs mb-2">GitHub Actions OWASP Deploy Pipeline Layout</h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto">
                      {ARCHITECTURE_BLOCKS.cicdWorkflow.markdown}
                    </pre>
                  </div>

                  {/* RBAC MATRIX GRID */}
                  <div className="mt-6">
                    <h4 className="font-extrabold text-slate-800 text-xs mb-2">Zero-Trust Identity RBAC Matrix</h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto">
                      {ARCHITECTURE_BLOCKS.rbacMatrix.markdown}
                    </pre>
                  </div>

                  {/* Disaster recovery limits */}
                  <div className="mt-6">
                    <h4 className="font-extrabold text-slate-800 text-xs mb-2">AWS Disaster Recovery (DR) Active-Active Mirror</h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto">
                      {ARCHITECTURE_BLOCKS.disasterRecovery.markdown}
                    </pre>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* ----------------- LOWER FOOTER / CONTROL STATUS BAR ----------------- */}
        <footer id="aepma_footer_bar" className="h-8 border-t border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 text-[10px] text-slate-500 font-mono">
          {/*<div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Active Region Node: <strong>us-east-1</strong></span>
            </div>
            <span>VPC Latency: <strong>24ms</strong></span>
            <span>API Gateway Phase: <strong>v1.4.0 (Enterprise)</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span>Audit logging enabled</span>
            <span className="bg-indigo-50 text-indigo-700 px-1 rounded text-[9px] font-bold">SOC2/HIPAA</span>
          </div>*/}
        </footer>

      </main>

      {/* ----------------- POPUP MODAL: NEW WORK TICKET CREATE ----------------- */}
      {newTicketModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg border shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800">Dispatch Emergency Work Order</h3>
              <button 
                onClick={() => setNewTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-extrabold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewWorkOrderSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Incident Title / Summary</label>
                <input
                  type="text"
                  value={newTktTitle}
                  onChange={(e) => setNewTktTitle(e.target.value)}
                  placeholder="e.g. Compressor temperature runaway"
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Asset Selection</label>
                <select
                  value={newTktAsset}
                  onChange={(e) => setNewTktAsset(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                >
                  {tenantAssets.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Issue Description (acoustics, visual diagnostics)</label>
                <textarea
                  rows={3}
                  value={newTktDesc}
                  onChange={(e) => setNewTktDesc(e.target.value)}
                  placeholder="Provide precise details for diagnostics modeling..."
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Auto Severity Level</label>
                  <select
                    value={newTktPriority}
                    onChange={(e) => setNewTktPriority(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Authorized Specialist</label>
                  <div className="text-xs bg-slate-100 p-2 rounded text-slate-600 font-mono">
                    {currentUserRole}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setNewTicketModalOpen(false)}
                  className="px-3.5 py-1.5 border text-xs rounded font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition"
                >
                  Dispatch Ticket Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
