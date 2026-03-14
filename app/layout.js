import "./globals.css";
import Navbar from "@/components/Navbar";
import { TanstackProviders } from "../providers/TanstackProviders";

export const metadata = {
  title: "মিজান সাইবার মাস্টার",
  description: "মিজান সাইবার মাস্টার অল ইন ওয়ান অনলাইন হেল্পার",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <TanstackProviders>

          <Navbar />

          <div className="pt-20 max-w-4xl mx-auto">
            {children}
          </div>

        </TanstackProviders>
      </body>
    </html>
  );
}