import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { cn } from "@/lib/utils";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Eggregator",
  description: "See your crypto in one place.",
};

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <html>
      <body>
        <>
          <div className="container relative">
            <section>
              {/* <ExamplesNav /> */}
              <div className="mt-6 overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
                {children}
              </div>
            </section>
          </div>
        </>
      </body>
    </html>
  );
}
