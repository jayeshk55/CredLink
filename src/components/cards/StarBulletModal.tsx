"use client";

import React, { useState } from "react";

// Shared star-bullet modal used by all card designs

type Section = "Services" | "Portfolio" | "Skills" | "Experience" | "Review";

interface StarBulletModalProps {
  activePanel: Section | null;
  isMobile: boolean;
  themeColor1: string;
  panelText: Record<Section, string>;
  onClose: () => void;
}

const StarBulletModal: React.FC<StarBulletModalProps> = ({
  activePanel,
  isMobile,
  themeColor1,
  panelText,
  onClose,
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const MAX_ITEM_LENGTH = 140;

  if (!activePanel) return null;

  const raw = panelText[activePanel] || "";
  const items = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const renderItem = (title: string) => {
    const isUrl =
      /^https?:\/\//i.test(title) || /^[\w.-]+\.[a-z]{2,}/i.test(title);
    const href = isUrl
      ? /^https?:\/\//i.test(title)
        ? title
        : `https://${title}`
      : undefined;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          borderRadius: 12,
          padding: "12px 14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: themeColor1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ★
          </div>
          <div>
            {isUrl && href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontWeight: 700,
                  color: "#111827",
                  textDecoration: "none",
                  display: "block",
                  wordBreak: "break-word",
                }}
              >
                {title}
              </a>
            ) : (
              <div
                style={{
                  fontWeight: 700,
                  color: "#111827",
                  wordBreak: "break-word",
                }}
              >
                {title}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          width: isMobile ? "100%" : "calc(100% - 24px)",
          maxWidth: 520,
          maxHeight: isMobile ? "100%" : "80%",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            padding: isMobile ? 12 : 16,
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ margin: 0, color: "#111827", fontWeight: 700 }}>
            {activePanel}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#9CA3AF",
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            maxHeight: isMobile ? "calc(80vh - 60px)" : 400,
            overflow: "auto",
            padding: isMobile ? 12 : 16,
          }}
        >
          {items.map((it, idx) => {
            const key = `${activePanel}-${idx}`;
            const isExpanded = !!expandedItems[key];
            const needsShowMore = it.length > MAX_ITEM_LENGTH;
            const displayText =
              !needsShowMore || isExpanded
                ? it
                : `${it.slice(0, MAX_ITEM_LENGTH)}...`;

            return (
              <div key={key}>
                {renderItem(displayText)}
                {needsShowMore && (
                  <button
                    onClick={() =>
                      setExpandedItems((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    style={{
                      marginTop: 4,
                      marginLeft: 40,
                      fontSize: 12,
                      color: themeColor1,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StarBulletModal;
