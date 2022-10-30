import { useLayoutEffect, useRef, useState } from "react"
import { Modal,InvoiceTable } from "./components";

function App() {

  const [xml, setXML] = useState<Document>()
  const divDropContainer = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    divDropContainer.current?.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    divDropContainer.current?.addEventListener('dragleave', (e) => {
      e.preventDefault();
    });
    divDropContainer.current?.addEventListener('dragover', (e) => {
      e.preventDefault();
      const parent = divDropContainer.current?.parentNode as Element 
      parent.classList.add('dd-select');
  });
  divDropContainer.current?.addEventListener('dragleave', (e) => {
      e.preventDefault();
      const parent = divDropContainer.current?.parentNode as Element 
      parent.classList.remove('dd-select');
  });

    divDropContainer.current?.addEventListener('drop', (e: any) => {
      e.preventDefault()
      const parent = divDropContainer.current?.parentNode as Element 
      parent.classList.remove('dd-select');
      const fileXML = e.dataTransfer.files[0]
      let reader = new FileReader();
      reader.readAsText(fileXML);
      reader.onloadend = function () {
        /* console.log(reader.result); */
        let XMLData = reader.result as string;
        let parser = new DOMParser();
        let xmlDOM = parser.parseFromString(XMLData, 'application/xml');
        setXML(xmlDOM);
      }
    })
  }, [])

  return (
    <>
      <div className="w-[min(100%,500px)] h-[500px] relative rounded-xl m-auto overflow-hidden bg-white flex justify-center items-center flex-col gap-5 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6B7280" className="w-6 h-6 scale-150">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
        </svg>

        <div className="font-bold text-center uppercase w-[30%] text-gray-500 leading-7 tracking-widest">Arrastre aquí el archivo xml para el análisis de la factura</div>
        <div className="w-full h-full shadow-lg p-7 absolute inset-0 z-20" ref={divDropContainer}>
          <div className="w-fulll h-full border-dotted border-[#D2D6DB] border-4 rounded-xl" />
        </div>
      </div>
      {
        xml && <Modal closeModal={() => setXML(undefined)  }>
          <InvoiceTable xml={xml} />
        </Modal>
      }
    </>
  )
}

export default App
