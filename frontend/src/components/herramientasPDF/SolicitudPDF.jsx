import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSub: { 
    fontSize: 12, 
    opacity: 0.9 
  },
  infoSection: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
  },
  table: { 
    display: "table", 
    width: "auto", 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
  },
  tableRow: { 
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
    padding: 8,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    borderRightStyle: "solid",
    fontSize: 10,
    textTransform: "uppercase",
  },
  tableCell: {
    padding: 8,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    borderRightStyle: "solid",
    fontSize: 10,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: "bold", 
    marginBottom: 10, 
    marginTop: 20,
    color: "#1f2937",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    borderBottomStyle: "solid",
    paddingBottom: 5,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "solid",
    padding: 12,
    marginTop: 8,
    borderRadius: 4,
    fontSize: 10,
    backgroundColor: "#f9fafb",
    lineHeight: 1.4,
  },
  statusBadge: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "4 8",
    borderRadius: 12,
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  priorityBadge: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
    padding: "4 8",
    borderRadius: 12,
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#6b7280",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
    paddingTop: 10,
  },
  logo: {
    width: 80,
    height: 30,
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 15,
    textAlign: "center",
  },
});

const SolicitudPDF = ({ solicitud }) => {
  // Función para formatear fecha
  const formatearFecha = (fechaHora) => {
    if (!fechaHora) return "Sin fecha";
    const fecha = new Date(fechaHora);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Función para capitalizar texto
  const capitalizar = (texto) => {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo y info de empresa */}
        <View style={styles.companyInfo}>
          <Text>Sistema de Gestión de Almacén</Text>
          <Text>Solicitud de Suministros</Text>
        </View>

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Solicitud de Almacén</Text>
          <Text style={styles.headerSub}>
            Folio: {solicitud?.folio || "N/A"} | {formatearFecha(solicitud?.fechaHora)}
          </Text>
        </View>

        {/* Información General */}
        <View style={styles.infoSection}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Solicitante</Text>
              <Text style={styles.tableHeader}>Área</Text>
              <Text style={styles.tableHeader}>Prioridad</Text>
              <Text style={[styles.tableHeader, styles.lastCell]}>Estado</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {solicitud?.usuario?.user || solicitud?.solicitante || "No especificado"}
              </Text>
              <Text style={styles.tableCell}>{solicitud?.area || "No especificada"}</Text>
              <Text style={styles.tableCell}>{capitalizar(solicitud?.prioridad) || "No especificada"}</Text>
              <Text style={[styles.tableCell, styles.lastCell]}>
                {capitalizar(solicitud?.status) || "Sin estado"}
              </Text>
            </View>
          </View>
        </View>

        {/* Productos Solicitados */}
        <Text style={styles.sectionTitle}>
          Productos Solicitados ({solicitud?.suministros?.length || 0} productos)
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Producto</Text>
            <Text style={styles.tableHeader}>Cantidad</Text>
            <Text style={[styles.tableHeader, styles.lastCell]}>Unidad</Text>
          </View>
          {solicitud?.suministros?.length > 0 ? (
            solicitud.suministros.map((suministro, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 3 }]}>
                  {suministro?.nombre || "Producto no especificado"}
                </Text>
                <Text style={styles.tableCell}>{suministro?.cantidad || "0"}</Text>
                <Text style={[styles.tableCell, styles.lastCell]}>
                  {suministro?.unidad || "N/A"}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.lastCell, { textAlign: "center" }]}>
                No hay productos solicitados
              </Text>
            </View>
          )}
        </View>

        {/* Comentarios del Solicitante */}
        {solicitud?.comentarioUser && (
          <>
            <Text style={styles.sectionTitle}>Comentarios del Solicitante</Text>
            <View style={styles.commentBox}>
              <Text>{solicitud.comentarioUser}</Text>
            </View>
          </>
        )}

        {/* Comentarios del Administrador */}
        {solicitud?.comentarioAdmin && (
          <>
            <Text style={styles.sectionTitle}>Comentarios del Administrador</Text>
            <View style={styles.commentBox}>
              <Text>{solicitud.comentarioAdmin}</Text>
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Documento generado automáticamente el {new Date().toLocaleDateString("es-ES")} a las {new Date().toLocaleTimeString("es-ES")}
          </Text>
          <Text>Sistema de Gestión de Almacén - Página 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default SolicitudPDF;