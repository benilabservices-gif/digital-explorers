import Link from "next/link";
import packageJson from "../../package.json";
import { WORLDS } from "@/data/content";
import { Motif } from "@/components/brand/motif";

// ─────────────────────────────────────────────────────────────────────────────
// SiteFooter — footer unique partagé (remplace les 7 footers dupliqués).
// La version affichée est lue depuis package.json — plus de « v3.0.0 » codé en dur.
// ─────────────────────────────────────────────────────────────────────────────

const columnTitle = "mb-4 text-sm font-semibold text-ink";
const columnLink =
  "block rounded-md py-1 text-sm text-ink-faint transition-colors duration-250 hover:text-ink";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-night-900">
      <Motif variant="kente" className="h-1.5 w-full text-sunrise-500/50" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-sunrise-500 to-gleam-400 font-display text-xs font-bold text-night-950"
              >
                DE
              </span>
              <span className="font-display text-lg font-bold text-ink">Digital Explorers</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">
              Découvre le monde numérique. Trouve ta voie. Imagine ton futur.
            </p>
          </div>

          <nav aria-label="Mondes">
            <h4 className={columnTitle}>Mondes</h4>
            <ul className="space-y-1">
              {WORLDS.slice(0, 5).map((w) => (
                <li key={w.id}>
                  <Link href="/worlds" className={columnLink}>
                    {w.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Espaces">
            <h4 className={columnTitle}>Espaces</h4>
            <ul className="space-y-1">
              <li><Link href="/dashboard" className={columnLink}>Dashboard</Link></li>
              <li><Link href="/parent" className={columnLink}>Espace Parent</Link></li>
              <li><Link href="/portfolio" className={columnLink}>Portfolio</Link></li>
            </ul>
          </nav>

          <nav aria-label="Liens">
            <h4 className={columnTitle}>Liens</h4>
            <ul className="space-y-1">
              <li><Link href="/pricing" className={columnLink}>Tarifs</Link></li>
              <li>
                <Link
                  href="https://geekcoding4kids.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={columnLink}
                >
                  GeekCoding4Kids
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/benilabservices-gif"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={columnLink}
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Digital Explorers — BENILAB. Fait avec ❤️ en Afrique.</p>
          <p className="font-mono text-xs" data-testid="footer-version">
            v{packageJson.version}
          </p>
        </div>
      </div>
    </footer>
  );
}
