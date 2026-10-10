"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Headphones, Pause, Play, Square } from "lucide-react";

/**
 * Reads a note aloud with the browser's built-in speech synthesis (Web Speech API): free,
 * no requests of our own, and on-device voices are preferred so the text stays on the device
 * (a cloud voice is used only when the device has no English voice).
 *
 * The note is spoken in short chunks, one utterance each. That avoids Chrome's cut-off of
 * long utterances, lets the current paragraph be highlighted, and makes pause reliable:
 * pausing cancels speech and remembers the chunk, because speechSynthesis.pause() does
 * nothing on Android. A session counter ignores events from cancelled utterances.
 */

type Chunk = { text: string; el: Element | null };
type Status = "idle" | "playing" | "paused";

const BLOCKS = "h2, h3, h4, p, li, blockquote, pre, table";
// Characters per utterance: stays under ~15s even at 0.75×, where Chrome's Google voices go silent.
const MAX_CHUNK = 150;
const RATES = [1, 1.25, 1.5, 2, 0.75];
const RATE_KEY = "listen-rate";
const CHARS_PER_SECOND = 15; // speech at 1×, for the stall watchdog
// WebKit (Safari, and every browser on iPhone and iPad) halves the rate for Apple's speech engine,
// whose speed climbs steeply above its default, so 2 sounds like ~4×. These give the labelled speed.
const WEBKIT_RATES: Record<number, number> = { 0.75: 0.5, 1: 1, 1.25: 1.08, 1.5: 1.17, 2: 1.33 };
// Better-sounding voices first; whichever the device has wins.
const PREFERRED_VOICES = [/premium|enhanced/i, /natural/i, /samantha/i, /daniel/i, /google us english/i, /google uk english/i];
// macOS lists joke voices as English ("Bubbles", "Bad News"); Edge has child voices; skip both.
const SKIPPED_VOICES =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox)$|\b(ana|maisie)\b|undefined/i;

const noSubscribe = () => () => {};
const isSupported = () => "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
const normLang = (lang: string) => lang.replace("_", "-").toLowerCase();
const usesWebKitSpeech = () => navigator.vendor === "Apple Computer, Inc.";

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const reader = normLang(navigator.language);
  const rank = (v: SpeechSynthesisVoice) => (normLang(v.lang) === reader ? 0 : normLang(v.lang) === "en-us" ? 1 : 2);
  const english = voices
    .filter((v) => normLang(v.lang).startsWith("en") && !SKIPPED_VOICES.test(v.name))
    .sort((a, b) => rank(a) - rank(b));
  const local = english.filter((v) => v.localService);
  const pool = local.length ? local : english;
  for (const pattern of PREFERRED_VOICES) {
    const match = pool.find((v) => pattern.test(v.name));
    if (match) return match;
  }
  return pool.find((v) => v.default) ?? pool[0] ?? null;
}

function sentences(text: string) {
  if ("Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
    return Array.from(segmenter.segment(text), (s) => s.segment.trim()).filter(Boolean);
  }
  return text.match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
}

/** Breaks a sentence longer than MAX_CHUNK at a clause boundary, else at a space. */
function splitLong(sentence: string) {
  const parts: string[] = [];
  let rest = sentence;
  while (rest.length > MAX_CHUNK) {
    const head = rest.slice(0, MAX_CHUNK);
    let cut = Math.max(head.lastIndexOf(", "), head.lastIndexOf("; "), head.lastIndexOf(": "));
    if (cut < MAX_CHUNK / 3) cut = head.lastIndexOf(" ");
    if (cut <= 0) cut = MAX_CHUNK - 1;
    parts.push(rest.slice(0, cut + 1).trim());
    rest = rest.slice(cut + 1).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

/** Splits text into chunks of whole sentences (or clauses), each at most MAX_CHUNK characters. */
function pack(text: string) {
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences(text).flatMap(splitLong)) {
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
    const outer = el.parentElement?.closest(BLOCKS);
    if (outer && body.contains(outer)) continue;
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
  listenMinutes,
}: {
  bodyId: string;
  title: string;
  description: string;
  listenMinutes: number;
}) {
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  const supported = hydrated && isSupported();
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState({ charsLeft: 1, totalChars: 1 });
  const [rate, setRate] = useState(1);
  const [notice, setNotice] = useState("");

  const chunks = useRef<Chunk[]>([]);
  const position = useRef(0);
  const statusRef = useRef<Status>("idle");
  const rateRef = useRef(1);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  // Bumped on every start, stop and skip, so events from a cancelled utterance are ignored.
  const session = useRef(0);
  // Chrome can drop the events of an utterance that is garbage-collected mid-speech.
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const highlighted = useRef<Element | null>(null);
  const chunkStartedAt = useRef(0);
  const retried = useRef(false);
  const listenButton = useRef<HTMLButtonElement>(null);
  const player = useRef<HTMLDivElement>(null);

  const setStatusBoth = (next: Status) => {
    statusRef.current = next;
    setStatus(next);
  };

  const highlight = (el: Element | null) => {
    const previous = highlighted.current;
    if (previous === el && (!el || el.classList.contains("is-reading"))) return;
    previous?.classList.remove("is-reading");
    highlighted.current = el;
    if (!el) return;
    el.classList.add("is-reading");
    // Follow along only if the reader was looking at the previous paragraph.
    const viewport = window.innerHeight;
    const was = previous?.getBoundingClientRect();
    const wasVisible = !!was && was.bottom > 0 && was.top < viewport;
    const r = el.getBoundingClientRect();
    const top = 96; // fixed navbar
    const bottom = viewport - 112; // floating player
    if (wasVisible && (r.top < top || r.bottom > bottom)) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({
        block: r.height > bottom - top ? "start" : "center",
        behavior: reduceMotion ? "instant" : "smooth",
      });
    }
  };

  const halt = () => {
    session.current++;
    utterance.current = null;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) synth.cancel();
  };

  const pauseWith = (message: string) => {
    halt();
    setStatusBoth("paused");
    setNotice(message);
  };

  const stop = (message = "") => {
    const focusWasInPlayer = !!player.current?.contains(document.activeElement);
    halt();
    highlight(null);
    position.current = 0;
    setStatusBoth("idle");
    setNotice(message);
    if (focusWasInPlayer) listenButton.current?.focus({ preventScroll: true });
  };

  const speakFrom = (i: number) => {
    const synth = window.speechSynthesis;
    const list = chunks.current;
    if (i >= list.length) {
      stop("Finished reading.");
      return;
    }
    const busy = synth.speaking || synth.pending;
    halt();
    const id = session.current;
    if (i !== position.current) retried.current = false;
    position.current = i;
    const charsLeft = list.slice(i).reduce((n, c) => n + c.text.length, 0);
    setProgress((p) => ({ ...p, charsLeft }));
    highlight(list[i].el ?? highlighted.current);

    const u = new SpeechSynthesisUtterance(list[i].text);
    if (voice.current) u.voice = voice.current;
    u.lang = voice.current?.lang ?? "en-US";
    u.rate = usesWebKitSpeech() ? (WEBKIT_RATES[rateRef.current] ?? 1) : rateRef.current;
    u.onend = () => {
      if (session.current === id) speakFrom(i + 1);
    };
    u.onerror = (e) => {
      if (session.current !== id) return;
      const code = (e as Partial<SpeechSynthesisErrorEvent>).error; // undefined in Firefox
      // Stopped by the system while in the background: onVisible restarts this chunk.
      if ((code === "interrupted" || code === "canceled") && document.hidden) return;
      if (!synth.getVoices().length) {
        stop("This browser has no text-to-speech voices installed.");
        return;
      }
      // Keep the place; Resume retries this chunk.
      pauseWith(code === "interrupted" || code === "canceled" ? "" : "Couldn't play that part. Press play to retry.");
    };
    utterance.current = u;
    const go = () => {
      if (session.current !== id) return;
      chunkStartedAt.current = Date.now();
      synth.speak(u);
    };
    // Speaking straight after cancel() is sometimes ignored by Chrome, so give it a moment.
    if (busy) setTimeout(go, 60);
    else go();
  };

  const play = (from: number) => {
    voice.current = pickVoice(window.speechSynthesis.getVoices());
    retried.current = false;
    setNotice("");
    setStatusBoth("playing");
    speakFrom(from);
  };

  const start = () => {
    const body = document.getElementById(bodyId);
    if (!body) return;
    chunks.current = collectChunks(body, [title, description]);
    const totalChars = chunks.current.reduce((n, c) => n + c.text.length, 0) || 1;
    setProgress({ charsLeft: totalChars, totalChars });
    const saved = readRate();
    rateRef.current = saved;
    setRate(saved);
    // Chrome shares one speech queue across tabs; this also clears a pause another tab left behind.
    window.speechSynthesis.cancel();
    position.current = 0;
    play(0);
  };

  const pause = () => pauseWith("");
  const resume = () => play(position.current);

  const cycleRate = () => {
    const next = RATES[(RATES.indexOf(rateRef.current) + 1) % RATES.length];
    rateRef.current = next;
    setRate(next);
    try {
      localStorage.setItem(RATE_KEY, String(next));
    } catch {}
    retried.current = false;
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
    // Leaving the page (incl. the back/forward cache) or Next hiding this route keeps this
    // component's state, so drop to "paused": coming back shows Resume, never a silent "Playing"
    // or speech that starts by itself. An idle player never cancels speech it didn't start.
    const leave = () => {
      if (statusRef.current === "idle") return;
      halt();
      highlight(null);
      setStatusBoth("paused");
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pagehide", leave);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", leave);
      leave();
    };
    // These handlers only touch refs and state setters, so the first render's copies are enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  // Watchdog: some engines go quiet without an end or error event. Retry the chunk once (or
  // skip it if the engine still claims to be speaking), then pause with a message.
  useEffect(() => {
    if (status !== "playing") return;
    const synth = window.speechSynthesis;
    const timer = window.setInterval(() => {
      if (document.hidden) return; // onVisible handles background stops
      const chunk = chunks.current[position.current];
      if (!chunk || !chunkStartedAt.current) return;
      const expected = (chunk.text.length / CHARS_PER_SECOND / rateRef.current) * 1000;
      if (Date.now() - chunkStartedAt.current < expected * 2 + 5000) return;
      if (retried.current) {
        pauseWith("Read-aloud stopped responding. Press play to try again.");
        return;
      }
      retried.current = true;
      speakFrom(synth.speaking ? position.current + 1 : position.current);
    }, 2000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Reserve the button's space until hydration so the header doesn't shift on phones.
  if (!supported) return hydrated ? null : <span aria-hidden className="inline-block h-[22px] w-36" />;

  const active = status !== "idle";
  const share = progress.charsLeft / progress.totalChars;
  const minutesLeft = Math.max(1, Math.round((listenMinutes * share) / rate));
  const percent = Math.round((1 - share) * 100);
  const statusLine = notice || `${status === "playing" ? "Playing" : "Paused"} · ${minutesLeft} min left`;

  return (
    <>
      <button
        ref={listenButton}
        type="button"
        onClick={active ? (status === "playing" ? pause : resume) : start}
        aria-label={active ? undefined : `Listen to this note, about ${listenMinutes} minutes`}
        className="relative inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 tracking-wide uppercase transition after:absolute after:-inset-x-1 after:-inset-y-3 hover:border-foreground hover:text-foreground"
      >
        {status === "playing" ? (
          <Pause className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Headphones className="h-3.5 w-3.5" aria-hidden />
        )}
        {status === "playing" ? "Pause" : status === "paused" ? "Resume" : `Listen · ${listenMinutes} min`}
      </button>

      {/* Announces only what a listener can't otherwise tell: it finished, or it stopped on an error. */}
      <span role="status" className="sr-only">
        {notice}
      </span>
      {!active && notice && notice !== "Finished reading." && (
        <span className="tracking-normal normal-case">{notice}</span>
      )}

      {active && (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 tracking-normal normal-case">
          <div
            ref={player}
            role="region"
            aria-label="Read-aloud player"
            className="flex items-center gap-1.5 rounded-full border border-border bg-background/90 p-1.5 pr-2 font-sans text-foreground shadow-2xl backdrop-blur-xl sm:gap-2"
          >
            <button
              type="button"
              onClick={status === "playing" ? pause : resume}
              aria-label={status === "playing" ? "Pause reading" : "Resume reading"}
              className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-contrast transition hover:opacity-85 sm:h-10 sm:w-10"
            >
              {status === "playing" ? (
                <Pause className="h-4 w-4" aria-hidden />
              ) : (
                <Play className="h-4 w-4 translate-x-px" aria-hidden />
              )}
            </button>
            <div className="flex w-32 flex-col gap-1.5 px-1 sm:w-44">
              <span className="truncate text-xs text-muted" title={notice || undefined}>
                {statusLine}
              </span>
              <span className="h-1 overflow-hidden rounded-full bg-accent-soft" aria-hidden>
                <span className="block h-full bg-foreground transition-[width] duration-500" style={{ width: `${percent}%` }} />
              </span>
            </div>
            <button
              type="button"
              onClick={cycleRate}
              aria-label={`Reading speed ${rate} times. Change speed`}
              className="h-11 min-w-12 rounded-full px-2 font-mono text-xs transition hover:bg-accent-soft sm:h-9"
            >
              {rate}×
            </button>
            <button
              type="button"
              onClick={() => stop()}
              aria-label="Stop reading"
              className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-accent-soft sm:h-9 sm:w-9"
            >
              <Square className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
