import { Cormorant_Garamond, Nothing_You_Could_Do } from "next/font/google";

/** Site-wide body / display — same as the top letter */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

/** Quiet handwritten letter signature only */
export const letterScript = Nothing_You_Could_Do({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature",
  display: "swap",
});
