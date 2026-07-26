import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "心绪日历",
  description: "根据今天的心情，生成专属歌单",
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="embed-calendar min-h-full bg-[#FFF5F4] text-[#4A2E3B]">
      {children}
    </div>
  );
}
