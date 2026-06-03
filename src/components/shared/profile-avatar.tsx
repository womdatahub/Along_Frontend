"use client";

import Image from "next/image";
import { cn } from "@/lib";

type ProfileAvatarProps = {
  /** Image URL — `null` or `undefined` falls back to initials. */
  src?: string | null;
  firstName?: string;
  lastName?: string;
  /** Rendered size in pixels (applied to both width and height). Defaults to 40. */
  size?: number;
  /** Classes applied to the outer wrapper (both img and initials div). */
  className?: string;
  alt?: string;
};

/**
 * Renders a circular profile image. Falls back to a coloured initials avatar
 * when `src` is absent, empty, or fails to load.
 */
export const ProfileAvatar = ({
  src,
  firstName = "",
  lastName = "",
  size = 40,
  className,
  alt,
}: ProfileAvatarProps) => {
  const initials =
    `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";

  const base = cn(
    "rounded-full object-cover shrink-0 flex items-center justify-center",
    className,
  );

  if (src) {
    return (
      <Image
        src={src}
        alt={(alt ?? `${firstName} ${lastName}`.trim()) || "Profile"}
        width={size}
        height={size}
        className={cn("rounded-full object-cover shrink-0", className)}
      />
    );
  }

  // Derive a consistent background hue from the name so each user gets a
  // distinct but stable colour rather than all sharing the same primary tint.
  const hue =
    [...`${firstName}${lastName}`].reduce(
      (acc, ch) => acc + ch.charCodeAt(0),
      0,
    ) % 360;

  return (
    <div
      className={base}
      style={{
        width: size,
        height: size,
        minWidth: size,
        fontSize: size * 0.36,
        background: `hsl(${hue}, 55%, 48%)`,
        color: "white",
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
      aria-label={(alt ?? `${firstName} ${lastName}`.trim()) || "Profile"}
    >
      {initials}
    </div>
  );
};
