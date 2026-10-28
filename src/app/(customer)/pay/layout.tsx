import "@/app/globals.css";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body className="h-dvh w-screen flex flex-col overflow-hidden m-0">
        {children}
      </body>
    </html>
  );
}