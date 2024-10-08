import EchoAuthBanner from "@/public/images/echo-auth-banner.gif";
import EchoAuthBannerMobile from "@/public/images/report-form-banner.gif";
import Logo from "@/components/ui/logo";
import VerticalLines from "@/components/vertical-lines";
import BgShapes from "@/components/bg-shapes";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VerticalLines />
      <BgShapes />

      <section className="grid lg:grid-cols-2 h-screen">
        <div
          className="lg:hidden max-h-[150px] w-full grid place-items-center mb-10 py-2"
          style={{
            backgroundImage: `url(${EchoAuthBannerMobile.src}) `,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div className="grid lg:place-items-center">
          <div className="absolute top-0 left-0">
            <div className="fixed lg:static w-full lg:w-auto top-0 left-0 p-4 z-10">
              <div className="relative flex items-center justify-between gap-x-2 min-w-40 h-12 bg-gradient-to-b from-white/90 to-white/70 dark:from-gray-700/80 dark:to-gray-700/70 rounded-lg px-3 shadow">
                <div
                  className="absolute -inset-1.5 bg-indigo-500/15 dark:bg-gray-800/50 rounded-sm -z-10 before:absolute before:inset-y-0 before:left-0 before:w-[10px] before:bg-[length:10px_10px] before:[background-position:top_center,bottom_center] before:bg-no-repeat before:[background-image:radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1px,transparent_1px),radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1px,transparent_1px)] dark:before:[background-image:radial-gradient(circle_at_center,theme(colors.gray.600/.56)_1px,transparent_1px),radial-gradient(circle_at_center,theme(colors.gray.600/.56)_1px,transparent_1px)] after:absolute after:inset-y-0 after:right-0 after:w-[10px] after:bg-[length:10px_10px] after:[background-position:top_center,bottom_center] after:bg-no-repeat after:[background-image:radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1px,transparent_1px),radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1px,transparent_1px)] dark:after:[background-image:radial-gradient(circle_at_center,theme(colors.gray.600/.56)_1px,transparent_1px),radial-gradient(circle_at_center,theme(colors.gray.600/.56)_1px,transparent_1px)]"
                  aria-hidden="true"
                />

                <Logo />

                <ThemeToggle />
              </div>
            </div>
          </div>
          <main className="main max-w-[540px] w-full mx-auto px-5">
            {children}
          </main>
        </div>
        <div
          className="hidden lg:grid place-items-center"
          style={{
            backgroundImage: `url(${EchoAuthBanner.src}) `,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
      </section>
    </>
  );
}
