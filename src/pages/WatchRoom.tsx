import { useNavigate, useParams } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { useVideoLibrary } from "@/features/catalog/hooks/useVideoLibrary";
import { getContinueWatching } from "@/features/catalog/utils/catalog";
import VideoPlayer from "@/features/player/components/VideoPlayer";

/** Plays /watch/:id; without an id it resumes the latest in-progress title. */
const WatchRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { videos, updateProgress } = useVideoLibrary();
  const video = videos.find(item => item.id === id) ?? getContinueWatching(videos)[0] ?? videos[0];

  return (
    <PageShell withFooter>
      <div className="page-container">
        {video && (
          <VideoPlayer key={video.id} video={video} onClose={() => navigate(-1)} onProgressUpdate={updateProgress} />
        )}
      </div>
    </PageShell>
  );
};

export default WatchRoom;
