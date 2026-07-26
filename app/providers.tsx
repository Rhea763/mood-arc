"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalDemoPlayer } from "@/components/global-demo-player";
import { DemoAudioPlayerProvider } from "@/lib/demo-audio-player-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <DemoAudioPlayerProvider>
        {children}
        <GlobalDemoPlayer />
      </DemoAudioPlayerProvider>
    </SessionProvider>
  );
}
