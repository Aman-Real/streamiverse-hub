import { Globe, Monitor, Settings as SettingsIcon } from "lucide-react";
import DetailRow from "@/components/common/DetailRow";
import PageHeader from "@/components/common/PageHeader";
import SectionPanel from "@/components/common/SectionPanel";
import PageShell from "@/components/layout/PageShell";
import { Switch } from "@/components/ui/switch";
import { PLAYBACK_CONFIG } from "@/config/playback.config";
import { usePlaybackSettings } from "@/features/settings/hooks/usePlaybackSettings";

/** Playback preferences (they change what the Watch Room player does) and language details. */
const Settings = () => {
  const { autoplayNext, hdStreaming, setAutoplayNext, setHdStreaming } = usePlaybackSettings();

  return (
    <PageShell className="text-foreground" withFooter>
      <div className="page-container-narrow">
        <PageHeader title="Settings" icon={SettingsIcon} />

        <SectionPanel title="Playback" icon={Monitor} description="Saved on this device. Changes apply the next time a video starts.">
          <DetailRow
            variant="plain"
            title={<label htmlFor="autoplay-next">Autoplay next episode</label>}
            description="When an episode of a series or anime ends, the next one starts by itself after a short countdown."
            action={<Switch id="autoplay-next" checked={autoplayNext} onCheckedChange={setAutoplayNext} />}
          />
          <DetailRow
            variant="plain"
            title={<label htmlFor="hd-streaming">HD Streaming</label>}
            description={
              hdStreaming
                ? `On: videos play in ${PLAYBACK_CONFIG.quality.hd}p.`
                : `Off: videos play in ${PLAYBACK_CONFIG.quality.standard}p to use less data.`
            }
            action={<Switch id="hd-streaming" checked={hdStreaming} onCheckedChange={setHdStreaming} />}
          />
        </SectionPanel>

        <SectionPanel title="Language & Region" icon={Globe}>
          <DetailRow variant="plain" title="Language" action={<span className="text-sm text-muted-foreground">English</span>} />
          <DetailRow variant="plain" title="Region" action={<span className="text-sm text-muted-foreground">United States</span>} />
        </SectionPanel>
      </div>
    </PageShell>
  );
};

export default Settings;
