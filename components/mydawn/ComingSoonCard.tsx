type Props = {
  title: string;
  description: string;
};

export function ComingSoonCard({ title, description }: Props) {
  return (
    <div className="border-t border-pa-border/25 pt-6">
      <p className="text-[10px] tracking-[0.2em] text-pa-muted/55 uppercase">Status</p>
      <h3 className="mt-3 font-display text-xl font-medium text-[#F3EDE3]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-pa-muted">{description}</p>
    </div>
  );
}
