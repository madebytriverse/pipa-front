// BannerComponent.tsx
import { Link } from "react-router-dom";
import ButtonComponent from "../ui/ButtonComponent";

interface BannerComponentProps {
  id?: number;
  title?: string;
  subtitle?: string;
  image: string;
  character?: string;
  link?: string;
  type: "LARGE" | "SHORT" | "SLIDER";
  position?: number;
  is_active?: boolean;
  orientation?: "LEFT" | "RIGTH";
  btn_text?: string;
  btn_color?: "MORADO" | "AMARILLO" | "NARANJA" | "GRADIENTE";
  edit?: boolean;
}

export default function BannerComponent(props: BannerComponentProps) {
  const getButtonColor = () => {
    switch (props.btn_color) {
      case "MORADO":
        return "bg-main";
      case "AMARILLO":
        return "bg-contrast-main";
      case "NARANJA":
        return "bg-contrast-secondary";
      case "GRADIENTE":
        return "bg-naranja";
      default:
        return "bg-main";
    }
  };

  // 🔹 Banner tipo SLIDER (no se toca)
  if (props.type === "SLIDER") {
    return (
      <img
        src={props.image}
        alt={props.title ?? `Banner ${props.id}`}
        className="w-[90%] h-[80%] object-cover rounded-3xl"
      />
    );
  }

  // 🔹 Banner tipo LARGE (versión fiel al original)
  if (props.type === "LARGE") {
    const hasCharacter = !!props.character;

    return (
      <section className="relative w-full left-1/2 right-1/2 -translate-x-1/2 flex justify-center items-center my-10">
        <img
          className="w-full h-36 sm:h-auto rounded-2xl object-cover shadow-lg"
          src={
            props.image ??
            "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761936416/fondoNegro_pxlaji.png"
          }
          alt={props.title ?? "Banner TukiShop"}
        />
        <div className="absolute w-full space-x-10 flex z-10">
          <div
            className={`relative text-white top-0 sm:top-0 left-5 sm:left-25 ${hasCharacter ? "w-7/12 pt-2 sm:pt-8" : "w-[90%]"
              }`}
          >
            <p className="text-xl sm:text-7xl line-clamp-3 leading-7 sm:leading-tight pr-5 sm:pr-10 font font-quicksand font-bold">
              {props.title ?? "Crea una cuenta de vendedor en TukiShop"}
            </p>
            {!hasCharacter && props.link && props.btn_text && (
              <div className="mt-5 sm:mt-7">
                <Link to={props.link}>
                  <ButtonComponent
                    text={props.btn_text}
                    style={`${getButtonColor()} py-2 text-sm sm:text-lg px-4 w-[50%] sm:w-[30%] cursor-pointer text-white rounded-full sm:py-4 sm:px-4 font-quicksand shadow-lg transform hover:scale-105 transition-transform duration-300`}
                  />
                </Link>
              </div>
            )}
          </div>
          {hasCharacter && (
            <div className="relative w-5/12 h-full sm:top-0 right-3">
              <img src={props.character} alt="Character Banner" />
            </div>
          )}
        </div>
        {hasCharacter && props.link && props.btn_text && (
          <Link to={props.link}>
            <ButtonComponent
              text={props.btn_text}
              style={`${getButtonColor()} left-4 bottom-4 z-20 py-1 text-xs sm:text-lg px-2 w-[30%] cursor-pointer text-white rounded-full sm:py-4 sm:px-4 sm:w-[30%] sm:left-25 sm:bottom-14 font-quicksand absolute shadow-lg transform hover:scale-105 transition-transform duration-300`}
            />
          </Link>
        )}
      </section>
    );
  }


  if (props.type === "SHORT" && props.orientation === "LEFT") {
    return (
      <div className="w-[35rem] h-[12rem] sm:h-[17rem] flex items-end rounded-t-3xl rounded-b-2xl overflow-hidden relative transform sm:scale-100 max-w-full mx-auto">
        <div className="flex w-full absolute z-1 h-full sm:h-[16rem]">
          <div className="w-[50%] h-full flex flex-col justify-between py-3 sm:py-8 pl-5">
            <div className="text-left text-white text-lg sm:text-3xl font-quicksand font-bold">
              {props.title ?? "Todo, a un click de distancia"}
            </div>
            <div className="text-left text-white text-xs sm:text-base font-quicksand">
              {props.subtitle ??
                "Explora la gran cantidad de productos de tiendas nacionales."}
            </div>
            {props.btn_text && (
              <div>
                <ButtonComponent
                  text={props.btn_text ?? "Ver Productos"}
                  style={`px-2 truncate font-quicksand cursor-pointer text-sm sm:text-base text-white font-medium w-35 sm:w-45 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ${getButtonColor()}`}
                  onClick={() => {
                    if (props.link) {
                      if (props.link.startsWith("http")) {
                        window.open(props.link, "_blank");
                      } else {
                        window.location.href = props.link;
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="relative w-[50%] flex justify-center items-end overflow-visible">
            <img
              src={props.character}
              alt={props.title ?? `Banner ${props.id}`}
              className="absolute w-full sm:h-[17.5rem] object-contain -bottom-2 z-0"
            />
          </div>
        </div>

        <img
          src={props.image}
          alt={props.title ?? `Banner ${props.id}`}
          className="w-[35rem] h-[16.5rem] object-cover absolute rounded-t-3xl -bottom-2 z-0"
        />
      </div>
    );
  }
  if (props.type === "SHORT" && props.orientation === "RIGTH") {
    return (
      <div className="w-[35rem] h-[12rem] sm:h-[17rem] flex items-end rounded-t-3xl rounded-b-2xl overflow-hidden relative transform sm:scale-100 max-w-full mx-auto">
        <div className="flex w-full absolute z-1 h-full sm:h-[16rem]">
          <div className="relative w-[50%] flex justify-center items-end overflow-visible">
            <img
              src={props.character}
              alt={props.title ?? `Banner ${props.id}`}
              className="absolute w-full sm:h-[17.5rem] object-contain -bottom-4 z-0"
            />
          </div>

          <div className="w-[50%] h-full flex flex-col justify-between py-3 sm:py-8 pl-5">
            <div className="text-left text-white text-lg sm:text-3xl font-quicksand font-bold">
              {props.title ?? "Encuentra todo para tu perro."}
            </div>
            <div className="text-left text-white text-xs sm:text-base font-quicksand">
              {props.subtitle ?? "Alimentos, juguetes, premios y más para su bienestar."}
            </div>

            {props.btn_text && (
              <div>
                <ButtonComponent
                  text={props.btn_text ?? "Ver Productos"}
                  style={`px-2 truncate font-quicksand cursor-pointer text-sm sm:text-base text-white font-medium w-35 sm:w-45 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ${getButtonColor()}`}
                  onClick={() => {
                    if (props.link) {
                      if (props.link.startsWith("http")) {
                        window.open(props.link, "_blank");
                      } else {
                        window.location.href = props.link;
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <img
          src={props.image}
          alt={props.title ?? `Banner ${props.id}`}
          className="w-[35rem] h-[16.5rem] object-cover absolute rounded-t-3xl -bottom-2 z-0"
        />
      </div>
    );
  }
}
