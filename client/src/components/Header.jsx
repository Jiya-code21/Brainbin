import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";

const { header_img, hand_wave, demoVideo } = assets;

function Header() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* Gradient background */
      .bg-gradient {
        background: linear-gradient(135deg, #6b46c1 0%, #3182ce 100%);
      }

      /* Spinner animation */
      @keyframes spinSlow {
        from { transform: rotate(0deg);}
        to { transform: rotate(360deg);}
      }
      .spin-slow {
        animation: spinSlow 12s linear infinite;
        transform-style: preserve-3d;
      }

      /* Wave animation for emoji */
      @keyframes wave {
        0%, 100% { transform: rotate(0deg);}
        15% { transform: rotate(15deg);}
        30% { transform: rotate(-10deg);}
        45% { transform: rotate(12deg);}
        60% { transform: rotate(-8deg);}
        75% { transform: rotate(10deg);}
      }
      .wave-animate {
        display: inline-block;
        transform-origin: 70% 70%;
        animation: wave 2s infinite;
      }

      /* Typing effect */
      @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
      }
      @keyframes blinkCaret {
        0%, 100% { border-color: transparent; }
        50% { border-color: #fff; }
      }
      .typing-text {
        font-weight: 700;
        font-size: 2rem;
        color: white;
        border-right: 3px solid white;
        white-space: nowrap;
        overflow: hidden;
        width: 0;
        animation:
          typing 3s steps(20, end) forwards,
          blinkCaret 0.8s step-end infinite;
      }

      /* Floating circles */
      .circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.15;
        background: white;
        animation: floatUpDown 6s ease-in-out infinite;
      }
      @keyframes floatUpDown {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }

      /* Button */
      .btn-gradient {
        background: linear-gradient(90deg, #7b5cf5, #3b82f6);
        padding: 12px 28px;
        color: white;
        font-weight: 600;
        border-radius: 9999px;
        box-shadow: 0 6px 15px rgb(123 92 245 / 0.6);
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        cursor: pointer;
      }
      .btn-gradient:hover {
        filter: brightness(1.1);
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgb(123 92 245 / 0.9);
      }

      /* Modal */
      .modal-backdrop {
        background: rgba(0,0,0,0.3);
        backdrop-filter: blur(4px);
        position: fixed;
        inset: 0;
        z-index: 999;
      }
      .modal-content {
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background: white;
        padding: 24px;
        border-radius: 12px 0 0 12px;
        box-shadow: -4px 0 12px rgba(0,0,0,0.2);
        width: 320px;
        z-index: 1000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .modal-content h2 {
        margin-bottom: 16px;
        font-size: 1.25rem;
        font-weight: 700;
        color: #3b82f6;
      }
      .modal-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      .modal-btn {
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: background-color 0.3s ease;
      }
      .modal-btn.login {
        background-color: #3b82f6;
        color: white;
      }
      .modal-btn.login:hover {
        background-color: #2563eb;
      }
      .modal-btn.cancel {
        background-color: #ddd;
        color: #444;
      }
      .modal-btn.cancel:hover {
        background-color: #bbb;
      }

      /* Responsive text sizes */
      @media (min-width: 640px) {
        .typing-text {
          font-size: 3rem;
        }
      }
    `;
    document.head.appendChild(style);

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <div className="multi-color-spinner spin-slow" style={{
          width: "64px",
          height: "64px",
          border: "6px solid transparent",
          borderTopColor: "#3b82f6",
          borderRightColor: "#7b5cf5",
          borderBottomColor: "#3b82f6",
          borderLeftColor: "#7b5cf5",
          borderRadius: "50%",
          animation: "spinSlow 1s linear infinite"
        }}></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gradient pt-28 sm:pt-24 overflow-hidden">
      
      {/* Floating Circles */}
      <div className="circle w-24 h-24" style={{ top: "10%", left: "5%", animationDelay: "0s" }}></div>
      <div className="circle w-16 h-16" style={{ top: "30%", right: "10%", animationDelay: "2s" }}></div>
      <div className="circle w-20 h-20" style={{ bottom: "15%", left: "15%", animationDelay: "4s" }}></div>

      {/* Avatar */}
      <img
        src={header_img}
        alt="profile"
        className="w-20 h-20 sm:w-28 sm:h-28 rounded-full mb-4 spin-slow shadow-lg"
      />

      {/* Welcome Text */}
      <h1 className="flex items-center gap-2 text-lg sm:text-2xl font-semibold mb-2 text-white">
        Hey {userData ? userData.name : "Developer"}
        <img src={hand_wave} alt="wave" className="wave-animate w-6 h-6" />
      </h1>

      {/* Heading */}
      <h2 className="typing-text mb-4 select-none">Welcome to Brain Bin</h2>

      {/* Sub Text */}
      <p className="max-w-md text-white/90 mb-10 font-medium text-sm sm:text-base">
        See your knowledge flow in motion. Add, organize, and share visually.
      </p>

      {/* Video Section */}
      <div className="rounded-2xl overflow-hidden max-w-4xl w-full mb-10 shadow-lg border-4 border-white/20">
        <video
          src={demoVideo}
          controls
          playsInline
          muted={false}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* Organize Button */}
      <button
        onClick={() => {
          if (userData) {
            navigate("/notes");
          } else {
            setShowLoginModal(true);
          }
        }}
        className="btn-gradient"
      >
        <span>Organize Now</span> <span>🗂</span>
      </button>

      {/* Login Modal */}
      {showLoginModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowLoginModal(false)}></div>
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <h2 id="modalTitle">Please log in to continue</h2>
            <div className="modal-buttons">
              <button
                className="modal-btn login"
                onClick={() => {
                  setShowLoginModal(false);
                  navigate("/login", { state: { from: "/notes" } });
                }}
              >
                Login Now
              </button>
              <button
                className="modal-btn cancel"
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
