import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"ClosingFrame — video-to-close attribution",description:"A fictional real-estate video attribution workflow connecting content signals to leads, showings and closed revenue."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
