import Image from "next/image";
import Link from "next/link";

type Props = {
  className?: string;
  /** Header seal size (default). Use "lg" for drawer/footer if needed. */
  size?: "sm" | "md";
};

/**
 * Wax-seal signature mark — burgundy sealing wax with embossed "Pa."
 */
export function BrandMark({ className = "", size = "sm" }: Props) {
  const px = size === "md" ? 96 : 72;

  return (
    <Link
      href="/"
      aria-label="pa. ホーム"
      className={`inline-block transition-opacity hover:opacity-90 ${className}`}
    >
      <Image
        src="/images/pa-wax-seal.png"
        alt="pa."
        width={px}
        height={px}
        className="h-auto w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
        style={{ width: px, height: "auto" }}
        priority
      />
    </Link>
  );
}
