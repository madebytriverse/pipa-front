import { motion } from "framer-motion";
import { IconHeart, IconTarget, IconUsers } from "@tabler/icons-react";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";

export default function AboutUs() {
  const teamMember = [
    { name: "Raul", role: "Designer & Full-Stack Developer", image: "https://res.cloudinary.com/dpbghs8ep/image/upload/v1762578745/RaulRecortefoto_hgcjlb.png" },
    { name: "John", role: "Full-Stack Developer", image: "https://res.cloudinary.com/dpbghs8ep/image/upload/v1762579265/johnfoto_qwa4xc.png" },
    { name: "Kristen", role: "Designer & Front-End Developer", image: "https://res.cloudinary.com/dpbghs8ep/image/upload/v1762569159/kris2Kfoto_pdzhwo.png" },
    { name: "Andres", role: "Full-Stack Developer", image: "https://res.cloudinary.com/dpbghs8ep/image/upload/v1762578753/andresfoto-removebg-preview_aav7ni.png" },
    { name: "Alejandro", role: "Quality Assurance", image: "https://res.cloudinary.com/dpbghs8ep/image/upload/v1762560451/AlejandroFoto_pqtukx.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <section className="relative text-center py-20 sm:py-28 bg-gradient-to-br from-contrast-main via-contrast-secondary to-main text-white font-quicksand overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 px-4"
        >
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Conoce a <span className="font-fugaz">TukiShop</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/90 leading-relaxed mb-8">
            Creemos que cada tienda local y cada emprendedor tiene una historia que contar.
            En <span className="font-semibold text-white">TukiShop</span> unimos tecnología, diseño y pasión
            para transformar esas historias en experiencias digitales memorables.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-28 sm:w-40 h-1 rounded-full bg-white/50"></div>
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 sm:py-20 px-5 sm:px-16 text-center font-quicksand mx-auto max-w-[80rem]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-main-dark text-base sm:text-lg mb-10 sm:mb-12 leading-relaxed"
        >
          Creemos en el poder del comercio digital, pero sobre todo en el valor humano detrás de cada producto.
          Estas son las tres fuerzas que impulsan nuestro camino día a día:
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
          {[
            {
              icon: <IconTarget className="w-10 h-10 text-main mx-auto mb-4" />,
              title: "Nuestra Misión",
              text: "Simplificar el comercio digital y ayudar a las pequeñas tiendas a crecer en el mundo online con herramientas accesibles y efectivas.",
            },
            {
              icon: <IconHeart className="w-10 h-10 text-contrast-main mx-auto mb-4" />,
              title: "Nuestra Visión",
              text: "Convertirnos en la plataforma favorita de venta en línea para emprendedores, destacando por confianza, diseño y cercanía.",
            },
            {
              icon: <IconUsers className="w-10 h-10 text-contrast-secondary mx-auto mb-4" />,
              title: "Lo que Nos Mueve",
              text: "La innovación, la colaboración y la pasión por ofrecer experiencias digitales memorables tanto para tiendas como para compradores.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + i * 0.1 }}
              className="bg-white/30 shadow-md rounded-2xl p-6 sm:p-8 border border-gray-100 backdrop-blur-sm"
            >
              {item.icon}
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-main-dark">
                {item.title}
              </h3>
              <p className="text-main-dark text-sm sm:text-base leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="pt-10 pb-16 sm:pb-20 px-5 sm:px-16 font-quicksand">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-bold text-center text-main-dark"
        >
          Nuestro Equipo
        </motion.h2>

        <div className="my-4 sm:my-5 w-28 sm:w-40 h-1 mx-auto rounded-full bg-gradient-to-r from-main via-contrast-secondary to-contrast-main"></div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-main-dark/80 max-w-2xl mx-auto mb-12 sm:mb-16 text-base sm:text-lg leading-relaxed"
        >
          Somos un grupo de soñadores, programadores, diseñadores y creadores
          que compartimos una misma meta: construir una experiencia de compra
          que conecte personas reales con marcas auténticas.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 max-w-7xl mx-auto">
          {teamMember.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col items-center justify-end w-56 h-[28rem] rounded-[3rem] overflow-hidden shadow-lg text-center group transition-all duration-500 hover:scale-[1.03]
                ${i === 0
                  ? "bg-gradient-to-r from-main to-contrast-secondary"
                  : i === 1
                    ? "bg-gradient-to-r from-contrast-secondary to-contrast-main"
                    : i === 2
                      ? "bg-contrast-main"
                      : i === 3
                        ? "bg-gradient-to-l from-contrast-secondary to-contrast-main"
                        : "bg-gradient-to-l from-main to-contrast-secondary"
                }`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
              <div className="relative z-10 p-5 text-white group-hover:-translate-y-6 group-hover:scale-110 transition-all duration-500">
                <h4 className="text-lg font-semibold tracking-wide uppercase mb-1">
                  {member.name}
                </h4>
                <p className="text-sm opacity-90">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
