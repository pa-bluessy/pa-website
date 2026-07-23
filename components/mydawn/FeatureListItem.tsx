type Props = {
  title: string;
  description: string;
  index: number;
};

export function FeatureListItem({ title, description, index }: Props) {
  return (
    <li className="flex gap-4 border-b border-pa-border/25 py-5 last:border-b-0 md:gap-6 md:py-6">
      <span className="w-8 shrink-0 text-[10px] tracking-[0.16em] text-pa-muted/50">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3 className="font-display text-base font-medium text-[#F3EDE3] md:text-lg">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-pa-muted">{description}</p>
      </div>
    </li>
  );
}
