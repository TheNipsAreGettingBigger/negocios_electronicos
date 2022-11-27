import { useEffect, useState } from "react"
import X2JS from "x2js"
import { Result } from "../interfaces"
import { rucService } from "../services"
import { exoneracionRetension } from "../services/exoneracionRetencionService"
import { Export } from "./Export"
import { Spinner } from "./Spinner"
import { Tabs } from "./Tabs"

type TablaFacturaProps = {
  xml: Document,
  XMLData: string
}

export const InvoiceTable = ({ xml, XMLData }: TablaFacturaProps) => {

  const [rucInfomation, setRucInfomation] = useState<Result>()
  const [adquirenteInformation, setAdquirenteInformation] = useState<any>()
  const [factura, setFactura] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [msg,setMsg] = useState("")

  useEffect(() => {
    const ruc = xml.getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].childNodes[0].nodeValue

    var x2js = new X2JS();
    var json = x2js.xml2js(XMLData) as any

    console.log(json);
    // const subTotal = TaxTotal.TaxSubtotal.TaxableAmount.__text
    const _igv = parseFloat(json.Invoice.TaxTotal.TaxAmount.__text)

    const TaxSubTotal = json.Invoice.TaxTotal.TaxSubtotal

    let subVenta = 0

    if (Array.isArray(TaxSubTotal)) {
      TaxSubTotal.forEach(sub => {
        subVenta += parseFloat(sub.TaxableAmount.__text)
      })
    } else {
      subVenta += parseFloat(TaxSubTotal.TaxableAmount.__text)
    }

    let importe = subVenta + _igv
    let total = importe

    let fechaFacturacion = xml.getElementsByTagName("cbc:IssueDate")[0].childNodes[0].nodeValue;
    let referencia = xml.getElementsByTagName("cbc:ID")[0].childNodes[0].nodeValue;
    const adquirente = xml.getElementsByTagName("cac:AccountingCustomerParty")[0].getElementsByTagName('cbc:RegistrationName')[0].childNodes[0].nodeValue
    const adquirenteRuc = xml.getElementsByTagName("cac:AccountingCustomerParty")[0].getElementsByTagName('cbc:ID')[0].childNodes[0].nodeValue

    let formaDePago = xml.getElementsByTagName('cac:PaymentTerms')[0].getElementsByTagName('cbc:PaymentMeansID')[0].childNodes[0].nodeValue
    let direccionEmisor = xml.getElementsByTagName('cac:BuyerCustomerParty')[0]?.getElementsByTagName('cbc:Line')[0].childNodes[0].nodeValue
    let tipoMoneda = xml.getElementsByTagName('cbc:DocumentCurrencyCode')[0].childNodes[0].nodeValue;


    let existeDetraccion = false
    let existeRetension = false
    setFactura({
      ruc,
      fechaFacturacion,
      referencia,
      totalVenta: subVenta,
      IGV: _igv,
      existeDetraccion,
      existeRetension,
      pagar: total,
      formaDePago,
      adquirente,
      adquirenteRuc,
      direccionEmisor,
      tipoMoneda
    })

    rucService(`${ruc}`).then(response => {
      setRucInfomation(response.result)
      rucService(`${adquirenteRuc}`).then(response => {
        setAdquirenteInformation(response.result)
        setLoading(false)
      })
    })
    // ni retencion ni detraccion
    if (_igv == 0) {
      setMsg("SIN IGV")
      return
    }

    // verificar si el importe es mayor a 700
    if (importe < 700) return

    // PRIORIDAD DETRACCION EN EL CASO QUE LOS DOS EXISTAN
    exoneracionRetension(ruc as string)
      .then(data => {
        const esExonerado = data.responde
        if (esExonerado) {
          existeRetension = false
          setFactura((fc:any)=>({...fc,pagar: total,existeRetension}))
          setMsg( "Designado AGENTE DE RETENCION, no sujeto a retención del 3% del IGV")
        } else {
          if(json.Invoice.AllowanceCharge?.MultiplierFactorNumeric){
            console.log('si se aplica')
            existeRetension = true
            let retensionPorcentaje = parseFloat(json.Invoice.AllowanceCharge.MultiplierFactorNumeric.toString())
            let montoRetension = parseFloat(json.Invoice.AllowanceCharge.Amount.toString())
            total = importe - montoRetension
            setFactura((fc:any)=>({...fc,pagar: total,existeRetension,retensionPorcentaje,montoRetension}))
          }
        }
        existeDetraccion = false
        const supuestoTotal = json.Invoice.LegalMonetaryTotal.PayableAmount
        
        if(!existeRetension && !esExonerado){
          if(!Array.isArray(json.Invoice.PaymentTerms)){
            if(json.Invoice.PaymentTerms.Amount != supuestoTotal){
              existeDetraccion = true
              let detraccion = parseFloat(`${total * 0.12}`).toFixed(2)
              total = total - parseFloat(detraccion)
              setFactura((fc:any)=>({...fc,pagar: total,existeDetraccion,detraccion}))
            }
          }else{
            for (const item of json.Invoice.PaymentTerms) {
              if(item.Amount != supuestoTotal){
                console.log('entre aqui',item.Amount,supuestoTotal)
                existeDetraccion = true
                let detraccion = parseFloat(`${total * 0.12}`).toFixed(2)
                total = total - parseFloat(detraccion)
                setFactura((fc:any)=>({...fc,pagar: total,existeDetraccion,detraccion}))
                break
              }
            }
          }
        }
      })
  }, [])

  if (loading) return <Spinner />

  return (
    <>
      <div>
        <div className="border-stone-900 flex border-t-[1px] border-b-[1px] py-4 px-2">
          <div className="w-[70%]">
            <div className="p-2 grid gap-2">
              <p className="font-bold">{rucInfomation?.razonSocial}</p>
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
        <div className="overflow-x-auto ">
          <div className="py-4 inline-block min-w-full">
            <div className="">
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
                      factura.existeDetraccion && <th scope="col" className="text-sm  text-white px-6 py-4">
                        Detraccion
                      </th>
                    }
                    {
                      factura.existeRetension && <th scope="col" className="text-sm  text-white px-6 py-4">
                        Retension
                      </th>
                    }
                    {
                      factura.existeRetension && <th scope="col" className="text-sm  text-white px-6 py-4">
                        Monto Retenido
                      </th>
                    }
                    {
                      factura.existeRetension && <th scope="col" className="text-sm  text-white px-6 py-4">
                        Agente de Retension (Nombre - RUC)
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
                      {factura.totalVenta.toFixed(2)}
                    </td>
                    <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                      {factura.IGV.toFixed(2)}
                    </td>
                    {
                      factura.existeDetraccion && <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                        {factura.detraccion}
                      </td>
                    }
                    {
                      factura.existeRetension && <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                        {(factura.retensionPorcentaje*100).toFixed(1)}%
                      </td>
                    }
                    {
                      factura.existeRetension && <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                        {(factura.montoRetension).toFixed(2)}
                      </td>
                    }
                    {
                      factura.existeRetension && <td className="text-gray-900  px-6 py-4 whitespace-nowrap text-xs">
                        {adquirenteInformation?.razonSocial}<br/>
                        {factura?.ruc}
                      </td>
                    }
                    <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                      {factura.pagar.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              {
                msg.length ? <p className="text-[#198754] font-bold text-xs">STATUS : {msg}</p> : null
              }
              <hr />
            </div>
          </div>
        </div>
      </div>
      <Tabs information={[
        {
          title: 'Informacion del Emisor',
          description: JSON.stringify(rucInfomation, null, 2)
        },
        {
          title: 'Informacion del Receptor',
          description: JSON.stringify(adquirenteInformation, null, 2)
        }
      ]} />
      {/* <Export factura={[{
        FechaDocumento: factura.fechaFacturacion,
        num_factura: factura.referencia,
        venta: factura.totalVenta,
        igv: factura.IGV,
        total: parseFloat(factura.totalVenta) + parseFloat(factura.IGV),
        a_pagar: factura.pagar,
        detraccion: factura.existeDetraccion ? factura.detraccion : 0,
      }]} /> */}
    </>
  )
}
