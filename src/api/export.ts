import { BACKEND_URL } from "../config";

export async function exportOffer(ponudaId: number) {
    console.log("PONUDA za export " + ponudaId)
  try {
    const response = await fetch(`${BACKEND_URL}/export/offer?ponuda_id=${ponudaId}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to export offer: ${response.statusText}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers.get("Content-Disposition");
    let filename: string = `Ponuda_${ponudaId}.xlsx`; 

    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        filename = match[1];
      }
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
    const response = await fetch(`${BACKEND_URL}/export/offer/proforma?ponuda_id=${ponudaId}`, {
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
    let filename: string = `Ponuda_${ponudaId}.xlsx`; 

    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        filename = match[1];
      }
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

export async function exportOfferInvoice(ponudaId: number, adv: boolean) {
  console.log("PONUDA invoice za export " + ponudaId);
  try {
    const response = await fetch(
      `${BACKEND_URL}/export/offer/invoice?ponuda_id=${ponudaId}&advance=${adv}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to export offer: ${response.statusText}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers.get("Content-Disposition");
    let filename: string = `Ponuda_${ponudaId}.xlsx`; 

    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting offer:", error);
  }
};

export async function exportSelectedExpenses(expenseIds: number[]) {
  if (!expenseIds || expenseIds.length === 0) return;

  try {
    const response = await fetch(`${BACKEND_URL}/export/rashodi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rashodi_ids: expenseIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to export expenses: ${response.statusText}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers.get("Content-Disposition");
    let filename: string = `rashodi.xlsx`; 

    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    console.log("Expenses exported successfully!");
  } catch (error) {
    console.error("Error exporting expenses:", error);
  }
}


export async function exportSelectedOffers(offersIds: number[]) {
  if (!offersIds || offersIds.length === 0) return;

  try {
    const response = await fetch(`${BACKEND_URL}/export/offer/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ponude_ids: offersIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to export expenses: ${response.statusText}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers.get("Content-Disposition");
    let filename: string = `Ponude.xlsx`; 

    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    console.log("Offers exported successfully!");
  } catch (error) {
    console.error("Error exporting offers:", error);
  }
}

export async function exportSelectedFinOffers(offersIds: number[]) {
  if (!offersIds || offersIds.length === 0) return;

  try {
    const response = await fetch(`${BACKEND_URL}/export/offer/fin/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ponude_ids: offersIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to export expenses: ${response.statusText}`);
    }

    console.log("RES OK")
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers.get("Content-Disposition");
    let filename: string = `Ponude_finansijski_pregled.xlsx`; 

    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    console.log("Offers-fin exported successfully!");
  } catch (error) {
    console.error("Error exporting offers-fin:", error);
  }
}

export async function exportSelectedOffersPayments(offersIds: number[]) {
  if (!offersIds || offersIds.length === 0) return;

  try {
    const response = await fetch(`${BACKEND_URL}/export/offer/payments/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ponude_ids: offersIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to export expenses: ${response.statusText}`);
    }

    console.log("RES OK")
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers.get("Content-Disposition");
    let filename: string = `Ponude_placanja.xlsx`; 

    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    console.log("Offers-fin exported successfully!");
  } catch (error) {
    console.error("Error exporting offers-fin:", error);
  }
}