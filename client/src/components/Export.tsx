import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {uid} from 'uid'

type ExportProps = {
  factura : {
    FechaDocumento : string,
    num_factura: string,
    venta : number,
    igv : number,
    total : number,
    detraccion : number,
    a_pagar: number
  }[]
}
export const Export = ({ factura } : ExportProps) => {
  
  const fileType = "xlsx"
  const exportToCSV = () => {
    const obj = {
      Sheets:{
        factura : XLSX.utils.json_to_sheet(factura as any)
      },
      SheetNames:["factura"]
    }
    const excelBuffer = XLSX.write(obj, {bookType:"xlsx", type:"array"});
    const data = new Blob([excelBuffer], {type:fileType});
    const filename = `factura-excel-${uid()}.${fileType}` 
    FileSaver.saveAs(data, filename)
  }
  return (
    <button
      className="absolute bottom-4 right-4 bg-[#33C481] rounded-full w-16 h-16 z-40 grid place-items-center text-white shadow-2xl"
      title="exportar a excel"
      onClick={exportToCSV}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 scale-150"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
    </button>
  );
};
