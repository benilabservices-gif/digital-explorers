interface KeyPointCardProps {
  /** emoji affiché en en-tête de carte */
  icon: string;
  /** titre de la carte (ex : À retenir, Astuce, Définition) */
  title: string;
  /** variante liste : items à cocher mentalement */
  items?: string[];
  ordered?: boolean;
  /** variante définition : terme mis en gras dans le texte */
  term?: string;
  /** corps texte (astuce, définition) */
  text?: string;
}

/** Corps d'une définition : le terme est mis en gras à sa première
 *  occurrence dans la phrase (il en est extrait par construction). */
function DefinitionBody({ term, text }: { term: string; text: string }) {
  const idx = text.indexOf(term);
  if (idx === -1) {
    return <p className="text-ink leading-relaxed"><strong className="text-ink font-semibold">{term}</strong> — {text}</p>;
  }
  return (
    <p className="text-ink leading-relaxed">
      {text.slice(0, idx)}
      <strong className="text-ink font-semibold">{term}</strong>
      {text.slice(idx + term.length)}
    </p>
  );
}

/** Carte « point clé » encadrée : listes à retenir, astuces de pro,
 *  définitions. Présentation pure, teintée par l'accent du monde. */
export default function KeyPointCard({ icon, title, items, ordered, term, text }: KeyPointCardProps) {
  return (
    <div className="rounded-2xl border world-border world-bg-soft p-5">
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden="true">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider world-accent">{title}</span>
      </div>
      {items && items.length > 0 ? (
        ordered ? (
          <ol className="list-decimal pl-5 space-y-1.5 text-ink leading-relaxed">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        ) : (
          <ul className="list-disc pl-5 space-y-1.5 text-ink leading-relaxed">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        )
      ) : term && text ? (
        <DefinitionBody term={term} text={text} />
      ) : (
        <p className="text-ink leading-relaxed">{text}</p>
      )}
    </div>
  );
}
