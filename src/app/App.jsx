export default function App() {
  useEffect(() => {
    window.bootDebug?.boot("App.jsx mounted — Router active");
  }, []);

  return (
    <>
      <BrowserRouter basename="/MyTube-Piped-Frontend">
        <AppErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AppErrorBoundary>
      </BrowserRouter>

      <DebugOverlay />
    </>
  );
}
