import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getDetectionReports, DetectionReport, getStorageUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  RefreshCw, 
  FileText,
  MapPin,
  User,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  Eye
} from 'lucide-react';

export function ReportsPage() {
  const { t, isRTL } = useLanguage();
  const [reports, setReports] = useState<DetectionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [selectedReport, setSelectedReport] = useState<DetectionReport | null>(null);
  const [total, setTotal] = useState(0);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getDetectionReports(timeRange, 50);
      if (response.success) {
        setReports(response.detections);
        setTotal(response.total);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const severityConfig = {
    High: { icon: AlertTriangle, color: 'bg-tactical-red/20 text-tactical-red border-tactical-red/50' },
    Medium: { icon: AlertCircle, color: 'bg-tactical-amber/20 text-tactical-amber border-tactical-amber/50' },
    Low: { icon: Info, color: 'bg-military-glow/20 text-military-glow border-military-glow/50' },
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timeRangeOptions = [
    { value: '24h', label: t('last24h') },
    { value: '7d', label: t('last7d') },
    { value: '30d', label: t('last30d') },
    { value: 'all', label: t('allTime') },
  ];

  return (
    <div className="p-6 space-y-6 hud-grid min-h-full">
      {/* Header */}
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL && "text-right")}>
          <h1 className="text-2xl font-tactical font-bold tracking-wider text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-military-glow" />
            {t('reports')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} {t('totalDetections')}
          </p>
        </div>
        
        <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <SelectTrigger className="w-40 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={fetchReports}
            disabled={loading}
            className="border-border hover:border-military-glow hover:bg-primary/20"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr className={cn("text-xs uppercase tracking-wider text-muted-foreground", isRTL && "text-right")}>
                <th className="p-4">{t('reportId')}</th>
                <th className="p-4">{t('timestamp')}</th>
                <th className="p-4">{t('location')}</th>
                <th className="p-4">{t('soldierCount')}</th>
                <th className="p-4">{t('severity')}</th>
                <th className="p-4">{t('status')}</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="p-4">
                      <div className="h-8 bg-secondary/30 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : reports.length > 0 ? (
                reports.map((report) => {
                  const severity = severityConfig[report.severity];
                  const SeverityIcon = severity.icon;
                  
                  return (
                    <tr 
                      key={report.report_id}
                      className="hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <td className="p-4">
                        <span className="font-mono text-military-glow">#{report.report_id}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {formatTime(report.timestamp)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {report.location.latitude.toFixed(2)}, {report.location.longitude.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 font-semibold">
                          <User className="w-4 h-4 text-tactical-amber" />
                          {report.soldier_count}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={cn("text-xs", severity.color)}>
                          <SeverityIcon className="w-3 h-3 mr-1" />
                          {report.severity === 'High' ? t('high') : report.severity === 'Medium' ? t('medium') : t('low')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs border-military-glow/30 text-military-glow">
                          {report.status === 'New' ? t('new') : report.status === 'In Progress' ? t('inProgress') : t('closed')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {t('noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-tactical text-military-glow">
              {t('reportId')}: #{selectedReport?.report_id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {selectedReport.image_snapshot_url && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase">Original</p>
                    <img 
                      src={getStorageUrl(selectedReport.image_snapshot_url)} 
                      alt="Original" 
                      className="rounded-lg border border-border"
                    />
                  </div>
                )}
                {selectedReport.segmented_image_url && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase">Segmented</p>
                    <img 
                      src={getStorageUrl(selectedReport.segmented_image_url)} 
                      alt="Segmented" 
                      className="rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('environment')}</p>
                  <p>{selectedReport.environment || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('camouflage')}</p>
                  <p>{selectedReport.attire_and_camouflage || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('equipment')}</p>
                  <p>{selectedReport.equipment || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Source</p>
                  <p>{selectedReport.source_device_id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
