import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  FileText,
  History,
  Settings,
  Monitor,
  Eye,
  TrendingUp,
  Zap
} from "lucide-react";

const SOCDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const clients = [
    { id: "1", name: "Acme Corp", status: "active", alerts: 3, assets: 45 },
    { id: "2", name: "TechStart Inc", status: "active", alerts: 1, assets: 23 },
    { id: "3", name: "SecureBank", status: "monitoring", alerts: 0, assets: 89 },
  ];

  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    SOC Command Center
                  </h1>
                  <p className="text-muted-foreground text-sm">Security Operations Dashboard</p>
                </div>
              </div>
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">SA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="container mx-auto px-6 py-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-soc-primary/20 bg-gradient-to-br from-card to-soc-surface">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-soc-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-soc-primary">{clients.length}</div>
                <p className="text-xs text-muted-foreground">Active monitoring</p>
              </CardContent>
            </Card>

            <Card className="border-soc-danger/20 bg-gradient-to-br from-card to-soc-surface">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-soc-danger" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-soc-danger">
                  {clients.reduce((sum, client) => sum + client.alerts, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card className="border-soc-success/20 bg-gradient-to-br from-card to-soc-surface">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Protected Assets</CardTitle>
                <CheckCircle className="h-4 w-4 text-soc-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-soc-success">
                  {clients.reduce((sum, client) => sum + client.assets, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Under monitoring</p>
              </CardContent>
            </Card>

            <Card className="border-soc-accent/20 bg-gradient-to-br from-card to-soc-surface">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Activity className="h-4 w-4 text-soc-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-soc-accent">99.8%</div>
                <p className="text-xs text-muted-foreground">System availability</p>
              </CardContent>
            </Card>
          </div>

          {/* Client Selection */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Clients
              </CardTitle>
              <CardDescription>
                Select a client to access their security workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <Card 
                    key={client.id} 
                    className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:border-primary/50 bg-gradient-surface"
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <Badge 
                          variant={client.status === "active" ? "default" : "secondary"}
                          className={client.status === "active" ? "bg-soc-success" : "bg-soc-warning"}
                        >
                          {client.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Active Alerts</span>
                        <span className={client.alerts > 0 ? "text-soc-danger font-medium" : "text-soc-success"}>
                          {client.alerts}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Protected Assets</span>
                        <span className="text-soc-accent font-medium">{client.assets}</span>
                      </div>
                      <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90">
                        <Eye className="h-4 w-4 mr-2" />
                        Access Workspace
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const selectedClientData = clients.find(c => c.id === selectedClient);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedClient(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Clients
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{selectedClientData?.name}</h1>
                  <p className="text-muted-foreground text-sm">Security Workspace</p>
                </div>
              </div>
            </div>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">SA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Client Workspace */}
      <main className="container mx-auto px-6 py-6">
        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 bg-card border border-border">
            <TabsTrigger value="monitor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Monitor className="h-4 w-4 mr-2" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Server className="h-4 w-4 mr-2" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-soc-primary" />
                    Live Classifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-soc-surface border border-soc-success/20">
                      <div>
                        <div className="font-medium">User Login - Normal</div>
                        <div className="text-sm text-muted-foreground">192.168.1.45 - john.doe@company.com</div>
                      </div>
                      <Badge className="bg-soc-success">True Positive</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-soc-surface border border-soc-danger/20">
                      <div>
                        <div className="font-medium">Suspicious File Access</div>
                        <div className="text-sm text-muted-foreground">10.0.0.23 - system/sensitive/data.db</div>
                      </div>
                      <Badge variant="destructive">False Positive</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-soc-surface border border-soc-warning/20">
                      <div>
                        <div className="font-medium">Network Scan Detected</div>
                        <div className="text-sm text-muted-foreground">External IP: 203.45.67.89</div>
                      </div>
                      <Badge className="bg-soc-warning text-soc-warning-foreground">Review</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-soc-accent" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-soc-surface">
                      <div className="text-sm font-medium text-soc-accent mb-2">System Analysis</div>
                      <div className="text-sm text-muted-foreground">
                        3 anomalies detected in the last hour. Network scan from external IP requires investigation.
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      Open AI Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Asset Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Assets</span>
                    <span className="font-bold text-soc-accent">{selectedClientData?.assets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Online</span>
                    <span className="font-bold text-soc-success">{selectedClientData?.assets - 2}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Offline</span>
                    <span className="font-bold text-soc-danger">2</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Security Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Report generation and audit tools coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Event History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Historical event analysis and search coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SOCDashboard;