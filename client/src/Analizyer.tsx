
import { useLayoutEffect, useRef, useState } from 'react';
import XMLICON from './assets/xml-icon.png';
import { InvoiceTable, Modal } from './components';
import { ReceiptTable } from './components/ReceiptTable';
import X2JS from "x2js"
// const options = [
//   {
//     value : 'RH',
//     message : 'Recibo por Honorarios'
//   },
//   {
//     value : 'FC',
//     message : 'Factura'
//   }
// ]

export const Analizyer = () => {
  const divDropContainer = useRef<HTMLDivElement>(null)
  const [xml, setXML] = useState<Document>()
  // const [documentType,setDocumentType] = useState<any>(-1)
  const [xmlString,setXmlString] = useState<string>("")
  const [esRecibo,setEsRecibo] = useState(true)
  useLayoutEffect(() => {
    divDropContainer.current?.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    divDropContainer.current?.addEventListener('dragleave', (e) => {
      e.preventDefault();
    });
    divDropContainer.current?.addEventListener('dragover', (e) => {
      e.preventDefault();
      divDropContainer.current?.classList.add('drop');
  });
  divDropContainer.current?.addEventListener('dragleave', (e) => {
      e.preventDefault();
      divDropContainer.current?.classList.remove('drop');
  });

    divDropContainer.current?.addEventListener('drop', (e: any) => {
      e.preventDefault()
      divDropContainer.current?.classList.remove('drop');
      const fileXML = e.dataTransfer.files[0]
      // if(documentType == -1) {
      //   setXML(undefined)
      //   return
      // }
      let reader = new FileReader();
      reader.readAsText(fileXML);
      reader.onloadend = function () {
          let XMLData = reader.result as string;
          let parser = new DOMParser();
          let xmlDOM = parser.parseFromString(XMLData, 'application/xml');
          setXML(xmlDOM);
          setXmlString(XMLData)
          
          var x2js = new X2JS();
          var json = x2js.xml2js(XMLData) as any
          console.log(Object.hasOwn(json.Invoice,'DueDate'))
          setEsRecibo(!Object.hasOwn(json.Invoice,'DueDate') && Object.hasOwn(json.Invoice,'ExpiryDate'))
        }
      
    })
  // }, [documentType])
  }, [])

  return (
    <>
      <div className="w-[min(100%,600px)] h-[min(90vh,650px)] relative rounded-xl m-auto overflow-hidden bg-white flex justify-center items-center transition-all shadow-xl p-3">
        <div className="w-full h-full border rounded-xl p-3 flex flex-col">
          <h1 className="text-[#697388] font-semibold">Analizador de XML</h1>
          <div className="grid gap-2 p-2">
            {/* <h1 className="text-center text-[#929AAB] text-lg font-semibold">Selecciona el tipo de documento</h1>
            <div className="w-full m-auto sm:w-2/3">
              <select id="large" className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus:ring-blue-500 focus:border-blue-500 select"
                value={documentType}
                onChange={(e)=>setDocumentType(e.target.value)}
              >
                <option value={-1} disabled>Elige el tipo de documento</option>
                {
                  options.map(item=><option value={item.value} key={item.value}>{ item.message }</option>)
                }
              </select>
            </div> */}
            <p className="flex text-[#727374]">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#48BBD9" className="w-6 h-6">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Asegurate que el archivo que arrastres sea un archivo con extension <strong>.xml</strong></span>
            </p>
          </div>
          <div className="relative flex-1 mt-2">
            <div className='w-full h-full flex flex-col items-center justify-center gap-3'>
              <img src={XMLICON} alt="" className='w-40 h-40' />
              <h1 className='text-xl sm:text-4xl text-center'>Arrastra aqui el archivo <strong>XML</strong></h1>
            </div>
            <div className="bg-slate-400/25 absolute inset-0 rounded-xl" ref={divDropContainer}></div>
          </div>
        </div>
      </div>
      {
        (!!xml) && <Modal closeModal={() => {
            setXML(undefined)
            // setDocumentType(-1)
          }  }>
          {
            esRecibo ?  <ReceiptTable xml={xmlString} /> : <InvoiceTable XMLData={xmlString} xml={xml} />
          }

        </Modal>
      }
    </>
  )
}
