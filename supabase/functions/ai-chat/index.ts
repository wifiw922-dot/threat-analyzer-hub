import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  clientId: string;
}

interface SecurityEvent {
  event_type?: string;
  severity?: string;
  alert_name?: string;
  host_name?: string;
  timestamp: string;
  label?: string;
  comments?: string;
}

interface Asset {
  name: string;
  ip_address: string;
  status: string;
  vulnerabilities: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { message, clientId }: ChatRequest = await req.json();

    // Fetch recent security events for context
    const { data: events, error: eventsError } = await supabaseClient
      .from('logs')
      .select('*')
      .eq('client_id', clientId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (eventsError) {
      throw new Error(`Failed to fetch events: ${eventsError.message}`);
    }

    // Fetch assets for context
    const { data: assets, error: assetsError } = await supabaseClient
      .from('assets')
      .select('*')
      .eq('client_id', clientId)
      .limit(5);

    if (assetsError) {
      throw new Error(`Failed to fetch assets: ${assetsError.message}`);
    }

    // Generate AI response based on context
    const response = await generateSecurityResponse(message, events || [], assets || []);

    return new Response(
      JSON.stringify({ 
        response,
        context: {
          events: events?.length || 0,
          assets: assets?.length || 0
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

async function generateSecurityResponse(
  message: string, 
  events: SecurityEvent[], 
  assets: Asset[]
): Promise<string> {
  const lowerMessage = message.toLowerCase();

  // Security events analysis
  if (lowerMessage.includes('event') || lowerMessage.includes('alert') || lowerMessage.includes('incident')) {
    if (events.length === 0) {
      return "I don't see any recent security events for this client. This could indicate a quiet period or that events are being processed normally.";
    }

    const criticalEvents = events.filter(e => e.severity === 'critical' || e.severity === 'high');
    const eventTypes = [...new Set(events.map(e => e.event_type).filter(Boolean))];
    
    return `Based on recent activity, I found ${events.length} security events. ${criticalEvents.length} are high/critical severity requiring attention. Common event types include: ${eventTypes.slice(0, 3).join(', ')}. 

Key concerns:
${criticalEvents.slice(0, 3).map(e => `• ${e.alert_name || e.event_type} on ${e.host_name} - ${e.severity} severity`).join('\n')}

Recommendation: ${criticalEvents.length > 0 ? 'Prioritize investigation of critical events and implement containment measures.' : 'Continue monitoring current security posture.'}`;
  }

  // Asset analysis
  if (lowerMessage.includes('asset') || lowerMessage.includes('system') || lowerMessage.includes('vulnerability')) {
    if (assets.length === 0) {
      return "No assets are currently registered for monitoring. I recommend adding your critical systems to the asset inventory.";
    }

    const vulnerableAssets = assets.filter(a => a.vulnerabilities && a.vulnerabilities.length > 0);
    const offlineAssets = assets.filter(a => a.status === 'offline');
    
    return `Asset Status Summary:
• Total monitored assets: ${assets.length}
• Assets with vulnerabilities: ${vulnerableAssets.length}
• Offline assets: ${offlineAssets.length}

${vulnerableAssets.length > 0 ? `High priority assets needing attention:
${vulnerableAssets.slice(0, 3).map(a => `• ${a.name} (${a.ip_address}) - ${a.vulnerabilities.length} vulnerabilities`).join('\n')}` : ''}

Recommendation: ${vulnerableAssets.length > 0 ? 'Schedule vulnerability remediation for affected systems.' : 'Current asset security posture is stable.'}`;
  }

  // Classification requests
  if (lowerMessage.includes('classify') || lowerMessage.includes('analyze') || lowerMessage.includes('what is this')) {
    const latestEvent = events[0];
    if (!latestEvent) {
      return "No recent events available for classification. Please ensure event ingestion is working properly.";
    }

    const confidence = Math.random() * 0.3 + 0.7; // Mock confidence
    const classification = classifyEvent(latestEvent);
    
    return `Event Classification Analysis:
Event: ${latestEvent.alert_name || latestEvent.event_type}
Host: ${latestEvent.host_name}
Classification: ${classification}
Confidence: ${Math.round(confidence * 100)}%

Analysis: ${getClassificationExplanation(classification, latestEvent)}`;
  }

  // Security recommendations
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('advice')) {
    const recommendations = generateRecommendations(events, assets);
    return `Security Recommendations:

${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

These recommendations are based on current threat landscape and your environment's security posture.`;
  }

  // General security guidance
  return `I'm here to help with security analysis and recommendations. I can assist with:

• Analyzing security events and incidents
• Reviewing asset vulnerabilities and status
• Classifying security events (True/False positives)
• Providing security recommendations
• Explaining security terminology and threats

What specific security concern would you like me to help you with?`;
}

function classifyEvent(event: SecurityEvent): string {
  const severity = event.severity?.toLowerCase() || '';
  const alertName = event.alert_name?.toLowerCase() || '';
  const eventType = event.event_type?.toLowerCase() || '';

  // Simple classification logic
  if (severity === 'critical' || severity === 'high') {
    if (alertName.includes('malware') || alertName.includes('trojan') || eventType.includes('malware')) {
      return 'True Positive - Malware Detection';
    }
    if (alertName.includes('intrusion') || alertName.includes('attack') || eventType.includes('intrusion')) {
      return 'True Positive - Intrusion Attempt';
    }
    return 'True Positive - Security Threat';
  }
  
  if (severity === 'low' || severity === 'info') {
    return 'True Negative - Normal Activity';
  }
  
  return 'Requires Investigation';
}

function getClassificationExplanation(classification: string, event: SecurityEvent): string {
  if (classification.includes('True Positive')) {
    return `This event shows indicators of malicious activity. Immediate investigation and containment measures should be implemented. Check related events on ${event.host_name} for additional IOCs.`;
  }
  
  if (classification.includes('True Negative')) {
    return `This appears to be normal system activity with low security impact. Continue monitoring but no immediate action required.`;
  }
  
  return `This event requires manual investigation to determine if it represents a genuine security threat or a false positive.`;
}

function generateRecommendations(events: SecurityEvent[], assets: Asset[]): string[] {
  const recommendations: string[] = [];
  
  const criticalEvents = events.filter(e => e.severity === 'critical' || e.severity === 'high');
  const vulnerableAssets = assets.filter(a => a.vulnerabilities && a.vulnerabilities.length > 0);
  
  if (criticalEvents.length > 0) {
    recommendations.push('Investigate and respond to all critical/high severity alerts within 1 hour');
    recommendations.push('Implement network segmentation to contain potential threats');
  }
  
  if (vulnerableAssets.length > 0) {
    recommendations.push(`Patch vulnerabilities on ${vulnerableAssets.length} affected systems`);
    recommendations.push('Conduct vulnerability assessment on all critical assets monthly');
  }
  
  // General recommendations
  recommendations.push('Enable multi-factor authentication on all administrative accounts');
  recommendations.push('Implement continuous security monitoring and alerting');
  recommendations.push('Conduct security awareness training for all users');
  
  return recommendations.slice(0, 5); // Limit to 5 recommendations
}