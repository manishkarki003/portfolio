import Navbar from "@/components/layout/Navbar";
import Projects from "@/components/sections/projects";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816]">
        <section className="flex min-h-[80vh] items-center justify-center px-6 pt-24">
          <div className="max-w-4xl text-center">
            <p className="mb-4 text-blue-400 uppercase tracking-[0.3em]">
              Freelance Web Developer
            </p>

            <h1 className="text-6xl font-black leading-tight text-white md:text-7xl">
              Building Modern
              <br />
              Digital Experiences
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400">
              I design and develop premium websites, business platforms, and web
              applications that are fast, responsive, and built to help companies
              grow.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#projects"
                className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500"
              >
                View Projects
              </a>

              <a
                href="#contact"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Hire Me
              </a>
            </div>
          </div>
        </section>
      </main>

      <Projects />
    </>
  );
}