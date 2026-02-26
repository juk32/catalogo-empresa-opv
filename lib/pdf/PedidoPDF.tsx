import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

export type PedidoPDFData = {
  folio: string
  fecha: string
  solicitadoPor: string
  vendedor?: string | null
  qrUrl?: string
  qrDataUrl?: string
  items: Array<{
    clave: string
    descripcion: string
    unidad: string
    cantidad: number
    costoUnitario: number
  }>
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  qrBox: {
    border: "1 solid #333",
    padding: 8,
    alignItems: "center",
    width: 130,
  },
  qrImage: {
    width: 90,
    height: 90,
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    paddingBottom: 4,
    marginTop: 20,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottom: "1 solid #eee",
  },
  cell: {
    flex: 1,
  },
})

export default function PedidoPDF({ data }: { data: PedidoPDFData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>OPERADORA BALLES</Text>
            <Text>REQUISICIÓN / PEDIDO</Text>
            <Text>Vendedor: {data.vendedor}</Text>
            <Text>Solicitado por: {data.solicitadoPor}</Text>
          </View>

          <View style={styles.qrBox}>
            <Text>FOLIO: {data.folio}</Text>
            <Text>FECHA: {data.fecha}</Text>
            <Text style={{ marginTop: 6, fontSize: 8 }}>
              ESCANEAR PARA ABRIR PEDIDO
            </Text>

            {data.qrDataUrl ? (
              <Image src={data.qrDataUrl} style={styles.qrImage} />
            ) : null}

            <Text style={{ fontSize: 7, marginTop: 4, textAlign: "center" }}>
              Escanea para abrir el pedido en el sistema
            </Text>
          </View>
        </View>

        {/* Tabla */}
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>CANT.</Text>
          <Text style={styles.cell}>CLAVE</Text>
          <Text style={styles.cell}>DESCRIPCIÓN</Text>
          <Text style={styles.cell}>C/U</Text>
        </View>

        {data.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.cell}>{item.cantidad}</Text>
            <Text style={styles.cell}>{item.clave}</Text>
            <Text style={styles.cell}>{item.descripcion}</Text>
            <Text style={styles.cell}>${item.costoUnitario.toFixed(2)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}