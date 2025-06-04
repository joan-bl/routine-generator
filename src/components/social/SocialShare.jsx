import React from "react";

// Compartir logros y rutinas en redes sociales
function SocialShare({ text, url }) {
  return (
    <div className="social-share">
      <h3>¡Comparte tu progreso!</h3>
      <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)}>
        Compartir en X (Twitter)
      </button>
      {/* Puedes añadir más botones para otras redes sociales */}
    </div>
  );
}

export default SocialShare;
