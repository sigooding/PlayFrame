"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="not-found"><span className="not-found-brand">frame.</span><span className="eyebrow">A BRIEF INTERMISSION</span><h1>Let’s take that<br />from the top.</h1><p>The workspace couldn’t connect just now. Your saved projects are safe.<br />Give it another try in a moment.</p><button className="button button-primary" onClick={reset}>Try again →</button></main>;
}
