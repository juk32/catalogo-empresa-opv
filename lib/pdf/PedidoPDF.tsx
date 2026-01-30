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
  solicitadoPor: string
  vendedor: string
  items: Item[]
}

const money = (n: number) =>
  Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 12, fontWeight: 700 },
  rightBox: { borderWidth: 1, borderColor: "#999", padding: 8, width: 190 },

  // 👇 QUITAMOS gap, usamos márgenes
  row: { flexDirection: "row", marginTop: 4 },
  rowItem: { marginRight: 12 },

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
  // ✅ Blindaje: si items viene raro, lo limpiamos
  const items = Array.isArray(data?.items) ? (data.items.filter(Boolean) as Item[]) : []

  const subtotal = items.reduce((acc, it) => acc + Number(it.cantidad || 0) * Number(it.costoUnitario || 0), 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>OPERADORA BALLES</Text>
            <Text>REQUISICIÓN / PEDIDO</Text>

            <View style={styles.row}>
              <Text style={styles.rowItem}>Vendedor: {String(data?.vendedor ?? "")}</Text>
              <Text>Solicitado por: {String(data?.solicitadoPor ?? "")}</Text>
            </View>
          </View>

          <View style={styles.rightBox}>
            <Text>FOLIO: {String(data?.folio ?? "")}</Text>
            <Text>FECHA: {String(data?.fecha ?? "")}</Text>
            <Text>MONEDA: MXN</Text>
          </View>
        </View>

        {/* Datos */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>DATOS DEL PEDIDO</Text>
          <Text>Cliente / Solicitante: {String(data?.solicitadoPor ?? "")}</Text>
          <Text>Atendió: {String(data?.vendedor ?? "")}</Text>
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

          {items.map((it, idx) => {
            const cant = Number(it.cantidad || 0)
            const cu = Number(it.costoUnitario || 0)
            const sub = cant * cu

            return (
              <View key={`${it.clave}-${idx}`} style={styles.tr}>
                <Text style={[styles.td, styles.cCant]}>{cant}</Text>
                <Text style={[styles.td, styles.cUni]}>{String(it.unidad ?? "")}</Text>
                <Text style={[styles.td, styles.cClave]}>{String(it.clave ?? "")}</Text>
                <Text style={[styles.td, styles.cDesc]}>{String(it.descripcion ?? "")}</Text>
                <Text style={[styles.td, styles.cUnit]}>${money(cu)}</Text>
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
