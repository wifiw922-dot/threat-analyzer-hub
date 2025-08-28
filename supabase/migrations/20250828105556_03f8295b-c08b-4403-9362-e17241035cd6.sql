-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  settings JSONB DEFAULT '{}'
);

-- Create assets table
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'maintenance')),
  vulnerabilities JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add client_id to logs table (if it doesn't exist)
ALTER TABLE public.logs ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Allow all operations on clients" 
ON public.clients 
FOR ALL 
USING (true);

-- Create policies for assets table
CREATE POLICY "Allow all operations on assets" 
ON public.assets 
FOR ALL 
USING (true);

-- Create policies for logs table (if not exists)
CREATE POLICY "Allow all operations on logs" 
ON public.logs 
FOR ALL 
USING (true);

-- Insert fake data for 1 user and 5 clients
INSERT INTO public.clients (id, name, email, settings) VALUES
  (gen_random_uuid(), 'TechCorp Solutions', 'security@techcorp.com', '{"alert_threshold": "medium", "auto_email": true}'),
  (gen_random_uuid(), 'FinanceSecure Inc', 'soc@financesecure.com', '{"alert_threshold": "high", "auto_email": false}'),
  (gen_random_uuid(), 'HealthGuard Systems', 'alerts@healthguard.com', '{"alert_threshold": "low", "auto_email": true}'),
  (gen_random_uuid(), 'RetailShield Co', 'security@retailshield.com', '{"alert_threshold": "medium", "auto_email": true}'),
  (gen_random_uuid(), 'EduProtect University', 'it-security@eduprotect.edu', '{"alert_threshold": "high", "auto_email": false}');

-- Insert fake assets for each client
WITH client_data AS (
  SELECT id, name FROM public.clients
)
INSERT INTO public.assets (client_id, name, ip_address, status, vulnerabilities)
SELECT 
  c.id,
  asset_name,
  ip_addr,
  status_val,
  vulnerabilities_json
FROM client_data c
CROSS JOIN (
  VALUES 
    ('DC-SERVER-01', '192.168.1.10', 'online', '[{"cve": "CVE-2023-1234", "severity": "high"}]'::jsonb),
    ('WEB-SERVER-02', '192.168.1.20', 'online', '[]'::jsonb),
    ('DB-SERVER-03', '192.168.1.30', 'maintenance', '[{"cve": "CVE-2023-5678", "severity": "medium"}]'::jsonb),
    ('WORKSTATION-04', '192.168.1.40', 'online', '[{"cve": "CVE-2023-9012", "severity": "low"}]'::jsonb),
    ('FIREWALL-01', '192.168.1.1', 'online', '[]'::jsonb)
) AS asset_data(asset_name, ip_addr, status_val, vulnerabilities_json);

-- Insert fake logs for each client
WITH client_data AS (
  SELECT id FROM public.clients
)
INSERT INTO public.logs (
  client_id, timestamp, event_id, event_type, severity, alert_name, alert_category,
  detection_engine, action_taken, process_name, process_path, process_id,
  parent_process_name, parent_process_id, user_name, host_name, host_ip,
  file_name, file_path, file_hash_md5, file_hash_sha256, network_connection,
  source_ip, source_port, destination_ip, destination_port, protocol,
  registry_key, persistence_mechanism, geo_location, mitre_attack_tactic,
  mitre_attack_technique, status, comments, label
)
SELECT 
  c.id,
  now() - (random() * interval '7 days'),
  'EVT-' || floor(random() * 10000)::text,
  log_data.event_type,
  log_data.severity,
  log_data.alert_name,
  log_data.alert_category,
  log_data.detection_engine,
  log_data.action_taken,
  log_data.process_name,
  log_data.process_path,
  log_data.process_id,
  log_data.parent_process_name,
  log_data.parent_process_id,
  log_data.user_name,
  log_data.host_name,
  log_data.host_ip,
  log_data.file_name,
  log_data.file_path,
  log_data.file_hash_md5,
  log_data.file_hash_sha256,
  log_data.network_connection,
  log_data.source_ip,
  log_data.source_port,
  log_data.destination_ip,
  log_data.destination_port,
  log_data.protocol,
  log_data.registry_key,
  log_data.persistence_mechanism,
  log_data.geo_location,
  log_data.mitre_attack_tactic,
  log_data.mitre_attack_technique,
  log_data.status,
  log_data.comments,
  log_data.label
FROM client_data c
CROSS JOIN (
  VALUES 
    ('malware_detection', 'high', 'Suspicious Process Execution', 'malware', 'CrowdStrike', 'quarantined', 'powershell.exe', 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', 1234, 'cmd.exe', 5678, 'SYSTEM', 'DC-SERVER-01', '192.168.1.10', 'malicious.exe', 'C:\\temp\\malicious.exe', 'a1b2c3d4e5f6', 'abc123def456ghi789', true, '10.0.0.100', 443, '192.168.1.10', 80, 'TCP', null, 'registry_persistence', 'US-East', 'Execution', 'T1059.001', 'active', 'Potential malware detected', 'TP'),
    ('network_anomaly', 'medium', 'Unusual Network Traffic', 'network', 'Suricata', 'monitored', null, null, null, null, null, 'user1', 'WEB-SERVER-02', '192.168.1.20', null, null, null, null, true, '203.0.113.1', 22, '192.168.1.20', 22, 'SSH', null, null, 'China', 'Command and Control', 'T1071.001', 'investigating', 'SSH brute force attempt', 'FP'),
    ('file_modification', 'low', 'System File Modified', 'file_integrity', 'OSSEC', 'logged', 'notepad.exe', 'C:\\Windows\\System32\\notepad.exe', 2345, 'explorer.exe', 1111, 'administrator', 'WORKSTATION-04', '192.168.1.40', 'system32.dll', 'C:\\Windows\\System32\\system32.dll', 'f1e2d3c4b5a6', 'fed123cba456789def', false, null, null, null, null, null, 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft', null, 'US-West', 'Defense Evasion', 'T1112', 'resolved', 'Legitimate admin activity', 'TN'),
    ('authentication_failure', 'high', 'Multiple Login Failures', 'authentication', 'Windows Security', 'blocked', 'winlogon.exe', 'C:\\Windows\\System32\\winlogon.exe', 3456, 'services.exe', 444, 'guest', 'DB-SERVER-03', '192.168.1.30', null, null, null, null, false, '198.51.100.5', null, null, null, null, null, null, 'Russia', 'Credential Access', 'T1110.001', 'blocked', 'Account lockout triggered', 'TP'),
    ('process_injection', 'critical', 'Process Hollowing Detected', 'process_behavior', 'Sysmon', 'terminated', 'svchost.exe', 'C:\\Windows\\System32\\svchost.exe', 4567, 'winlogon.exe', 3456, 'SYSTEM', 'FIREWALL-01', '192.168.1.1', 'injected.dll', 'C:\\temp\\injected.dll', 'b2c3d4e5f6a1', 'bcd456efa789123ghi', false, null, null, null, null, null, null, 'process_hollowing', 'Germany', 'Defense Evasion', 'T1055.012', 'contained', 'Advanced threat detected', 'TP')
) AS log_data(event_type, severity, alert_name, alert_category, detection_engine, action_taken, process_name, process_path, process_id, parent_process_name, parent_process_id, user_name, host_name, host_ip, file_name, file_path, file_hash_md5, file_hash_sha256, network_connection, source_ip, source_port, destination_ip, destination_port, protocol, registry_key, persistence_mechanism, geo_location, mitre_attack_tactic, mitre_attack_technique, status, comments, label);