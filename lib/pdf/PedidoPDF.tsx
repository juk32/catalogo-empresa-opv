import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

type Item = {
  clave: string
  descripcion: string
  unidad: string
  cantidad: number
  costoUnitario: number
}

export type PedidoPDFData = {
  id: string
  folio: string
  fecha: string
  solicitadoPor: string
  vendedor: string
  moneda?: string

  empresaNombre?: string
  rfcEmpresa?: string
  empresaDireccionLine1?: string
  empresaDireccionLine2?: string

  proveedorNombre?: string
  proveedorRFC?: string
  proveedorCalle?: string
  proveedorNumExt?: string
  proveedorCP?: string
  proveedorMunicipio?: string
  proveedorEstado?: string
  proveedorTel?: string

  lugarEntrega?: string
  fechaRecepcion?: string
  observaciones?: string

  status?: "PENDIENTE" | "ENTREGADO"
  deliveredAt?: string | null
  deliveredBy?: string | null

  // assets
  logoUrl?: string
  qrDataUrl?: string

  items: Item[]
}

const money = (n: number) =>
  Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const styles = StyleSheet.create({
  page: { padding: 18, fontSize: 9, fontFamily: "Helvetica", color: "#111" },

  row: { flexDirection: "row" },
  box: { borderWidth: 1, borderColor: "#BDBDBD" },

  // top
  topWrap: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logo: { width: 120, height: 34 },
  centerInfo: { flex: 1, paddingHorizontal: 10, alignItems: "center" },
  title: { textAlign: "center", fontSize: 11, fontWeight: 700 },
  tiny: { textAlign: "center", fontSize: 8, marginTop: 2 },

  // right header table
  hdrTable: { width: 210, borderWidth: 1, borderColor: "#BDBDBD" },
  hdrHead: { backgroundColor: "#EFEFEF", padding: 4, borderBottomWidth: 1, borderColor: "#BDBDBD" },
  hdrHeadText: { textAlign: "center", fontWeight: 700 },
  hdrRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#BDBDBD" },
  hdrCellL: { width: 95, backgroundColor: "#F7F7F7", padding: 4, borderRightWidth: 1, borderColor: "#BDBDBD" },
  hdrCellR: { flex: 1, padding: 4 },
  hdrLabel: { fontSize: 7, color: "#444" },
  hdrValue: { marginTop: 2, fontWeight: 700, fontSize: 9 },
  qrWrap: { padding: 6, alignItems: "center" },
  qrImg: { width: 70, height: 70, marginTop: 4 },

  // section
  sectionHead: { backgroundColor: "#EFEFEF", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#BDBDBD" },
  sectionHeadText: { textAlign: "center", fontWeight: 700 },

  gridRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#BDBDBD" },
  gridCell: { padding: 4, borderRightWidth: 1, borderColor: "#BDBDBD" },
  gridCellLast: { padding: 4 },
  gridLabel: { fontSize: 7, color: "#444" },
  gridValue: { marginTop: 2 },

  // items table
  tHead: { flexDirection: "row", backgroundColor: "#EFEFEF", borderBottomWidth: 1, borderColor: "#BDBDBD" },
  tRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#E0E0E0" },
  th: { padding: 4, fontWeight: 700, fontSize: 8 },
  td: { padding: 4 },

  cCant: { width: 44, textAlign: "center" },
  cUn: { width: 44, textAlign: "center" },
  cClave: { width: 90 },
  cDesc: { flex: 1 },
  cCU: { width: 80, textAlign: "right" },
  cSub: { width: 80, textAlign: "right" },

  // totals + obs
  totalsWrap: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  leftCol: { flex: 1, marginRight: 10 },
  rightCol: { width: 240 },

  totalsRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#E0E0E0" },
  totalsCellL: { flex: 1, padding: 4, backgroundColor: "#F7F7F7", borderRightWidth: 1, borderColor: "#BDBDBD" },
  totalsCellR: { width: 95, padding: 4, textAlign: "right" },
  bold: { fontWeight: 700 },

  // delivered stamp
  deliveredStamp: {
    position: "absolute",
    top: 280,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 56,
    fontWeight: 700,
    color: "#B91C1C",
    opacity: 0.12,
    transform: "rotate(-14deg)",
  },
})

function safeStr(v: any) {
  return v === null || v === undefined ? "—" : String(v)
}

export default function PedidoPDF({ data }: { data: PedidoPDFData }) {
  const items = Array.isArray(data?.items) ? data.items.filter(Boolean) : []
  const subtotal = items.reduce((acc, it) => acc + Number(it.cantidad || 0) * Number(it.costoUnitario || 0), 0)
  const isDelivered = data?.status === "ENTREGADO"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isDelivered ? <Text style={styles.deliveredStamp}>ENTREGADO</Text> : null}

        {/* ===== TOP HEADER ===== */}
        <View style={styles.topWrap}>
          <View style={{ width: 150 }}>
            {data?.logoUrl ? <Image style={styles.logo} src={data.logoUrl} /> : null}
          </View>

          <View style={styles.centerInfo}>
            <Text style={styles.title}>{safeStr(data?.empresaNombre ?? "OPERADORA BALLES")}</Text>
            {data?.rfcEmpresa ? <Text style={styles.tiny}>RFC: {safeStr(data.rfcEmpresa)}</Text> : null}
            {data?.empresaDireccionLine1 ? <Text style={styles.tiny}>{safeStr(data.empresaDireccionLine1)}</Text> : null}
            {data?.empresaDireccionLine2 ? <Text style={styles.tiny}>{safeStr(data.empresaDireccionLine2)}</Text> : null}
          </View>

          <View style={styles.hdrTable}>
            <View style={styles.hdrHead}>
              <Text style={styles.hdrHeadText}>REQUISICIÓN</Text>
            </View>

            <View style={styles.hdrRow}>
              <View style={styles.hdrCellL}>
                <Text style={styles.hdrLabel}>FOLIO</Text>
              </View>
              <View style={styles.hdrCellR}>
                <Text style={styles.hdrValue}>{safeStr(data?.folio)}</Text>
              </View>
            </View>

            <View style={styles.hdrRow}>
              <View style={styles.hdrCellL}>
                <Text style={styles.hdrLabel}>FECHA DOCUMENTO</Text>
              </View>
              <View style={styles.hdrCellR}>
                <Text style={styles.hdrValue}>{safeStr(data?.fecha)}</Text>
              </View>
            </View>

            <View style={styles.hdrRow}>
              <View style={styles.hdrCellL}>
                <Text style={styles.hdrLabel}>SOLICITADO POR</Text>
              </View>
              <View style={styles.hdrCellR}>
                <Text style={styles.hdrValue}>{safeStr(data?.solicitadoPor)}</Text>
              </View>
            </View>

            <View style={styles.qrWrap}>
              <Text style={styles.hdrLabel}>MONEDA</Text>
              <Text style={[styles.hdrValue, { fontSize: 10 }]}>{safeStr(data?.moneda ?? "MXN")}</Text>
              <Text style={[styles.hdrLabel, { marginTop: 6 }]}>QR (ID pedido)</Text>
              {data?.qrDataUrl ? <Image style={styles.qrImg} src={data.qrDataUrl} /> : <Text>—</Text>}
            </View>
          </View>
        </View>

        {/* ===== DATOS DEL PROVEEDOR ===== */}
        <View style={[styles.box, { marginTop: 10 }]}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionHeadText}>DATOS DEL PROVEEDOR</Text>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridCell, { width: "55%" }]}>
              <Text style={styles.gridLabel}>NOMBRE</Text>
              <Text style={styles.gridValue}>{safeStr(data?.proveedorNombre)}</Text>
            </View>
            <View style={styles.gridCellLast}>
              <Text style={styles.gridLabel}>FECHA DE RECEPCIÓN</Text>
              <Text style={styles.gridValue}>{safeStr(data?.fechaRecepcion)}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridCell, { width: "55%" }]}>
              <Text style={styles.gridLabel}>RFC</Text>
              <Text style={styles.gridValue}>{safeStr(data?.proveedorRFC)}</Text>
            </View>
            <View style={styles.gridCellLast}>
              <Text style={styles.gridLabel}>LUGAR DE ENTREGA</Text>
              <Text style={styles.gridValue}>{safeStr(data?.lugarEntrega)}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridCell, { width: "32%" }]}>
              <Text style={styles.gridLabel}>CALLE</Text>
              <Text style={styles.gridValue}>{safeStr(data?.proveedorCalle)}</Text>
            </View>
            <View style={[styles.gridCell, { width: "23%" }]}>
              <Text style={styles.gridLabel}>NUM. EXT.</Text>
              <Text style={styles.gridValue}>{safeStr(data?.proveedorNumExt)}</Text>
            </View>
            <View style={styles.gridCellLast}>
              <Text style={styles.gridLabel}>CP</Text>
              <Text style={styles.gridValue}>{safeStr(data?.proveedorCP)}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridCell, { width: "55%" }]}>
              <Text style={styles.gridLabel}>MUNICIPIO</Text>
              <Text style={styles.gridValue}>{safeStr(data?.proveedorMunicipio)}</Text>
            </View>
            <View style={styles.gridCellLast}>
              <Text style={styles.gridLabel}>ESTADO</Text>
              <Text style={styles.gridValue}>{safeStr(data?.proveedorEstado)}</Text>
            </View>
          </View>

          <View style={{ padding: 4 }}>
            <Text style={styles.gridLabel}>TEL.</Text>
            <Text style={styles.gridValue}>{safeStr(data?.proveedorTel)}</Text>
          </View>
        </View>

        {/* ===== ITEMS ===== */}
        <View style={[styles.box, { marginTop: 10 }]}>
          <View style={styles.tHead}>
            <Text style={[styles.th, styles.cCant]}>CANT.</Text>
            <Text style={[styles.th, styles.cUn]}>UN.</Text>
            <Text style={[styles.th, styles.cClave]}>CLAVE</Text>
            <Text style={[styles.th, styles.cDesc]}>DESCRIPCIÓN</Text>
            <Text style={[styles.th, styles.cCU]}>COSTO UNIT.</Text>
            <Text style={[styles.th, styles.cSub]}>SUBTOTAL</Text>
          </View>

          {items.map((it, idx) => {
            const cant = Number(it.cantidad || 0)
            const cu = Number(it.costoUnitario || 0)
            const sub = cant * cu

            return (
              <View key={`${it.clave}-${idx}`} style={styles.tRow}>
                <Text style={[styles.td, styles.cCant]}>{cant}</Text>
                <Text style={[styles.td, styles.cUn]}>{safeStr(it.unidad)}</Text>
                <Text style={[styles.td, styles.cClave]}>{safeStr(it.clave)}</Text>
                <Text style={[styles.td, styles.cDesc]}>{safeStr(it.descripcion)}</Text>
                <Text style={[styles.td, styles.cCU]}>${money(cu)}</Text>
                <Text style={[styles.td, styles.cSub]}>${money(sub)}</Text>
              </View>
            )
          })}
        </View>

        {/* ===== OBS + TOTALES ===== */}
        <View style={styles.totalsWrap}>
          <View style={styles.leftCol}>
            <View style={styles.box}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionHeadText}>OBSERVACIONES DEL DOCUMENTO</Text>
              </View>
              <View style={{ padding: 6 }}>
                <Text>{safeStr(data?.observaciones)}</Text>

                {isDelivered ? (
                  <Text style={{ marginTop: 6, fontSize: 8 }}>
                    Entregado: {safeStr(data?.deliveredAt)} · Firma digital: {safeStr(data?.deliveredBy)}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.box}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionHeadText}>TOTALES</Text>
              </View>

              <View style={styles.totalsRow}>
                <View style={styles.totalsCellL}>
                  <Text>SUBTOTAL</Text>
                </View>
                <Text style={styles.totalsCellR}>${money(subtotal)}</Text>
              </View>

              <View style={styles.totalsRow}>
                <View style={styles.totalsCellL}>
                  <Text>DESCUENTO</Text>
                </View>
                <Text style={styles.totalsCellR}>$0.00</Text>
              </View>

              <View style={styles.totalsRow}>
                <View style={styles.totalsCellL}>
                  <Text>IVA (16%)</Text>
                </View>
                <Text style={styles.totalsCellR}>$0.00</Text>
              </View>

              <View style={styles.totalsRow}>
                <View style={styles.totalsCellL}>
                  <Text style={styles.bold}>TOTAL</Text>
                </View>
                <Text style={[styles.totalsCellR, styles.bold]}>${money(subtotal)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}