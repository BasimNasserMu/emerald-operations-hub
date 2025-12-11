import { useLanguage } from '@/contexts/LanguageContext';
import { StatsCard } from '@/components/StatsCard';
import { DetectionCard } from '@/components/DetectionCard';
import { useEffect, useState } from 'react';
import { getDetectionStats, getDetectionReports, Stats, DetectionReport } from '@/lib/api';
import { cn } from '@/lib/utils';
import { 
  Target, 
  AlertTriangle, 
  Clock, 
  Timer, 
  Activity,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Dashboard() {
  const { t, isRTL } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<DetectionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes] = await Promise.all([
        getDetectionStats(timeRange),
        getDetectionReports(timeRange, 6),
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (reportsRes.success) setReports(reportsRes.detections);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

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
          <h1 className="text-2xl font-tactical font-bold tracking-wider text-foreground">
            {t('dashboard')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('appTagline')}
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
            onClick={fetchData}
            disabled={loading}
            className="border-border hover:border-military-glow hover:bg-primary/20"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('totalDetections')}
          value={stats?.totalDetections ?? '-'}
          icon={Target}
          variant="default"
        />
        <StatsCard
          title={t('criticalAlerts')}
          value={stats?.criticalAlerts ?? '-'}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatsCard
          title={t('meanTimeToDetect')}
          value={stats?.mttd ?? '-'}
          icon={Clock}
          variant="default"
        />
        <StatsCard
          title={t('meanTimeToRespond')}
          value={stats?.mttr ?? '-'}
          icon={Timer}
          variant="warning"
        />
      </div>

      {/* Status Breakdown */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-military-glow/30 bg-card/50 text-center">
            <p className="text-2xl font-tactical font-bold text-military-glow">{stats.alertsByStatus.new}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{t('new')}</p>
          </div>
          <div className="p-4 rounded-lg border border-tactical-amber/30 bg-card/50 text-center">
            <p className="text-2xl font-tactical font-bold text-tactical-amber">{stats.alertsByStatus.inProgress}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{t('inProgress')}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card/50 text-center">
            <p className="text-2xl font-tactical font-bold text-muted-foreground">{stats.alertsByStatus.closed}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{t('closed')}</p>
          </div>
        </div>
      )}

      {/* Recent Detections */}
      <div className="space-y-4">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <h2 className={cn("text-lg font-semibold flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Activity className="w-5 h-5 text-military-glow" />
            {t('recentDetections')}
          </h2>
          <Button variant="link" className="text-military-glow hover:text-military-light">
            {t('viewAll')} →
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-card/30 animate-pulse" />
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <DetectionCard key={report.report_id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('noData')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
