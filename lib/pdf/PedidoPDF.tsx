import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

type Item = {
  clave: string
  descripcion: string
  unidad: string
  cantidad: number
  costoUnitario: number
}

export type PedidoPDFData = {
  folio: string
  fecha: string
  solicitadoPor: string // cliente
  vendedor: string
  items: Item[]
}

const money = (n: number) => n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 12, fontWeight: 700 },
  rightBox: { borderWidth: 1, borderColor: "#999", padding: 8, width: 190 },
  row: { flexDirection: "row", gap: 12, marginTop: 4 },

  block: { borderWidth: 1, borderColor: "#999", padding: 8, marginBottom: 10 },
  blockTitle: { fontSize: 9, fontWeight: 700, marginBottom: 6 },

  table: { borderWidth: 1, borderColor: "#999" },
  trHead: { flexDirection: "row", backgroundColor: "#E6E6E6", borderBottomWidth: 1, borderColor: "#999" },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#DDD" },

  th: { padding: 6, fontWeight: 700 },
  td: { padding: 6 },

  cCant: { width: 40 },
  cUni: { width: 50 },
  cClave: { width: 90 },
  cDesc: { flex: 1 },
  cUnit: { width: 70, textAlign: "right" },
  cSub: { width: 70, textAlign: "right" },

  totals: { marginTop: 10, flexDirection: "row", justifyContent: "flex-end" },
  totalsBox: { width: 220, borderWidth: 1, borderColor: "#999" },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", padding: 8, borderBottomWidth: 1, borderColor: "#DDD" },
  totalsRowLast: { flexDirection: "row", justifyContent: "space-between", padding: 8 },
})

export default function PedidoPDF({ data }: { data: PedidoPDFData }) {
  const subtotal = data.items.reduce((acc, it) => acc + it.cantidad * it.costoUnitario, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>OPERADORA BALLES</Text>
            <Text>REQUISICIÓN / PEDIDO</Text>
            <View style={styles.row}>
              <Text>Vendedor: {data.vendedor}</Text>
              <Text>Solicitado por: {data.solicitadoPor}</Text>
            </View>
          </View>

          <View style={styles.rightBox}>
            <Text>FOLIO: {data.folio}</Text>
            <Text>FECHA: {data.fecha}</Text>
            <Text>MONEDA: MXN</Text>
          </View>
        </View>

        {/* Datos */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>DATOS DEL PEDIDO</Text>
          <Text>Cliente / Solicitante: {data.solicitadoPor}</Text>
          <Text>Atendió: {data.vendedor}</Text>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          <View style={styles.trHead}>
            <Text style={[styles.th, styles.cCant]}>CANT.</Text>
            <Text style={[styles.th, styles.cUni]}>UN.</Text>
            <Text style={[styles.th, styles.cClave]}>CLAVE</Text>
            <Text style={[styles.th, styles.cDesc]}>DESCRIPCIÓN</Text>
            <Text style={[styles.th, styles.cUnit]}>C/U</Text>
            <Text style={[styles.th, styles.cSub]}>SUBTOTAL</Text>
          </View>

          {data.items.map((it, idx) => {
            const sub = it.cantidad * it.costoUnitario
            return (
              <View key={idx} style={styles.tr}>
                <Text style={[styles.td, styles.cCant]}>{it.cantidad}</Text>
                <Text style={[styles.td, styles.cUni]}>{it.unidad}</Text>
                <Text style={[styles.td, styles.cClave]}>{it.clave}</Text>
                <Text style={[styles.td, styles.cDesc]}>{it.descripcion}</Text>
                <Text style={[styles.td, styles.cUnit]}>${money(it.costoUnitario)}</Text>
                <Text style={[styles.td, styles.cSub]}>${money(sub)}</Text>
              </View>
            )
          })}
        </View>

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text>SUBTOTAL</Text>
              <Text>${money(subtotal)}</Text>
            </View>
            <View style={styles.totalsRowLast}>
              <Text style={{ fontWeight: 700 }}>TOTAL</Text>
              <Text style={{ fontWeight: 700 }}>${money(subtotal)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
