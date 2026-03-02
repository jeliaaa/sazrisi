/**
 * Dependencies:
 *   npm install jspdf qrcode
 *   npm install --save-dev @types/qrcode
 */

import jsPDF from "jspdf";
import QRCode from "qrcode";
import { User } from "../stores/authStore";
import font from "../fonts/georgianFontForPdf";

// ─── Brand colours ────────────────────────────────────────────────────────────
const ORANGE = "#FF9900";
const DARK = "#1a202c";
const WHITE = "#FFFFFF";

// ─── Types ────────────────────────────────────────────────────────────────────


export interface QuizInfo {
    quizId: string;
    quizTitle: string;
    quizDate: string;   // e.g. "17.07.2024 14:00"
    category: string;
    room: number | string;
    location?: string;
    laptopMode?: boolean;
    code: string
}

// ─── XOR + Base64 encryption ─────────────────────────────────────────────────
const XOR_KEY = 73; // change to any secret byte (1–255)

export function encryptCode(payload: object): string {
    const json = JSON.stringify(payload);
    const xored = Array.from(json)
        .map(c => String.fromCharCode(c.charCodeAt(0) ^ XOR_KEY))
        .join("");
    return btoa(xored).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function decryptCode(encoded: string): object {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const xored = atob(b64);
    const json = Array.from(xored)
        .map(c => String.fromCharCode(c.charCodeAt(0) ^ XOR_KEY))
        .join("");
    return JSON.parse(json);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rgb(hex: string): [number, number, number] {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
}

// ─── Main generator ───────────────────────────────────────────────────────────
export async function generateQuizCard(
    profile: User,
    quiz: QuizInfo,
): Promise<void> {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210, H = 297, PAD = 12;

    // Encrypted payload embedded in QR
    // const encryptedCode = encryptCode({
    //     uid: profile.id,
    //     qid: quiz.quizId,
    //     date: quiz.quizDate,
    //     cat: quiz.category,
    //     ts: Date.now(),
    // });

    const qrDataUrl = await QRCode.toDataURL(quiz.code, {
        errorCorrectionLevel: "H",
        margin: 1,
        color: { dark: DARK, light: WHITE },
        width: 300,
    });

    // ── HEADER ──────────────────────────────────────────────────────────────────
    doc.setFillColor(...rgb(DARK));
    doc.rect(0, 0, W, 30, "F");
    doc.setFillColor(...rgb(ORANGE));
    doc.rect(0, 30, W, 3, "F");



    doc.addFileToVFS("NotoSansGeorgian-Regular.ttf", font);
    doc.addFont("NotoSansGeorgian-Regular.ttf", "geo", "normal");

    doc.setFont("helvetica");


    doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(...rgb(WHITE));
    doc.text("QUIZ ADMISSION CARD", PAD, 19);

    // Year badge
    doc.setFillColor(...rgb(ORANGE));
    doc.roundedRect(W - PAD - 18, 8, 18, 10, 2, 2, "F");
    doc.setFontSize(9).setTextColor(...rgb(DARK));
    doc.text(new Date().getFullYear().toString(), W - PAD - 9, 14.5, { align: "center" });

    // ── CANDIDATE ───────────────────────────────────────────────────────────────
    const secTop = 40;

    // Photo box
    doc.setDrawColor(...rgb(ORANGE)).setLineWidth(1);
    doc.rect(PAD, secTop, 34, 42);
    doc.setFillColor(243, 244, 246);
    doc.rect(PAD + 0.5, secTop + 0.5, 33, 41, "F");
    doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(156, 163, 175);
    doc.text("PHOTO", PAD + 17, secTop + 22, { align: "center" });

    const lx = PAD + 40;
    let cy = secTop + 2;

    const field = (label: string, value: string) => {
        doc.setFont("geo", "bold").setFontSize(7).setTextColor(107, 114, 128);
        doc.text(label.toUpperCase(), lx, cy + 4);
        doc.setFont("geo", "normal").setFontSize(11).setTextColor(...rgb(DARK));
        doc.text(value, lx, cy + 11);
        cy += 16;
    };

    field("First Name", profile.firstname);
    field("Last Name", profile.lastname);
    field("Email", profile.email);
    //   field("Phone",     profile.);
    field("ID / Reg.", profile.id.toString());

    // ── TABLE ───────────────────────────────────────────────────────────────────
    const tableTop = secTop + 50;
    const cols = [PAD + 2, PAD + 82, PAD + 128, PAD + 158];

    doc.setFillColor(...rgb(DARK));
    doc.rect(PAD, tableTop, W - PAD * 2, 9, "F");
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...rgb(WHITE));
    ["EXAM / QUIZ", "DATE & TIME", "ROOM", "HALL"].forEach((h, i) =>
        doc.text(h, cols[i], tableTop + 6.3)
    );

    doc.setFillColor(...rgb(WHITE));
    doc.rect(PAD, tableTop + 9, W - PAD * 2, 12, "F");
    doc.setDrawColor(220, 220, 220).setLineWidth(0.3);
    doc.rect(PAD, tableTop + 9, W - PAD * 2, 12);
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...rgb(DARK));
    [quiz.quizTitle, quiz.quizDate, String(quiz.room)].forEach((v, i) =>
        doc.text(v, cols[i], tableTop + 17, i === 0 ? { maxWidth: 75 } : {})
    );

    const extras: [string, string][] = [["Category", quiz.category]];
    if (quiz.location) extras.push(["Location", quiz.location]);
    if (quiz.laptopMode) extras.push(["Laptop", "Provided Laptop"]);
    else extras.push(["Laptop", "Own Device"]);

    let extraY = tableTop + 21;
    extras.forEach(([label, value], i) => {
        doc.setFillColor(...rgb(i % 2 === 0 ? "#fffbeb" : "#f9fafb"));
        doc.rect(PAD, extraY, W - PAD * 2, 10, "F");
        doc.setDrawColor(220, 220, 220);
        doc.rect(PAD, extraY, W - PAD * 2, 10);
        doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...rgb(DARK));
        doc.text(label + ":", cols[0], extraY + 6.8);
        doc.setFont("helvetica", "normal");
        doc.text(value, cols[0] + 26, extraY + 6.8);
        extraY += 10;
    });

    // ── BIG CODE BLOCK ──────────────────────────────────────────────────────────
    const codeBlockY = extraY + 12;

    doc.setFillColor(...rgb(DARK));
    doc.rect(PAD, codeBlockY, W - PAD * 2, 32, "F");

    doc.setFillColor(...rgb(ORANGE));          // Left accent stripe
    doc.rect(PAD, codeBlockY, 5, 32, "F");

    doc.setFont("helvetica", "bold").setFontSize(7.5).setTextColor(...rgb(ORANGE));
    doc.text("YOUR ADMISSION CODE", W / 2, codeBlockY + 9, { align: "center" });

    doc.setFontSize(30).setTextColor(...rgb(WHITE));
    doc.text(quiz.code, W / 2 - 10, codeBlockY + 25, { align: "center", charSpace: 5 });

    // ── QR CODE ─────────────────────────────────────────────────────────────────
    const qrY = codeBlockY + 40, qrSize = 44, qrX = (W - qrSize) / 2;

    doc.setFillColor(...rgb(WHITE));
    doc.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, "F");
    doc.setDrawColor(...rgb(ORANGE)).setLineWidth(1);
    doc.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...rgb(DARK));
    doc.text("Scan to verify admission", W / 2, qrY + qrSize + 6, { align: "center" });

    doc.setFont("helvetica", "normal").setFontSize(6).setTextColor(156, 163, 175);
    doc.text(
        quiz.code.slice(0, 50) + (quiz.code.length > 50 ? "…" : ""),
        W / 2, qrY + qrSize + 11, { align: "center" }
    );

    // ── FOOTER ──────────────────────────────────────────────────────────────────
    doc.setFillColor(...rgb(ORANGE));
    doc.rect(0, H - 18, W, 2, "F");
    doc.setFillColor(...rgb(DARK));
    doc.rect(0, H - 16, W, 16, "F");

    doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(156, 163, 175);
    doc.text(
        `Generated: ${new Date().toLocaleString()}   ·   ID: ${profile.id}   ·   Quiz: ${quiz.quizId}`,
        W / 2, H - 7, { align: "center" }
    );

    doc.save(`quiz-card-${quiz.quizId}.pdf`);
}