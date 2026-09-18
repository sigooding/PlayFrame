import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span className="not-found-brand">frame.</span><span className="eyebrow">THIS SCENE ISN’T AVAILABLE</span><h1>Looks like we’ve<br />reached the end of the reel.</h1><p>This link may have been turned off, or the project has moved.<br />Ask the filmmaker for a fresh link.</p><Link className="button button-primary" href="/">Back to the workspace →</Link></main>;
}
