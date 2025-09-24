export async function exportOffer(ponudaId: number) {
    console.log("PONUDA za export " + ponudaId)
  try {
    const response = await fetch(`http://localhost:8000/export/offer?ponuda_id=${ponudaId}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to export offer: ${response.statusText}`);
    }

    // Pretvaranje u blob
    const blob = await response.blob();

    // Kreiranje URL-a za preuzimanje
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Izvuci ime fajla iz header-a ako postoji
    const disposition = response.headers.get("Content-Disposition");
    let filename = `Ponuda_${ponudaId}.xlsx`;
    if (disposition && disposition.includes("filename=")) {
      filename = disposition
        .split("filename=")[1]
        .replace(/"/g, "")
        .trim();
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    // Čišćenje
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting offer:", error);
  }
};

export async function exportOfferProforma(ponudaId: number) {
    console.log("PONUDA proforma za export " + ponudaId)
  try {
    const response = await fetch(`http://localhost:8000/export/offer/proforma?ponuda_id=${ponudaId}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to export offer: ${response.statusText}`);
    }

    // Pretvaranje u blob
    const blob = await response.blob();

    // Kreiranje URL-a za preuzimanje
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Izvuci ime fajla iz header-a ako postoji
    const disposition = response.headers.get("Content-Disposition");
    let filename = `Ponuda_${ponudaId}.xlsx`;
    if (disposition && disposition.includes("filename=")) {
      filename = disposition
        .split("filename=")[1]
        .replace(/"/g, "")
        .trim();
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    // Čišćenje
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting offer:", error);
  }
};
