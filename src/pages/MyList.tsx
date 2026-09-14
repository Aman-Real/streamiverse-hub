import { useMemo } from "react";
import PageShell from "@/components/layout/PageShell";
import CatalogOverlays from "@/features/catalog/components/CatalogOverlays";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { searchVideos } from "@/features/catalog/utils/catalog";
import { useMyList } from "@/features/my-list/hooks/useMyList";

const MyList = () => {
  const { myList } = useMyList();
  const browser = useCatalogBrowser();

  const results = useMemo(() => searchVideos(myList, browser.search), [myList, browser.search]);

  return (
    <PageShell onSearch={browser.setSearch} withFooter>
      <div className="pt-24 px-6 md:px-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">My List</h1>
        {results.length === 0 && (
          <p className="text-muted-foreground text-center py-20">
            Your list is empty. Add videos from the home page!
          </p>
        )}
        {/* CategoryRow renders nothing for an empty array, so no extra guard needed. */}
        <CategoryRow
          title="My List"
          videos={results}
          onPlay={browser.openPlayer}
          onInfo={browser.openDetail}
        />
      </div>
      <CatalogOverlays browser={browser} />
    </PageShell>
  );
};

export default MyList;
