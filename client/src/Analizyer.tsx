
export const Analizyer = () => {
  return (
    <div className="w-[min(100%,600px)] h-[min(90vh,650px)] relative rounded-xl m-auto overflow-hidden bg-white flex justify-center items-center transition-all shadow-xl p-3">
      <div className="w-full h-full border p-2">
        <h1 className="text-[#697388] font-semibold">Analizador de XML</h1>
        <div className="grid gap-2 p-2">
          <h1 className="text-center text-[#929AAB] text-lg font-semibold">Selecciona el tipo de documento</h1>
          <div className="w-full m-auto sm:w-2/3">
            <select id="large" className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus:ring-blue-500 focus:border-blue-500 select">
              <option disabled selected>Elige el tipo de documento</option>
              <option value="RH">Recibo por Honorarios</option>
              <option value="FC">Factura</option>
            </select>
          </div>
          <p className="flex text-[#727374]">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#48BBD9" className="w-6 h-6">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Asegurate que el archivo que arrastres sea un archivo con extension <strong>.xml</strong></span>
          </p>
        </div>
        <div>
          <p></p>
          <div></div>
        </div>
      </div>
    </div>
  )
}
