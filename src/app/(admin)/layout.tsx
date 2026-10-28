import "@/app/globals.css";
import Sidebarmenu from "@/components/sidebarmenu";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body className="h-dvh w-screen flex flex-col overflow-hidden m-0">
        <Sidebarmenu>
          {children}
        </Sidebarmenu>
      </body>
    </html>
  );
}