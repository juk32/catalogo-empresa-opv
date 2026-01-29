import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

type Item = {
  qty: number
  unit: string
  key: string
  description: string
  unitPrice: number
  discountPct?: number
}

export type RequisicionData = {
  folio: string
  fecha: string
  solicitadoPor: string
  moneda: string
  tipoCambio: string
  proveedorNombre?: string
  proveedorRFC?: string
  lugarEntrega?: string
  items: Item[]
}

const styles = StyleSheet.create({
  page: { padding: 22, fontSize: 10 },
  row: { flexDirection: "row" },
  header: { marginBottom: 10 },
  logo: { width: 70, height: 45 },
  titleBox: { flex: 1, paddingLeft: 10 },
  title: { fontSize: 12, fontWeight: 700 },
  rightBox: { width: 160, borderWidth: 1, borderColor: "#bbb" },
  rightLine: { borderBottomWidth: 1, borderColor: "#bbb", padding: 5 },
  rightLabel: { fontSize: 8, color: "#555" },
  rightValue: { fontSize: 9, fontWeight: 700 },

  sectionBox: { borderWidth: 1, borderColor: "#bbb", marginTop: 8 },
  sectionTitle: { backgroundColor: "#eaeaea", padding: 4, fontWeight: 700, textAlign: "center" },
  sectionBody: { padding: 6 },

  table: { borderWidth: 1, borderColor: "#bbb", marginTop: 8 },
  th: { backgroundColor: "#eaeaea", fontWeight: 700, padding: 4, borderRightWidth: 1, borderColor: "#bbb" },
  td: { padding: 4, borderRightWidth: 1, borderColor: "#bbb" },
  tr: { flexDirection: "row", borderTopWidth: 1, borderColor: "#bbb" },

  totalsRow: { flexDirection: "row", marginTop: 8, gap: 10 },
  totalLeft: { flex: 1, borderWidth: 1, borderColor: "#bbb", padding: 6 },
  totalRight: { width: 220, borderWidth: 1, borderColor: "#bbb" },
  totalRightLine: { flexDirection: "row", borderTopWidth: 1, borderColor: "#bbb" },
  totalRightLabel: { flex: 1, padding: 5, backgroundColor: "#f2f2f2" },
  totalRightValue: { width: 90, padding: 5, textAlign: "right" },
})

const money = (n: number) => `$${n.toFixed(2)}`

export default function RequisicionPDF({ data }: { data: RequisicionData }) {
  const subtotal = data.items.reduce((acc, it) => acc + it.qty * it.unitPrice, 0)
  const descuento = 0
  const iva = 0
  const total = subtotal - descuento + iva

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* HEADER */}
        <View style={[styles.row, styles.header]}>
          {/* Logo: pon tu logo en public y usa una URL absoluta luego; por ahora deja vacío o usa placeholder */}
          {/* Si quieres, luego lo ponemos desde /public/logo.png */}
          <View>
            {/* <Image style={styles.logo} src="..." /> */}
            <Text style={{ fontSize: 10, fontWeight: 700 }}>OPERADORA BALLES</Text>
          </View>

          <View style={styles.titleBox}>
            <Text style={styles.title}>OPERADORA BALLES VEGA DE HIDALGO</Text>
            <Text>RFC: OBV191007BS1</Text>
            <Text>SANTA CATARINA PARC 81 Z1 SN | SANTIAGO TLAPACOYA</Text>
            <Text>PACHUCA DE SOTO HIDALGO MEXICO 42110</Text>
          </View>

          <View style={styles.rightBox}>
            <View style={styles.rightLine}>
              <Text style={styles.rightLabel}>REQUISICIÓN</Text>
            </View>
            <View style={styles.rightLine}>
              <Text style={styles.rightLabel}>FOLIO</Text>
              <Text style={styles.rightValue}>{data.folio}</Text>
            </View>
            <View style={styles.rightLine}>
              <Text style={styles.rightLabel}>FECHA DE DOCUMENTO</Text>
              <Text style={styles.rightValue}>{data.fecha}</Text>
            </View>
            <View style={styles.rightLine}>
              <Text style={styles.rightLabel}>SOLICITADO POR</Text>
              <Text style={styles.rightValue}>{data.solicitadoPor}</Text>
            </View>
            <View style={styles.rightLine}>
              <Text style={styles.rightLabel}>MONEDA - TIPO DE CAMBIO</Text>
              <Text style={styles.rightValue}>
                {data.moneda}  |  {data.tipoCambio}
              </Text>
            </View>
          </View>
        </View>

        {/* DATOS DEL PROVEEDOR */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>DATOS DEL PROVEEDOR</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <Text style={{ width: 280 }}>NOMBRE: {data.proveedorNombre || ""}</Text>
              <Text>FECHA DE RECEPCIÓN: {data.fecha}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ width: 280 }}>RFC: {data.proveedorRFC || ""}</Text>
              <Text>LUGAR DE ENTREGA: {data.lugarEntrega || ""}</Text>
            </View>
          </View>
        </View>

        {/* TABLA ITEMS */}
        <View style={styles.table}>
          <View style={[styles.row, { borderBottomWidth: 1, borderColor: "#bbb" }]}>
            <Text style={[styles.th, { width: 40 }]}>CANT.</Text>
            <Text style={[styles.th, { width: 45 }]}>UN.</Text>
            <Text style={[styles.th, { width: 110 }]}>CLAVE</Text>
            <Text style={[styles.th, { flex: 1 }]}>DESCRIPCIÓN</Text>
            <Text style={[styles.th, { width: 80 }]}>COSTO UNITARIO</Text>
            <Text style={[styles.th, { width: 55 }]}>DESC.</Text>
            <Text style={[styles.th, { width: 70, borderRightWidth: 0 }]}>SUBTOTAL</Text>
          </View>

          {data.items.map((it, idx) => {
            const sub = it.qty * it.unitPrice
            const desc = (it.discountPct ?? 0).toFixed(2) + "%"
            return (
              <View key={idx} style={styles.tr}>
                <Text style={[styles.td, { width: 40 }]}>{it.qty}</Text>
                <Text style={[styles.td, { width: 45 }]}>{it.unit}</Text>
                <Text style={[styles.td, { width: 110 }]}>{it.key}</Text>
                <Text style={[styles.td, { flex: 1 }]}>{it.description}</Text>
                <Text style={[styles.td, { width: 80, textAlign: "right" }]}>{money(it.unitPrice)}</Text>
                <Text style={[styles.td, { width: 55, textAlign: "right" }]}>{desc}</Text>
                <Text style={[styles.td, { width: 70, borderRightWidth: 0, textAlign: "right" }]}>{money(sub)}</Text>
              </View>
            )
          })}
        </View>

        {/* TOTALES */}
        <View style={styles.totalsRow}>
          <View style={styles.totalLeft}>
            <Text style={{ fontWeight: 700 }}>TOTAL CON LETRA:</Text>
            <Text>— (aquí luego ponemos conversión a letra)</Text>
            <Text style={{ marginTop: 10, fontWeight: 700 }}>TOTAL PARTIDAS: {data.items.length}</Text>
          </View>

          <View style={styles.totalRight}>
            <View style={styles.totalRightLine}>
              <Text style={styles.totalRightLabel}>SUBTOTAL</Text>
              <Text style={styles.totalRightValue}>{money(subtotal)}</Text>
            </View>
            <View style={styles.totalRightLine}>
              <Text style={styles.totalRightLabel}>DESCUENTO</Text>
              <Text style={styles.totalRightValue}>{money(descuento)}</Text>
            </View>
            <View style={styles.totalRightLine}>
              <Text style={styles.totalRightLabel}>IVA</Text>
              <Text style={styles.totalRightValue}>{money(iva)}</Text>
            </View>
            <View style={styles.totalRightLine}>
              <Text style={[styles.totalRightLabel, { fontWeight: 700 }]}>TOTAL</Text>
              <Text style={[styles.totalRightValue, { fontWeight: 700 }]}>{money(total)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
