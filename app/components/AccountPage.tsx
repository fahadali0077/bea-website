"use client";

import overlays from "@/lib/artboard-overlays.json";
import { fontAptos } from "@/lib/design";

import { FullArtboardPage } from "./FullArtboardPage";
import { SocialProviderIcon } from "./SocialProviderIcons";

export function AccountPage() {
  const page = overlays.pages.account;

  return (
    <FullArtboardPage pageKey="account">
      {page.inputs?.map((field) => (
        <input
          key={field.id}
          id={field.id}
          name={field.id}
          type={field.type as "text" | "email" | "password"}
          aria-label={field.placeholder}
          autoComplete={field.id === "password" ? "new-password" : field.id}
          className="artboard-input"
          style={{
            left: field.left,
            top: field.top,
            width: field.width,
            height: field.height,
            fontFamily: fontAptos,
          }}
        />
      ))}
      {page.social?.map((btn) => {
        const provider = btn.label.toLowerCase() === "google" ? "google" : "apple";

        return (
          <button
            key={btn.label}
            type="button"
            aria-label={`Continue with ${btn.label}`}
            className="artboard-social-btn"
            style={{
              left: btn.left,
              top: btn.top,
              width: btn.width,
              height: btn.height,
            }}
          >
            <span className="artboard-social-btn__fill">
              <span className="artboard-social-btn__icon" aria-hidden>
                <SocialProviderIcon provider={provider} />
              </span>
              <span className="artboard-social-btn__label">{btn.label}</span>
            </span>
          </button>
        );
      })}
    </FullArtboardPage>
  );
}
