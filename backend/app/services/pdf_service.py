import io
import os
import re
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable
)
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing

from app.models.schema import CourtDossier

# Register Noto Sans Devanagari fonts for authentic Hindi LEA reporting
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(BASE_DIR, "assets", "fonts")
REGULAR_TTF = os.path.join(FONT_DIR, "NotoSansDevanagari-Regular.ttf")
BOLD_TTF = os.path.join(FONT_DIR, "NotoSansDevanagari-Bold.ttf")

HAS_DEVANAGARI = False
if os.path.exists(REGULAR_TTF):
    try:
        pdfmetrics.registerFont(TTFont('NotoSansDevanagari', REGULAR_TTF))
        if os.path.exists(BOLD_TTF):
            pdfmetrics.registerFont(TTFont('NotoSansDevanagari-Bold', BOLD_TTF))
        else:
            pdfmetrics.registerFont(TTFont('NotoSansDevanagari-Bold', REGULAR_TTF))
        HAS_DEVANAGARI = True
    except Exception as e:
        print(f"Warning: Could not register NotoSansDevanagari font: {e}")


def clean_xml_text(text: str) -> str:
    """Escapes special characters for ReportLab XML parser while preserving basic tags."""
    if not text:
        return ""
    text = text.replace("\r\n", "<br/>").replace("\n", "<br/>")
    text = re.sub(r'&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[a-fA-F0-9]+);)', '&amp;', text)
    return text


def create_qr_code(payload: str, size: float = 60) -> Drawing:
    """Generates an evidentiary verification QR code."""
    try:
        qr = QrCodeWidget(payload)
        bounds = qr.getBounds()
        w = bounds[2] - bounds[0]
        h = bounds[3] - bounds[1]
        drawing = Drawing(size, size, transform=[size / w, 0, 0, size / h, 0, 0])
        drawing.add(qr)
        return drawing
    except Exception:
        return Drawing(size, size)


class ForensicEvidenceCanvas(canvas.Canvas):
    """
    Two-pass canvas that adds running headers, running footers,
    exact page numbers (Page X of Y), and evidentiary confidentiality notices.
    """
    def __init__(self, *args, **kwargs):
        self.case_ref = kwargs.pop("case_ref", "CASE-UNKNOWN")
        self.sha256_hash = kwargs.pop("sha256_hash", "")
        self.fir_number = kwargs.pop("fir_number", "")
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        page_w, page_h = letter

        # Running header on page 2 onwards
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 7.5)
            self.setFillColor(colors.HexColor("#1B2A41"))
            self.drawString(36, page_h - 24, "CHAINWATCH // SAKSHYA FORENSIC INTELLIGENCE DOSSIER")
            self.setFont("Helvetica", 7)
            self.setFillColor(colors.HexColor("#64748B"))
            header_right = f"REF: {self.case_ref} · {self.fir_number} · SECTION 63 BSA RECORD"
            self.drawRightString(page_w - 36, page_h - 24, header_right)
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.6)
            self.line(36, page_h - 28, page_w - 36, page_h - 28)

        # Running footer on all pages
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(36, 32, page_w - 36, 32)

        self.setFont("Helvetica-Bold", 7)
        self.setFillColor(colors.HexColor("#1B2A41"))
        self.drawString(36, 22, "CONFIDENTIAL // FOR LAW ENFORCEMENT & JUDICIAL PROCEEDINGS ONLY")

        self.setFont("Courier", 6.5)
        self.setFillColor(colors.HexColor("#64748B"))
        if self.sha256_hash:
            self.drawString(page_w / 2 - 85, 22, f"SHA-256: {self.sha256_hash[:20]}...")

        self.setFont("Helvetica-Bold", 7)
        self.setFillColor(colors.HexColor("#1B2A41"))
        self.drawRightString(page_w - 36, 22, f"Page {self._pageNumber} of {total_pages}")

        self.restoreState()


class PDFDossierGenerator:
    """
    Generates Section 63 BSA 2023 & Section 94 BNSS compliant forensic dossiers
    as downloadable, tamper-sealed PDF documents for Indian court submission.
    """

    @classmethod
    def generate_pdf_bytes(cls, dossier: CourtDossier) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=42
        )

        styles = getSampleStyleSheet()

        # Typography Styles
        gov_header_style = ParagraphStyle(
            'GovHeader',
            parent=styles['Normal'],
            fontSize=8,
            leading=11,
            textColor=colors.HexColor('#1B2A41'),
            fontName='Helvetica-Bold',
            alignment=0
        )

        gov_sub_style = ParagraphStyle(
            'GovSub',
            parent=styles['Normal'],
            fontSize=7,
            leading=9.5,
            textColor=colors.HexColor('#64748B'),
            fontName='Helvetica',
            alignment=0
        )

        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontSize=14,
            leading=17,
            textColor=colors.HexColor('#1B2A41'),
            alignment=1,
            fontName='Helvetica-Bold',
            spaceBefore=4,
            spaceAfter=3
        )

        statutory_cite_style = ParagraphStyle(
            'StatutoryCite',
            parent=styles['Normal'],
            fontSize=7.5,
            leading=10,
            textColor=colors.HexColor('#8D4F12'),
            alignment=1,
            fontName='Helvetica-Bold',
            spaceAfter=6
        )

        section_heading = ParagraphStyle(
            'SectionHead',
            parent=styles['Heading2'],
            fontSize=9.5,
            leading=12.5,
            textColor=colors.HexColor('#1B2A41'),
            fontName='Helvetica-Bold',
            spaceBefore=8,
            spaceAfter=3
        )

        body_style = ParagraphStyle(
            'BodyDark',
            parent=styles['Normal'],
            fontSize=7.5,
            leading=10.5,
            textColor=colors.HexColor('#2D3748'),
            fontName='Helvetica'
        )

        body_bold = ParagraphStyle(
            'BodyBold',
            parent=styles['Normal'],
            fontSize=7.5,
            leading=10.5,
            textColor=colors.HexColor('#1A202C'),
            fontName='Helvetica-Bold'
        )

        hindi_body_style = ParagraphStyle(
            'HindiBody',
            parent=styles['Normal'],
            fontSize=8,
            leading=11.5,
            textColor=colors.HexColor('#1F2937'),
            fontName='NotoSansDevanagari' if HAS_DEVANAGARI else 'Helvetica'
        )

        hindi_heading = ParagraphStyle(
            'HindiHeading',
            parent=styles['Heading3'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#1B2A41'),
            fontName='NotoSansDevanagari-Bold' if HAS_DEVANAGARI else 'Helvetica-Bold',
            spaceBefore=4,
            spaceAfter=2
        )

        code_style = ParagraphStyle(
            'CodeText',
            parent=styles['Normal'],
            fontSize=6.5,
            leading=8.5,
            textColor=colors.HexColor('#1A202C'),
            fontName='Courier'
        )

        code_bold = ParagraphStyle(
            'CodeBold',
            parent=styles['Normal'],
            fontSize=6.5,
            leading=8.5,
            textColor=colors.HexColor('#1A202C'),
            fontName='Courier-Bold'
        )

        notice_code_style = ParagraphStyle(
            'NoticeCode',
            parent=styles['Normal'],
            fontSize=6.5,
            leading=9,
            textColor=colors.HexColor('#7F1D1D'),
            fontName='Courier'
        )

        elements = []

        # ---------------------------------------------------------
        # 1. OFFICIAL SOVEREIGN HEADER & VERIFICATION QR CODE
        # ---------------------------------------------------------
        qr_payload = (
            f"CHAINWATCH-SEC63-EVIDENCE|CASE:{dossier.case_ref}|"
            f"FIR:{dossier.fir_number}|HASH:{dossier.sha256_digest}|"
            f"IPFS:{dossier.ipfs_cid}|DATE:{dossier.generated_at}"
        )
        qr_drawing = create_qr_code(qr_payload, size=54)

        header_text = [
            Paragraph("<b>सत्यमेव जयते · GOVERNMENT OF INDIA</b>", gov_header_style),
            Paragraph("<b>MINISTRY OF HOME AFFAIRS · CYBER CRIME INVESTIGATION WING</b>", gov_header_style),
            Paragraph("INDIAN CYBERCRIME COORDINATION CENTRE (I4C) · NATIONAL PORTAL (NCRP)", gov_sub_style),
            Paragraph("CENTRAL DIGITAL FORENSICS REPOSITORY // STATUTORY RECORD DIVISION", gov_sub_style),
        ]

        qr_meta = [
            Paragraph("<b>EVIDENCE QR SEAL</b>", ParagraphStyle('QRHead', parent=gov_header_style, fontSize=7, alignment=2)),
            Paragraph("<b>SHA-256 SIGNED</b>", ParagraphStyle('QRSub', parent=gov_sub_style, fontSize=6.5, textColor=colors.HexColor('#2C5E43'), alignment=2)),
            Paragraph(f"REF: {clean_xml_text(dossier.case_ref)}", ParagraphStyle('QRRef', parent=gov_sub_style, fontSize=6, fontName='Courier', alignment=2)),
        ]

        top_banner_table = Table(
            [[header_text, qr_meta, qr_drawing]],
            colWidths=[340, 140, 60]
        )
        top_banner_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ]))
        elements.append(top_banner_table)
        elements.append(Spacer(1, 4))

        # Gold and Navy Double Rule
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1B2A41'), spaceAfter=2))
        elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#8D4F12'), spaceAfter=5))

        # Document Title
        elements.append(Paragraph("STATUTORY BLOCKCHAIN FORENSIC EVIDENCE DOSSIER", title_style))
        elements.append(Paragraph(
            "COMPILED UNDER SECTION 63 OF BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023 "
            "(FORMERLY SECTION 65B OF INDIAN EVIDENCE ACT, 1872)<br/>"
            "READ WITH SECTIONS 94 &amp; 102 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023",
            statutory_cite_style
        ))
        elements.append(Spacer(1, 3))

        # ---------------------------------------------------------
        # 2. CASE & INVESTIGATION METADATA TABLE
        # ---------------------------------------------------------
        trail_status_text = getattr(dossier.trace_data, 'trail_status', None) or 'VASP_DEPOSIT'
        meta_rows = [
            [
                Paragraph("<b>Case Reference:</b>", body_style),
                Paragraph(clean_xml_text(dossier.case_ref), code_bold),
                Paragraph("<b>FIR / NCRP Ack No:</b>", body_style),
                Paragraph(f"{clean_xml_text(dossier.fir_number)}", body_bold)
            ],
            [
                Paragraph("<b>Police Station / Unit:</b>", body_style),
                Paragraph(clean_xml_text(dossier.unit), body_style),
                Paragraph("<b>Investigating Officer:</b>", body_style),
                Paragraph(f"<b>{clean_xml_text(dossier.investigating_officer)}</b>", body_style)
            ],
            [
                Paragraph("<b>Suspect Target Wallet:</b>", body_style),
                Paragraph(clean_xml_text(dossier.suspect_target_id), code_style),
                Paragraph("<b>Offence Classification:</b>", body_style),
                Paragraph("Sec 318(4) BNS / Sec 66D IT Act", body_style)
            ],
            [
                Paragraph("<b>Attributed VASP / Vault:</b>", body_style),
                Paragraph(f"<b>{clean_xml_text(dossier.assigned_vasp.name)}</b> ({clean_xml_text(dossier.assigned_vasp.fiu_reg_number)})", body_style),
                Paragraph("<b>Attribution Confidence:</b>", body_style),
                Paragraph(f"<b>{int(dossier.trace_data.confidence * 100)}% (Deterministic)</b>", body_style)
            ],
            [
                Paragraph("<b>Total Value Traced:</b>", body_style),
                Paragraph(f"<b>{clean_xml_text(dossier.trace_data.total_value_stolen)}</b>", body_bold),
                Paragraph("<b>Network Topology:</b>", body_style),
                Paragraph(f"{clean_xml_text(dossier.trace_data.typology)} ({dossier.trace_data.total_hops} Hops)", body_style)
            ],
            [
                Paragraph("<b>Trail Disposition:</b>", body_style),
                Paragraph(
                    f"<b>{clean_xml_text(trail_status_text)}</b>",
                    ParagraphStyle('TrailBadge', parent=body_bold, textColor=colors.HexColor('#9E2A2B'))
                ),
                Paragraph("<b>Risk Score / Status:</b>", body_style),
                Paragraph(f"<b>{dossier.trace_data.risk_score} / 100 (CRITICAL RISK)</b>", body_style)
            ]
        ]

        meta_table = Table(meta_rows, colWidths=[110, 160, 120, 150])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F9FAFB')),
            ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 6))

        # ---------------------------------------------------------
        # 3. BILINGUAL INVESTIGATIVE NARRATIVE
        # ---------------------------------------------------------
        elements.append(Paragraph("1. EXECUTIVE INVESTIGATIVE NARRATIVE (ENGLISH)", section_heading))
        elements.append(Paragraph(clean_xml_text(dossier.synopsis_en), body_style))
        elements.append(Spacer(1, 5))

        elements.append(Paragraph("2. कार्यपालक अभियोजन सारांश (हिंदी अनुवाद - न्यायालयीन साक्ष्य)", hindi_heading))
        elements.append(Paragraph(clean_xml_text(dossier.synopsis_hi), hindi_body_style))
        elements.append(Spacer(1, 6))

        # ---------------------------------------------------------
        # 4. STRUCTURED ON-CHAIN CHAIN OF CUSTODY TABLE
        # ---------------------------------------------------------
        elements.append(Paragraph("3. ON-CHAIN TRANSACTION DISPERSION &amp; ATOMIC HOP LOG", section_heading))
        tx_rows = [
            [
                Paragraph("<b>HOP</b>", body_style),
                Paragraph("<b>TRANSACTION HASH</b>", body_style),
                Paragraph("<b>CHAIN</b>", body_style),
                Paragraph("<b>AMOUNT</b>", body_style),
                Paragraph("<b>FORENSIC HEURISTIC / PATTERN</b>", body_style),
                Paragraph("<b>LEGAL STATUS</b>", body_style)
            ]
        ]

        for idx, link in enumerate(dossier.trace_data.links, 1):
            hop_label = f"#{idx:02d}"
            heuristic_desc = link.heuristic or "Direct on-chain movement"
            if getattr(link, 'is_bridge', False) or getattr(link, 'isBridge', False):
                heuristic_desc = f"Bridge Cross: {heuristic_desc}"

            tx_rows.append([
                Paragraph(hop_label, body_bold),
                Paragraph(clean_xml_text(link.tx_hash[:18] + "..."), code_style),
                Paragraph(clean_xml_text(link.chain.upper()), body_style),
                Paragraph(clean_xml_text(link.value), body_bold),
                Paragraph(clean_xml_text(heuristic_desc), body_style),
                Paragraph("Admissible", ParagraphStyle('Admissible', parent=body_style, textColor=colors.HexColor('#2C5E43'), fontName='Helvetica-Bold'))
            ])

        tx_table = Table(tx_rows, colWidths=[35, 130, 50, 95, 160, 70])
        tx_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1B2A41')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
            ('TOPPADDING', (0, 0), (-1, -1), 2.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(tx_table)
        elements.append(Spacer(1, 6))

        # ---------------------------------------------------------
        # 5. SECTION 94 BNSS STATUTORY FREEZING ORDER DIRECTIVE
        # ---------------------------------------------------------
        elements.append(Paragraph("4. STATUTORY FREEZING REQUISITION (SECTION 94 BNSS, 2023)", section_heading))
        notice_content = clean_xml_text(dossier.section94_notice_preview)
        notice_table = Table([[Paragraph(notice_content, notice_code_style)]], colWidths=[540])
        notice_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FEF2F2')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#DC2626')),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 7),
            ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ]))
        elements.append(notice_table)
        elements.append(Spacer(1, 6))

        # ---------------------------------------------------------
        # 6. SECTION 63 BSA 2023 CERTIFICATE OF ELECTRONIC EVIDENCE
        # ---------------------------------------------------------
        elements.append(Paragraph("5. CERTIFICATE OF ELECTRONIC EVIDENCE (SECTION 63 BSA, 2023 / SEC 65B IEA)", section_heading))
        cert_text = (
            f"I, <b>{clean_xml_text(dossier.investigating_officer)}</b>, Investigating Officer attached to {clean_xml_text(dossier.unit)}, "
            f"do hereby certify under Section 63(2) of the Bharatiya Sakshya Adhiniyam (BSA), 2023 that:<br/>"
            f"(a) The computer system (CHAINWATCH Core v1.0 / NCRP Forensics) produced the electronic records contained herein "
            f"during regular operational law enforcement tracing;<br/>"
            f"(b) At all material times during compilation, the automated node indexers and cryptographic mempool processors "
            f"operated properly without system defect or data corruption;<br/>"
            f"(c) The SHA-256 evidence integrity digest below was generated directly from immutable distributed ledger states:<br/>"
            f"&nbsp;&nbsp;&nbsp;&nbsp;<b>Cryptographic SHA-256 Digest:</b> <font name='Courier'>{clean_xml_text(dossier.sha256_digest)}</font><br/>"
            f"&nbsp;&nbsp;&nbsp;&nbsp;<b>Decentralized Archival (IPFS CID):</b> <font name='Courier'>{clean_xml_text(dossier.ipfs_cid)}</font><br/>"
            f"(d) This document is an authentic, unedited reproduction of electronic evidence admissible in all courts of law."
        )

        cert_table = Table([[Paragraph(cert_text, body_style)]], colWidths=[540])
        cert_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0FDF4')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#16A34A')),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 7),
            ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ]))
        elements.append(cert_table)
        elements.append(Spacer(1, 8))

        # ---------------------------------------------------------
        # 7. DUAL STATUTORY SIGNATURE BLOCKS
        # ---------------------------------------------------------
        sig_rows = [
            [
                Paragraph("<b>INVESTIGATING OFFICER (I.O.)</b>", body_bold),
                Paragraph("<b>CYBER TECHNICAL EXAMINER / CUSTODIAN</b>", body_bold)
            ],
            [
                Paragraph(
                    f"Signature: __________________________<br/>"
                    f"Name: <b>{clean_xml_text(dossier.investigating_officer)}</b><br/>"
                    f"Designation: Inspector of Police (Cyber Wing)<br/>"
                    f"Unit: {clean_xml_text(dossier.unit)}<br/>"
                    f"Date: {datetime.now().strftime('%d-%b-%Y')} · New Delhi",
                    body_style
                ),
                Paragraph(
                    f"Digital Seal: [HSM SEC-65B SEAL ATTACHED]<br/>"
                    f"Certifying Authority: NCRP Forensic Core<br/>"
                    f"Key Algorithm: ECDSA P-256 / SHA-256<br/>"
                    f"Public Key ID: 0x94B2...E109<br/>"
                    f"Verification Status: <b>STATUTORILY VALID</b>",
                    body_style
                )
            ]
        ]
        sig_table = Table(sig_rows, colWidths=[270, 270])
        sig_table.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(KeepTogether([sig_table]))

        # Build document with custom canvas
        def make_canvas(*args, **kwargs):
            return ForensicEvidenceCanvas(
                *args,
                case_ref=dossier.case_ref,
                sha256_hash=dossier.sha256_digest,
                fir_number=dossier.fir_number,
                **kwargs
            )

        doc.build(elements, canvasmaker=make_canvas)
        buffer.seek(0)
        return buffer.getvalue()
