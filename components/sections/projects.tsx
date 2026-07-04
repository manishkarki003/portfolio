import Image from "next/image";

const projects = [
  {
    title: "Boilers Nepal",
    description:
      "Industrial steam boiler manufacturer and engineering company based in Nepal.",
    image: "/images/project/boilersnepal.png",
    url: "https://boilersnepal.com",
  },
  {
    title: "Valves Nepal",
    description:
      "Industrial valves, steam systems and flow control solutions for Nepalese industries.",
    image: "/images/project/valvesnepal.png",
    url: "https://valvesnepal.com",
  },
];

export default function Projects() {
  return (
   <section id="projects" className="bg-[#050816] pt-8 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-5xl font-bold text-white mb-16">
          Featured Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project) => (
            <div
              key={project.title}
              className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={1400}
                height={800}
               className="w-full aspect-video object-cover"
              />

              <div className="p-6">
                <h3 className="text-3xl font-bold text-white">
                  {project.title}
                </h3>

                <p className="mt-4 text-slate-400 leading-7">
                  {project.description}
                </p>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                  Visit Website →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}