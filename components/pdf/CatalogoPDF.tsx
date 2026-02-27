import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

export type CatalogoPDFData = {
  fecha: string
  qrDataUrl?: string
  items: Array<{
    id: string
    name: string
    category: string
    price: number
    stock: number
  }>
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  title: { fontSize: 14, fontWeight: "bold" },
  subtitle: { fontSize: 10, marginTop: 2, color: "#333" },
  qrBox: { border: "1 solid #333", padding: 8, alignItems: "center", width: 150 },
  qrImage: { width: 95, height: 95, marginTop: 6 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    paddingBottom: 4,
    marginTop: 18,
    fontWeight: "bold",
  },
  tableRow: { flexDirection: "row", paddingVertical: 4, borderBottom: "1 solid #eee" },
  colCat: { width: "22%" },
  colName: { width: "48%" },
  colPrice: { width: "15%", textAlign: "right" },
  colStock: { width: "15%", textAlign: "right" },
  small: { fontSize: 7, color: "#444", marginTop: 4, textAlign: "center" },
})

function money(n: number) {
  return (Number(n) || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function CatalogoPDF({ data }: { data: CatalogoPDFData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>OPERADORA BALLES</Text>
            <Text style={styles.subtitle}>CATÁLOGO DE PRODUCTOS</Text>
            <Text style={{ marginTop: 6 }}>Fecha: {data.fecha}</Text>
            <Text style={{ marginTop: 2, color: "#555" }}>
              Total: {data.items.length} producto{data.items.length === 1 ? "" : "s"}
            </Text>
          </View>

          <View style={styles.qrBox}>
            <Text style={{ fontSize: 8 }}>ESCANEA PARA ABRIR</Text>
            <Text style={{ fontSize: 8 }}>EL CATÁLOGO DIGITAL</Text>

            {data.qrDataUrl ? <Image src={data.qrDataUrl} style={styles.qrImage} /> : null}

            <Text style={styles.small}>Escanea para ir al catálogo</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colCat}>CATEGORÍA</Text>
          <Text style={styles.colName}>PRODUCTO</Text>
          <Text style={styles.colPrice}>PRECIO</Text>
          <Text style={styles.colStock}>STOCK</Text>
        </View>

        {data.items.map((p, i) => (
          <View key={`${p.id}-${i}`} style={styles.tableRow}>
            <Text style={styles.colCat}>{p.category || "Sin categoría"}</Text>
            <Text style={styles.colName}>
              {p.name} <Text style={{ color: "#666" }}>({p.id})</Text>
            </Text>
            <Text style={styles.colPrice}>${money(p.price)}</Text>
            <Text style={styles.colStock}>{String(p.stock ?? 0)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}