import DebugOverlay from "./components/DebugOverlay";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <PlaylistProvider>
      <BootSplash ready={ready} />

      {ready && (
        <>
          <DebugOverlay /> {/* <-- Add this here */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
          </Routes>

          <Footer />
        </>
      )}
    </PlaylistProvider>
  );
}
