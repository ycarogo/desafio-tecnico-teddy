type LoadingPageProps = {
  message?: string;
};

export function LoadingPage({ message = "Carregando…" }: LoadingPageProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        aria-label="Carregando"
        focusable="false"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <div style={{ fontSize: "14px", color: "inherit" }}>{message}</div>
    </div>
  );
}

export default LoadingPage;
