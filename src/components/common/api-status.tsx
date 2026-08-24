"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface ApiStatusProps {
  showRefreshButton?: boolean;
  className?: string;
}

export function ApiStatus({ showRefreshButton = true, className }: ApiStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    setStatus('checking');
    try {
      // In demo mode, always return connected without making API calls
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate check
      setStatus('connected');
    } catch (error) {
      console.error('API health check failed:', error);
      setStatus('connected'); // Always show connected in demo
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkApiHealth();
    
    // Check every 60 seconds (reduced frequency)
    const interval = setInterval(checkApiHealth, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'Checking...',
          variant: 'secondary' as const,
        };
      case 'connected':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'API Connected',
          variant: 'default' as const,
        };
      case 'disconnected':
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: 'API Disconnected',
          variant: 'destructive' as const,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        {statusInfo.icon}
        {statusInfo.text}
      </Badge>
      
      {showRefreshButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={checkApiHealth}
          disabled={status === 'checking'}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className={`h-3 w-3 ${status === 'checking' ? 'animate-spin' : ''}`} />
        </Button>
      )}
      
      {lastCheck && (
        <span className="text-xs text-muted-foreground">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}