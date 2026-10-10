"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Headphones, Pause, Play, Square } from "lucide-react";

/**
 * Reads a note aloud with the browser's built-in speech synthesis (Web Speech API):
 * free, no network calls of our own, and the voice comes from the reader's device.
 *
 * The note is spoken in short chunks of a sentence or two, one utterance each. That
 * works around Chrome cutting off long utterances, lets the current paragraph be
 * highlighted, and makes pause reliable: pausing cancels speech and remembers the
 * chunk, because speechSynthesis.pause() does nothing on Android.
 */

type Chunk = { text: string; el: Element | null };
type Status = "idle" | "playing" | "paused";

const BLOCKS = "h2, h3, h4, p, li, blockquote, pre, table";
const MAX_CHUNK = 220; // characters per utterance
const CHARS_PER_SECOND = 15; // speech at rate 1, for the time-left estimate
const RATES = [1, 1.25, 1.5, 2, 0.75];
const RATE_KEY = "listen-rate";
// Better-sounding voices first; whichever the device has wins.
const PREFERRED_VOICES = [/natural/i, /premium|enhanced/i, /google us english/i, /samantha/i, /google uk english/i, /daniel/i];

const noSubscribe = () => () => {};
const isSupported = () => "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

// macOS lists its joke voices as English too ("Bubbles", "Bad News"); never pick one of those.
const NOVELTY_VOICES =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox)$/i;

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en") && !NOVELTY_VOICES.test(v.name));
  for (const pattern of PREFERRED_VOICES) {
    const match = english.find((v) => pattern.test(v.name));
    if (match) return match;
  }
  return english.find((v) => v.default) ?? english[0];
}

function sentences(text: string) {
  if ("Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
    return Array.from(segmenter.segment(text), (s) => s.segment.trim()).filter(Boolean);
  }
  return text.match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
}

/** Splits text into chunks of whole sentences, each at most MAX_CHUNK characters where possible. */
function pack(text: string) {
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences(text)) {
    if (current && current.length + 1 + sentence.length > MAX_CHUNK) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function collectChunks(body: Element, intro: string[]): Chunk[] {
  const chunks: Chunk[] = intro.filter(Boolean).flatMap((text) => pack(text).map((t) => ({ text: t, el: null })));
  for (const el of body.querySelectorAll(BLOCKS)) {
    // A paragraph inside a list item or quote is read with its parent.
    if (el.parentElement?.closest(BLOCKS) && body.contains(el.parentElement.closest(BLOCKS))) continue;
    let text: string;
    if (el.matches("pre")) text = "Code sample skipped.";
    else if (el.matches("table")) text = "Table skipped.";
    else {
      text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      const img = el.querySelector("img[alt]");
      if (!text && img) text = `Image: ${img.getAttribute("alt")}`;
    }
    // "screenshot_shield" reads better as two words than as "screenshot underscore shield".
    for (const t of pack(text.replace(/(\w)_(?=\w)/g, "$1 "))) chunks.push({ text: t, el });
  }
  return chunks;
}

function readRate() {
  try {
    const saved = Number(localStorage.getItem(RATE_KEY));
    return RATES.includes(saved) ? saved : 1;
  } catch {
    return 1;
  }
}

export function ListenToNote({
  bodyId,
  title,
  description,
  readingMinutes,
}: {
  bodyId: string;
  title: string;
  description: string;
  readingMinutes: number;
}) {
  const supported = useSyncExternalStore(noSubscribe, isSupported, () => false);
  const [status, setStatus] = useState<Status>("idle");
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [charsLeft, setCharsLeft] = useState(0);
  const [rate, setRate] = useState(1);

  const chunks = useRef<Chunk[]>([]);
  const position = useRef(0);
  const statusRef = useRef<Status>("idle");
  const rateRef = useRef(1);
  // Bumped on every start, stop and skip, so events from a cancelled utterance are ignored.
  const session = useRef(0);
  // Chrome can drop the events of an utterance that is garbage-collected mid-speech.
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const highlighted = useRef<Element | null>(null);

  const setStatusBoth = (next: Status) => {
    statusRef.current = next;
    setStatus(next);
  };

  const highlight = (el: Element | null) => {
    const previous = highlighted.current;
    if (previous === el) return;
    previous?.classList.remove("is-reading");
    highlighted.current = el;
    if (!el) return;
    el.classList.add("is-reading");
    // Follow along only if the reader was looking at the previous paragraph.
    const viewport = window.innerHeight;
    const wasVisible = (() => {
      if (!previous) return false;
      const r = previous.getBoundingClientRect();
      return r.bottom > 0 && r.top < viewport;
    })();
    const r = el.getBoundingClientRect();
    if (wasVisible && (r.top < 96 || r.bottom > viewport - 112)) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const halt = () => {
    session.current++;
    utterance.current = null;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) synth.cancel();
  };

  const stop = () => {
    halt();
    highlight(null);
    position.current = 0;
    setIndex(0);
    setStatusBoth("idle");
  };

  const speakFrom = (i: number) => {
    const synth = window.speechSynthesis;
    const list = chunks.current;
    if (i >= list.length) {
      stop();
      return;
    }
    const busy = synth.speaking || synth.pending;
    halt();
    const id = session.current;
    position.current = i;
    setIndex(i);
    setCharsLeft(list.slice(i).reduce((n, c) => n + c.text.length, 0));
    highlight(list[i].el ?? highlighted.current);

    const u = new SpeechSynthesisUtterance(list[i].text);
    const voice = pickVoice(synth.getVoices());
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-US";
    u.rate = rateRef.current;
    u.onend = () => {
      if (session.current === id) speakFrom(i + 1);
    };
    u.onerror = (e) => {
      if (session.current !== id || e.error === "interrupted" || e.error === "canceled") return;
      stop();
    };
    utterance.current = u;
    // Speaking straight after cancel() is sometimes ignored by Chrome, so give it a moment.
    const go = () => {
      if (session.current !== id) return;
      synth.resume(); // clears a stuck paused state left by other pages
      synth.speak(u);
    };
    if (busy) setTimeout(go, 60);
    else go();
  };

  const start = () => {
    const body = document.getElementById(bodyId);
    if (!body) return;
    chunks.current = collectChunks(body, [title, description]);
    setTotal(chunks.current.length);
    const saved = readRate();
    rateRef.current = saved;
    setRate(saved);
    setStatusBoth("playing");
    speakFrom(0);
  };

  const pause = () => {
    halt();
    setStatusBoth("paused");
  };

  const resume = () => {
    setStatusBoth("playing");
    speakFrom(position.current);
  };

  const cycleRate = () => {
    const next = RATES[(RATES.indexOf(rateRef.current) + 1) % RATES.length];
    rateRef.current = next;
    setRate(next);
    try {
      localStorage.setItem(RATE_KEY, String(next));
    } catch {}
    if (statusRef.current === "playing") speakFrom(position.current);
  };

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.getVoices(); // starts loading the voice list in Chrome
    // Mobile browsers stop speech in the background without an end event; pick up where it stopped.
    const onVisible = () => {
      if (document.visibilityState === "visible" && statusRef.current === "playing" && !synth.speaking && !synth.pending) {
        speakFrom(position.current);
      }
    };
    const onLeave = () => {
      session.current++;
      synth.cancel();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pagehide", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", onLeave);
      onLeave();
      highlighted.current?.classList.remove("is-reading");
    };
    // speakFrom only touches refs and state setters, so the first render's copy is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  if (!supported) return null;

  const listenMinutes = Math.max(1, Math.round((readingMinutes * 220) / 165));
  const active = status !== "idle";
  const minutesLeft = Math.max(1, Math.round(charsLeft / CHARS_PER_SECOND / rate / 60));
  const progress = total ? Math.round((index / total) * 100) : 0;

  return (
    <>
      <button
        type="button"
        onClick={active ? (status === "playing" ? pause : resume) : start}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 tracking-wide uppercase transition hover:border-foreground hover:text-foreground"
      >
        {status === "playing" ? (
          <Pause className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Headphones className="h-3.5 w-3.5" aria-hidden />
        )}
        {status === "playing" ? "Pause" : status === "paused" ? "Resume" : `Listen · ${listenMinutes} min`}
      </button>

      {active && (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 normal-case">
          <div
            role="region"
            aria-label="Audio player for this note"
            className="flex items-center gap-2 rounded-full border border-border bg-background/90 p-1.5 pr-2 font-sans text-foreground shadow-2xl backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={status === "playing" ? pause : resume}
              aria-label={status === "playing" ? "Pause" : "Resume"}
              className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-contrast transition hover:opacity-85"
            >
              {status === "playing" ? (
                <Pause className="h-4 w-4" aria-hidden />
              ) : (
                <Play className="h-4 w-4 translate-x-px" aria-hidden />
              )}
            </button>
            <div className="flex w-36 flex-col gap-1.5 px-1 sm:w-44">
              <span className="text-xs whitespace-nowrap text-muted" aria-live="polite">
                {status === "playing" ? "Playing" : "Paused"} · {minutesLeft} min left
              </span>
              <span className="h-1 overflow-hidden rounded-full bg-accent-soft" aria-hidden>
                <span className="block h-full bg-foreground transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </span>
            </div>
            <button
              type="button"
              onClick={cycleRate}
              aria-label={`Reading speed ${rate} times. Change speed`}
              className="h-9 min-w-12 rounded-full px-2 font-mono text-xs transition hover:bg-accent-soft"
            >
              {rate}×
            </button>
            <button
              type="button"
              onClick={stop}
              aria-label="Stop reading"
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-accent-soft"
            >
              <Square className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
