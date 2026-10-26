import { useState } from "react";
import Modal from "./modales/ModalBase";
import { FiClock, FiInfo, FiMoon, FiSun, FiX } from "react-icons/fi";

const LeyendaHorarios = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const turnos = [
    {
      nombre: "Matutino",
      icon: FiSun,
      color: "text-[#F59E0B]",
      rangos: ["07:00 - 07:30", "09:30 - 10:00", "12:00 - 12:30"],
    },
    {
      nombre: "Vespertino",
      icon: FiSun,
      color: "text-[#3B82F6]",
      rangos: ["15:00 - 15:30", "17:30 - 18:00", "20:00 - 20:30"],
    },
    {
      nombre: "Nocturno",
      icon: FiMoon,
      color: "text-[#1E3A8A]",
      rangos: ["22:30 - 23:00", "01:00 - 01:30", "03:30 - 04:00"],
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`
          flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 text-sm
          font-semibold text-[#1E3A8A] transition hover:border-[#93C5FD] hover:bg-[#DBEAFE]
        ${className}  `}
      >
        <FiInfo className="h-4 w-4" />
        Horarios
      </button>

      {isOpen && (
        <Modal size="lg" isOpen appElement={document.getElementById('root')} onRequestClose={() => setIsOpen(false)}
          contentLabel="Horarios de surtido" className="am-kind-horarios"
          >
          <section className="w-full">
            <header className="
              flex items-center justify-between gap-[14px] pt-6 pr-6 pb-6 pl-6
              [&&]:[background:linear-gradient(115deg,_#143363,_#245196)] [border-bottom-width:1px]
              [border-bottom-style:solid] [&&]:[border-bottom-color:#315e9d] [&&]:text-[#e1eeff] max-[650.001px]:gap-[10px]
              max-[650.001px]:pt-5 max-[650.001px]:pr-5 max-[650.001px]:pb-5 max-[650.001px]:pl-5 [&_>_div:only-child]:w-full
              [&_h2]:text-[length:21px] [&_h2]:font-[650] [&_h2]:leading-[1.3] [&_h2]:tracking-[-.025em] [&&_h2]:text-white
              max-[650.001px]:[&_h2]:text-[length:19px] [&_h3]:text-[length:18px] [&_h3]:font-[650] [&&_h3]:text-white
              [&_p]:text-[length:13px] [&&_p]:text-[#d4e5fc] [&_p]:leading-[1.65] [&_p]:mt-[5px]
              max-[650.001px]:[&_p]:text-[length:12px] [&&_[class*='bg-blue-100']]:[background:#ffffff1c]
              [&&_[class*='bg-blue-100']]:text-[#bceeff] [&_[class*='bg-blue-100']]:rounded-[12px]
              [&_[class*='bg-blue-100']]:pt-[11px] [&_[class*='bg-blue-100']]:pr-[11px] [&_[class*='bg-blue-100']]:pb-[11px]
              [&_[class*='bg-blue-100']]:pl-[11px] [&&_[class*='bg-green-100']]:[background:#ffffff1c]
              [&&_[class*='bg-green-100']]:text-[#bceeff] [&_[class*='bg-green-100']]:rounded-[12px]
              [&_[class*='bg-green-100']]:pt-[11px] [&_[class*='bg-green-100']]:pr-[11px]
              [&_[class*='bg-green-100']]:pb-[11px] [&_[class*='bg-green-100']]:pl-[11px] [&&_.text-green-600]:text-[#bceeff]
              [&&_.text-blue-600]:text-[#bceeff]
            ">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1E3A8A]">
                  <FiClock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
                    Captura
                  </p>
                  <h3 className="text-lg font-semibold text-[#0F172A]">Horarios de solicitudes</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center justify-center self-start shrink-0 w-8 h-8 [&&]:[background:#ffffff15] [&&]:text-white
                  pt-[6px] pr-[6px] pb-[6px] pl-[6px] rounded-[10px] ml-auto border border-solid [&&]:border-[#bdd7ff55]
                  [&&:hover]:[background:#ffffff2b] [&&:hover]:text-white [&&:hover]:border-[#d0e4ff99] [&_>_svg]:w-[17px]
                  [&_>_svg]:h-[17px] [&_>_svg]:text-inherit
                " aria-label="Cerrar horarios"
              >
                <FiX className="h-5 w-5" />
              </button>
            </header>

            <div className="p-5">
              <div className="mb-4 flex items-start gap-3 rounded-2xl bg-[#EFF6FF] p-3 text-sm text-[#1E3A8A]">
                <FiInfo className="mt-0.5 h-4 w-4 flex-none" />
                <p>
                  Las solicitudes levantadas fuera de estos horarios seran surtidas hasta el siguiente rango permitido.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {turnos.map((turno) => {
                  const Icono = turno.icon;
                  return (
                    <article key={turno.nombre} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Icono className={` h-4 w-4  ${turno.color}  `} />
                        <h4 className="font-semibold text-[#0F172A]">{turno.nombre}</h4>
                      </div>
                      <div className="space-y-2">
                        {turno.rangos.map((rango, index) => (
                          <div key={rango} className="rounded-xl bg-white px-3 py-2 text-sm text-[#334155]">
                            <span className="mr-2 text-xs font-semibold text-[#94A3B8]">{index + 1}.</span>
                            {rango}
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </Modal>
      )}
    </>
  );
};

export default LeyendaHorarios;
