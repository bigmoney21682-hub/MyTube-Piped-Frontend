export default function App() {
  const [expanded, setExpanded] = useState(false);
  const { currentId } = useContext(PlayerContext);

  useEffect(() => {
    if (currentId) setExpanded(true);
  }, [currentId]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",     // ⭐ FIXED: no more sticky poisoning
        background: "#000",
        color: "#fff",
        overflowX: "hidden"
      }}
    >
      <Header />

      {/* PLAYER AREA */}
      <div
        style={{
          width: "100%",
          height: 220,
          position: "sticky",
          top: 60,
          zIndex: 1000,
          background: "#000",
          overflow: "hidden"
        }}
      >
        <div
          id="yt-player"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            background: "#000",
            zIndex: 1
          }}
        />

        {expanded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2
            }}
          >
            <FullPlayer onClose={() => setExpanded(false)} />
          </div>
        )}
      </div>

      {/* MINIPLAYER */}
      {currentId && !expanded && (
        <div
          style={{
            position: "sticky",
            top: 280,          // ⭐ 60 header + 220 player
            zIndex: 1500,
            background: "#000",
            display: "block",  // ⭐ FIXED: no inline-block sticky bug
            height: "auto"
          }}
        >
          <MiniPlayer onExpand={() => setExpanded(true)} />
        </div>
      )}

      {/* CONTENT */}
      <div
        style={{
          paddingTop: 12,
          paddingBottom: 56,
          position: "relative", // ⭐ FIXED: content scrolls correctly
          zIndex: 1
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
