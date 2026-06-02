import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import { IconSearch } from "@tabler/icons-react";

export default function HelpPage() {
  useEffect(() => {
    document.title = "Centro de Ayuda | TukiShop";
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      title: "Compradores",
      faqs: [
        {
          question: "¿Cómo realizo una compra?",
          answer:
            "Navega por las categorías, selecciona un producto y agrégalo al carrito. Luego sigue los pasos del proceso de pago para completar tu compra de manera segura.",
        },
        {
          question: "¿Cómo rastreo mi pedido?",
          answer:
            "Puedes ver el estado de tu pedido desde la sección 'Mis compras' en tu perfil. Allí verás si fue aceptado, enviado o entregado.",
        },
        {
          question: "¿Qué pasa si no recibo mi pedido?",
          answer:
            "Si tu pedido no llega, puedes abrir un reporte desde 'Reportar un problema' o contactar al vendedor directamente. Si no obtienes respuesta, nuestro equipo de soporte intervendrá.",
        },
        {
          question: "¿Puedo guardar productos para comprar después?",
          answer: "¡Claro! Puedes agregarlos a tu lista de deseos (wishlist) y acceder a ellos fácilmente desde tu perfil cuando quieras."
        },
        {
          question: "¿Cómo puedo calificar o dejar una reseña?",
          answer: "Después de recibir tu pedido, podrás dejar una reseña desde la página del producto. Tu opinión ayuda a otros usuarios y mejora la confianza en los vendedores."
        }
      ],
    },
    {
      title: "Vendedores",
      faqs: [
        {
          question: "¿Cómo puedo registrarme como vendedor?",
          answer:
            "En la barra de navegación, selecciona la opción 'Vender' y completa el formulario con la información de tu tienda. Una vez verificada, podrás comenzar a subir tus productos.",
        },
        {
          question: "¿Cómo verifico mi tienda?",
          answer:
            "TukiShop revisa la información que envíes al registrarte. Una vez verificada, recibirás una notificación y podrás publicar productos.",
        },
        {
          question: "¿Puedo ofrecer cupones o descuentos?",
          answer:
            "Sí. Desde tu panel de vendedor puedes crear cupones de descuento o envío gratis, visibles para tus clientes.",
        },
        {
          question: "¿Cuánto tarda en aprobarse mi tienda?",
          answer: "La verificación puede tardar entre 24 y 48 horas. Un miembro del equipo de TukiShop se comunicará contigo y luego recibirás un correo de confirmación cuando tu tienda esté lista para publicar productos."
        },
        {
          question: "¿Cómo subo mis productos correctamente?",
          answer: "Desde tu panel de vendedor, selecciona 'Mis productos' y presiona 'Agregar nuevo'. Asegúrate de incluir fotos claras, precios correctos y una descripción completa para destacar tu producto."
        },
        {
          question: "¿Puedo editar o pausar productos ya publicados?",
          answer: "Sí. En tu panel de vendedor puedes editar precios, imágenes o descripciones, o pausar un producto temporalmente sin eliminarlo."
        },
        {
          question: "¿Cómo puedo destacar mi tienda?",
          answer: "Puedes participar en campañas promocionales, usar banners personalizados o solicitar aparecer en la sección 'Tiendas destacadas' contactando al equipo de TukiShop."
        }
      ],
    },
    {
      title: "Pagos y Seguridad",
      faqs: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer:
            "Aceptamos pagos con tarjetas de crédito y débito, y métodos digitales seleccionados por TukiShop.",
        },
        {
          question: "¿Mis pagos están protegidos?",
          answer:
            "Sí, usamos plataformas seguras como Stripe para procesar tus pagos de forma cifrada y confiable.",
        },
        {
          question: "¿Qué pasa si el pago falla?",
          answer: "Si el pago no se procesa, revisa que tu tarjeta esté activa o intenta nuevamente con otro método. Si el problema persiste, contacta a soporte con el número de pedido."
        },
        {
          question: "¿TukiShop almacena mis datos bancarios?",
          answer: "No. Los pagos son procesados por plataformas externas seguras (Stripe o PayPal), y TukiShop nunca guarda información bancaria de los usuarios."
        },
        {
          question: "¿Qué hago si detecto actividad sospechosa en mi cuenta?",
          answer: "Cambia tu contraseña de inmediato y contacta al soporte técnico. Nuestro equipo revisará cualquier acceso o movimiento sospechoso."
        }
      ],
    },
    {
      title: "Soporte y Comunidad",
      faqs: [
        {
          question: "¿Cómo puedo contactar al soporte?",
          answer:
            "Puedes comunicarte con nuestro equipo a través del formulario de contacto o mediante nuestro correo de soporte: ecomucr2025@gmail.com. También atendemos consultas por WhatsApp durante horarios laborales.",
        },
        {
          question: "¿Tienen atención al cliente fuera del horario laboral?",
          answer: "Nuestro equipo responde mensajes dentro del horario laboral (8:00 a.m. a 6:00 p.m.), pero puedes enviar tu consulta en cualquier momento y la atenderemos lo antes posible."
        },
        {
          question: "¿Qué es TukiShop?",
          answer:
            "TukiShop es una plataforma creada para conectar a usuarios con tiendas locales y emprendedores. Ofrecemos un espacio moderno, seguro y fácil de usar para explorar, comprar y vender productos únicos.",
        },
        {
          question: "¿TukiShop opera solo en Costa Rica?",
          answer: "Por ahora sí, tenemos un compromiso con el pueblo costarricense y queremos que todos puedan comprar y vender en TukiShop."
        }
      ],
    },
  ];

  const filteredSections = sections.map((section) => ({
    ...section,
    faqs: section.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen flex flex-col font-quicksand bg-crema">
      <NavBar />

      {/* Hero */}
      <section className="text-center py-24 bg-chocolate text-white shadow-inner">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-md">
          Centro de Ayuda
        </h1>
        <p className="max-w-2xl mx-auto text-white/90 text-lg">
          Encuentra respuestas y aprende a aprovechar al máximo TukiShop.
        </p>
      </section>

      {/* Search bar */}
      <section className="py-10 px-6 md:px-16 max-w-4xl mx-auto w-full">
        <div className="relative w-full md:w-2/3 mx-auto">
          <IconSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Busca una pregunta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-main shadow-sm"
          />
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-20 px-6 md:px-16 max-w-4xl mx-auto w-full flex-grow">
        {filteredSections.map(
          (section, index) =>
            section.faqs.length > 0 && (
              <div key={index} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-main border-l-8 border-contrast-secondary pl-4">
                  {section.title}
                </h2>

                <Accordion type="single" collapsible className="w-full space-y-4">
                  {section.faqs.map((faq, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`item-${index}-${idx}`}
                      className="group border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm"
                    >
                      <AccordionTrigger className="text-left text-lg font-medium hover:text-main transition-all duration-200 px-5 py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-main text-base leading-relaxed px-6 pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )
        )}
      </section>

      {/* Community section */}
      <section className="bg-gradient-to-br from-main via-contrast-secondary to-contrast-main text-white text-center py-20 px-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-4 drop-shadow-sm">
          Nuestra comunidad
        </h2>
        <p className="max-w-3xl mx-auto text-white/90 leading-relaxed text-lg">
          En TukiShop creemos en apoyar el talento local. Cada compra impulsa a
          emprendedores costarricenses y negocios independientes. Gracias por
          ser parte de esta comunidad que crece cada día.
        </p>
      </section>

      {/* Useful Links */}
      <section className="text-center py-16 space-y-5 bg-white">
        <p className="text-gray-main text-lg">
          ¿No encontraste lo que buscabas?
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          <a
            href="/reportproblem"
            className="px-6 py-3 bg-main text-white rounded-xl hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            Reportar un problema
          </a>
          <a
            href="/contact"
            className="px-6 py-3 bg-contrast-main text-white rounded-xl hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            Contactar soporte
          </a>
          <a
            href="/besellerpage"
            className="px-6 py-3 bg-contrast-secondary text-white rounded-xl hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            Registrar tienda
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
