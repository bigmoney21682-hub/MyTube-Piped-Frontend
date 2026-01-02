/* ------------------------------------------------------------
   Autonext: Playlist (CORRECTED)
------------------------------------------------------------- */
useEffect(() => {
  AutonextEngine.registerPlaylistCallback(() => {
    if (!activePlaylistId) {
      debugBus.log("AutonextEngine", "No active playlist — aborting");
      return;
    }

    const playlist = playlists.find((p) => p.id === activePlaylistId);
    if (!playlist) {
      debugBus.log("AutonextEngine", "Playlist not found — aborting");
      return;
    }

    if (!playlist.videos.length) {
      debugBus.log("AutonextEngine", "Playlist empty — aborting");
      return;
    }

    // Find current video index
    const index = playlist.videos.findIndex((v) => v.id === id);

    if (index === -1) {
      debugBus.log(
        "AutonextEngine",
        `Current video ${id} not in playlist — aborting autonext`
      );
      return;
    }

    // Compute next index safely
    const nextIndex = (index + 1) % playlist.videos.length;
    const nextVideo = playlist.videos[nextIndex];

    debugBus.log(
      "AutonextEngine",
      `Playlist autonext → index ${index} → ${nextIndex} → ${nextVideo.id}`
    );

    // Navigate + load
    navigate(`/watch/${nextVideo.id}?src=playlist&pl=${activePlaylistId}`);
    loadVideo(nextVideo.id);
  });
}, [navigate, loadVideo, playlists, activePlaylistId, id]);
