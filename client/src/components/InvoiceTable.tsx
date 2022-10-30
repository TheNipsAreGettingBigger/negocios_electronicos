import { useEffect, useState } from "react"
import { Result } from "../interfaces"
import { rucService } from "../services"
import { Export } from "./Export"
import { Spinner } from "./Spinner"
import { Tabs } from "./Tabs"

type TablaFacturaProps = {
  xml: Document
}

export const InvoiceTable = ({ xml }: TablaFacturaProps) => {

  const [rucInfomation,setRucInfomation] = useState<Result>()
  const [adquirenteInformation,setAdquirenteInformation] = useState<any>()
  const [factura,setFactura] = useState<any>({})
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const ruc = xml.getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].childNodes[0].nodeValue
    let fechaFacturacion = xml.getElementsByTagName("cbc:IssueDate")[0].childNodes[0].nodeValue;
    let referencia = xml.getElementsByTagName("cbc:ID")[0].childNodes[0].nodeValue;
    let totalVenta = +parseFloat(xml.getElementsByTagName("cbc:TaxableAmount")[0].childNodes[0].nodeValue as string).toFixed(2);
    const adquirente = xml.getElementsByTagName("cac:AccountingCustomerParty")[0].getElementsByTagName('cbc:RegistrationName')[0].childNodes[0].nodeValue
    const adquirenteRuc = xml.getElementsByTagName("cac:AccountingCustomerParty")[0].getElementsByTagName('cbc:ID')[0].childNodes[0].nodeValue
    let IGV = (totalVenta * 0.18).toFixed(2);
    let formaDePago = xml.getElementsByTagName('cac:PaymentTerms')[0].getElementsByTagName('cbc:PaymentMeansID')[0].childNodes[0].nodeValue
    let direccionEmisor = xml.getElementsByTagName('cac:BuyerCustomerParty')[0]?.getElementsByTagName('cbc:Line')[0].childNodes[0].nodeValue
    let tipoMoneda = xml.getElementsByTagName('cbc:DocumentCurrencyCode')[0].childNodes[0].nodeValue;
    let existeDetraccion = false
    let pagar = totalVenta+parseFloat(IGV)
    setFactura({
      ruc,
      fechaFacturacion,
      referencia,
      totalVenta,
      IGV,
      existeDetraccion,
      pagar,
      formaDePago,
      adquirente,
      adquirenteRuc,
      direccionEmisor,
      tipoMoneda
    })

    rucService(`${ruc}`).then(response=>{
      setRucInfomation(response.result)
      rucService(`${adquirenteRuc}`).then(response=>{
        setAdquirenteInformation(response.result)
        setLoading(false)
      })
    })

    if(isNaN(parseFloat(IGV)) || parseFloat(IGV)<=0) return
    if(totalVenta < 700) return
    existeDetraccion = true
    let detraccion = parseFloat(`${pagar * 0.12}`).toFixed(2)
    pagar = pagar - parseFloat(detraccion)
    setFactura((f:any)=>({
      ...f,
      pagar,
      detraccion,
      existeDetraccion
    }))
  },[])

  if(loading) return <Spinner />

  return (
    <>
    <div>
      <div className="border-stone-900 flex border-t-[1px] border-b-[1px] py-4 px-2">
        <div className="w-[70%]">
          <div className="p-2 grid gap-2">
          <p className="font-bold">{ rucInfomation?.razonSocial }</p>
          <p>{rucInfomation?.direccion}</p>
          <p>{rucInfomation?.distrito} - {rucInfomation?.provincia}</p>
          </div>
        </div>
        <div className="flex-1" >
          <div className="border-stone-900 border-[1px] p-2 text-center font-bold">
            <p>FACTURA ELECTRONICA</p>
            <p>RUC: {factura.ruc}</p>
            <p>{factura.referencia}</p>
          </div>
        </div>
      </div>
      <div>
      <div className="flex py-4 px-2 pb-0">
        <div className="w-[70%]">
          <p className="w-full flex">
            <span className="w-[40%] flex justify-between">
              <span>Fecha de Emision</span>
              <span>:</span>
            </span>
            <span className="w-[60%] ml-2 font-semibold">{factura.fechaFacturacion}</span>
          </p>
          <p className="w-full flex">
            <span className="w-[40%] flex justify-between">
              <span>Señor</span>
              <span>:</span>
            </span>
            <span className="w-[60%] ml-2 font-semibold">{factura.adquirente}</span>
          </p>
          <p className="w-full flex">
            <span className="w-[40%] flex justify-between">
              <span>Ruc</span>
              <span>:</span>
            </span>
            <span className="w-[60%] ml-2 font-semibold">{factura.adquirenteRuc}</span>
          </p>
          <p className="w-full flex">
            <span className="w-[40%] flex justify-between">
              <span>Dirección del Receptor de la factura</span>
              <span>:</span>
            </span>
            <span className="w-[60%] ml-2 font-semibold text-sm">{factura.direccionEmisor}</span>
          </p>
          <p className="w-full flex">
            <span className="w-[40%] flex justify-between">
              <span>Establecimiento del Emisor</span>
              <span>:</span>
            </span>
            <span className="w-[60%] ml-2 font-semibold text-sm">{rucInfomation?.distrito} - {rucInfomation?.provincia}</span>
          </p>
          <p className="w-full flex">
            <span className="w-[40%] flex justify-between">
              <span>Tipo de Moneda</span>
              <span>:</span>
            </span>
            <span className="w-[60%] ml-2 font-semibold text-sm">{factura.tipoMoneda}</span>
          </p>
        </div>
        <div className="flex-1" >
          <div className="text-center font-semibold">
            <p>Forma de Pago : {factura.formaDePago}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-center">
                <thead className="border-b bg-gray-800">
                  <tr>
                    <th scope="col" className="text-sm  text-white px-6 py-4">
                      Sub Total venta
                    </th>
                    <th scope="col" className="text-sm  text-white px-6 py-4">
                      IGV 18%
                    </th>
                    {
                      factura.existeDetraccion &&  <th scope="col" className="text-sm  text-white px-6 py-4">
                      Detraccion
                    </th>
                    }
                    <th scope="col" className="text-sm  text-white px-6 py-4">
                      A pagar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                    {factura.totalVenta}
                    </td>
                    <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                    {factura.IGV}
                    </td>
                    {
                factura.existeDetraccion &&  <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                {factura.detraccion}
                </td>
              }
                    <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                    {factura.pagar}
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr />
            </div>
          </div>
        </div>
      </div>
      <Tabs information={[
        {
          title:'Informacion del Emisor',
          description:JSON.stringify(rucInfomation,null,2)
        },
        {
          title:'Informacion del Receptor',
          description : JSON.stringify(adquirenteInformation,null,2)
        }
      ]} />
      <Export factura={[{
        FechaDocumento : factura.fechaFacturacion,
        num_factura : factura.referencia,
        venta :factura.totalVenta,
        igv : factura.IGV,
        total : parseFloat(factura.totalVenta) + parseFloat(factura.IGV) ,
        a_pagar : factura.pagar,
        detraccion : factura.existeDetraccion ? factura.detraccion:0,
      }]} />
    </>
  )
}
