export type ExternalAudioEmbed = {
  provider: "soundcloud" | "mixcloud";
  providerLabel: "SoundCloud" | "Mixcloud";
  src: string;
};

const SOUNDCLOUD_HOSTS = new Set(["soundcloud.com", "www.soundcloud.com", "m.soundcloud.com"]);
const MIXCLOUD_HOSTS = new Set(["mixcloud.com", "www.mixcloud.com"]);

export function getExternalAudioEmbed(value: string): ExternalAudioEmbed | null {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;

  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.replace(/\/+$/, "");
  if (!pathname || pathname === "/") return null;

  if (SOUNDCLOUD_HOSTS.has(hostname)) {
    const permalink = `${url.origin}${url.pathname}`;
    const params = new URLSearchParams({
      url: permalink,
      auto_play: "false",
      hide_related: "true",
      show_comments: "false",
      show_user: "true",
      show_reposts: "false",
      visual: "false",
    });

    return {
      provider: "soundcloud",
      providerLabel: "SoundCloud",
      src: `https://w.soundcloud.com/player/?${params.toString()}`,
    };
  }

  if (MIXCLOUD_HOSTS.has(hostname)) {
    const feed = `${pathname}/`;
    const params = new URLSearchParams({
      hide_cover: "1",
      light: "1",
      feed,
    });

    return {
      provider: "mixcloud",
      providerLabel: "Mixcloud",
      src: `https://www.mixcloud.com/widget/iframe/?${params.toString()}`,
    };
  }

  return null;
}

export function ExternalAudioPlayer({ embed, title }: { embed: ExternalAudioEmbed; title: string }) {
  return (
    <iframe
      title={`${title} on ${embed.providerLabel}`}
      src={embed.src}
      width="100%"
      height={embed.provider === "soundcloud" ? 166 : 120}
      allow="autoplay; encrypted-media"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      className="w-full rounded-md border-0 bg-muted"
    />
  );
}
