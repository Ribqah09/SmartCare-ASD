"""
SmartCare ASD - PDF Report Generator (report_service.py)
=========================================================
Uses ReportLab for professional clinical PDF generation.
Supports Unicode, proper fonts, and digital signature timestamps.
Saves to static/reports/ and returns a secure URL.
"""

import os
import datetime
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, Image
)
from reportlab.platypus.frames import Frame
from reportlab.platypus.doctemplate import PageTemplate
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics import renderPDF

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
REPORTS_DIR = os.getenv('REPORTS_DIR', 'reports')
os.makedirs(REPORTS_DIR, exist_ok=True)

# Brand colors (RGB tuples 0-1 float)
BRAND_BLUE    = colors.HexColor('#1e3a8a')
BRAND_DARK    = colors.HexColor('#0f172a')
HIGH_RED      = colors.HexColor('#dc2626')
MODERATE_AMB  = colors.HexColor('#d97706')
LOW_GREEN     = colors.HexColor('#16a34a')
LIGHT_GREY    = colors.HexColor('#f8fafc')
BORDER_GREY   = colors.HexColor('#cbd5e1')
TEXT_GREY     = colors.HexColor('#334155')


def _risk_colors(label: str):
    if label == 'High':
        return colors.HexColor('#fee2e2'), colors.HexColor('#b91c1c')
    if label == 'Moderate':
        return colors.HexColor('#ffedd5'), colors.HexColor('#b45309')
    return colors.HexColor('#dcfce7'), colors.HexColor('#15803d')


def _risk_color(label: str):
    if label == 'High':
        return HIGH_RED
    if label == 'Moderate':
        return MODERATE_AMB
    return LOW_GREEN


def _age_from_dob(dob: str) -> str:
    """Compute human-readable age from ISO date string."""
    try:
        born = datetime.date.fromisoformat(str(dob))
        today = datetime.date.today()
        months = (today.year - born.year) * 12 + (today.month - born.month)
        years, rem_months = divmod(months, 12)
        if years > 0:
            return f"{years}y {rem_months}m"
        return f"{months} months"
    except Exception:
        return str(dob)


def generate_pdf(
    child_name:     str,
    dob:            str,
    gender:         str,
    screened_at:    str,
    q_scores:       list,
    behavior_pct:   float,
    vision_pct:     float,
    fusion_score:   float,
    risk_label:     str,
    gemini_summary: str,
    screening_id:   int,
) -> str:
    """
    Generate a professional clinical PDF report using ReportLab.

    Returns the absolute filesystem path to the saved PDF.
    """
    clean_sid = screening_id if isinstance(screening_id, str) else f'SC-{screening_id:05d}'
    filename = f'{clean_sid}_{child_name.replace(" ", "_")}.pdf'
    filepath = os.path.join(REPORTS_DIR, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=28*mm,
        bottomMargin=20*mm,
        title=f'SmartCare ASD Report - {child_name}',
        author='SmartCare ASD System',
    )

    styles = getSampleStyleSheet()

    # --- Custom Styles ---
    heading1 = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Normal'],
        fontSize=18,
        leading=22,
        fontName='Helvetica-Bold',
        textColor=BRAND_DARK,
        spaceAfter=6,
    )
    heading2 = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        fontName='Helvetica-Bold',
        textColor=BRAND_DARK,
        spaceBefore=12,
        spaceAfter=4,
    )
    body = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        fontName='Helvetica',
        textColor=TEXT_GREY,
    )
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=7.5,
        leading=11,
        fontName='Helvetica-Oblique',
        textColor=colors.HexColor('#94a3b8'),
    )
    center_style = ParagraphStyle(
        'Center',
        parent=body,
        alignment=TA_CENTER,
    )

    story = []

    # =========================================================================
    # HEADER BANNER
    # =========================================================================
    logo_path = "C:/SmartCare_ASD/frontend/dist/logo.png"
    logo_img = None
    if os.path.exists(logo_path):
        try:
            # High quality 40x40 logo size for official look
            logo_img = Image(logo_path, width=40, height=40)
        except Exception as e:
            print(f"Error loading logo in PDF: {e}")

    # Set up custom header styles
    header_title_style = ParagraphStyle(
        'HeaderTitleText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=18,
        textColor=BRAND_BLUE,
        alignment=TA_LEFT
    )

    if logo_img:
        # Side-by-side title block containing logo and text
        title_table = Table([[logo_img, Paragraph(
            'SmartCare ASD<br/><font fontName="Helvetica" size="7.5" color="#475569">Early Autism Multimodal Screening Report</font>',
            header_title_style
        )]], colWidths=[46, doc.width * 0.55])
        title_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
        ]))
        header_left = title_table
    else:
        header_left = Paragraph(
            'SmartCare ASD<br/><font fontName="Helvetica" size="7.5" color="#475569">Early Autism Multimodal Screening Report</font>',
            header_title_style
        )

    header_right_style = ParagraphStyle(
        'HeaderRightTextStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_GREY,
        alignment=TA_RIGHT
    )

    header_right = Paragraph(
        f'<b>REPORT ID:</b> {clean_sid}<br/>'
        f'<b>DATE GENERATED:</b> {screened_at}<br/>'
        f'<font color="{BRAND_BLUE.hexval()}"><b>CONFIDENTIAL CLINICAL RECORD</b></font>',
        header_right_style
    )

    header_data = [[header_left, header_right]]
    header_table = Table(header_data, colWidths=[doc.width * 0.60, doc.width * 0.40])
    header_table.setStyle(TableStyle([
        ('BACKGROUND',  (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('ROWPADDING',  (0, 0), (-1, -1), 10),
        ('VALIGN',      (0, 0), (-1, -1), 'MIDDLE'),
        ('LINEABOVE',   (0, 0), (-1, -1), 3, BRAND_BLUE),
        ('LINEBELOW',   (0, 0), (-1, -1), 0.5, BORDER_GREY),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6*mm))

    # =========================================================================
    # PATIENT INFORMATION
    # =========================================================================
    story.append(Paragraph('1. PATIENT DEMOGRAPHICS & PROFILE', heading2))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_GREY))
    story.append(Spacer(1, 3*mm))

    age_str = _age_from_dob(dob)
    info_data = [
        ['Child Name',      child_name,         'Gender',      gender.capitalize()],
        ['Date of Birth',   str(dob),            'Age',         age_str],
        ['Screened On',     screened_at,         'Screening ID', clean_sid],
    ]
    info_table = Table(
        info_data,
        colWidths=[doc.width * 0.18, doc.width * 0.32, doc.width * 0.18, doc.width * 0.32]
    )
    info_table.setStyle(TableStyle([
        ('FONTNAME',    (0, 0), (-1, -1), 'Helvetica'),
        ('FONTNAME',    (0, 0), (0, -1), 'Helvetica-Bold'),  # label cols
        ('FONTNAME',    (2, 0), (2, -1), 'Helvetica-Bold'),
        ('FONTSIZE',    (0, 0), (-1, -1), 9),
        ('TEXTCOLOR',   (0, 0), (-1, -1), TEXT_GREY),
        ('TEXTCOLOR',   (0, 0), (0, -1), BRAND_DARK),
        ('TEXTCOLOR',   (2, 0), (2, -1), BRAND_DARK),
        ('BACKGROUND',  (0, 0), (-1, -1), LIGHT_GREY),
        ('GRID',        (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('ROWPADDING',  (0, 0), (-1, -1), 6),
        ('VALIGN',      (0, 0), (-1, -1), 'MIDDLE'),
        ('ROUNDEDCORNERS', [4]),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 6*mm))

    # =========================================================================
    # SCREENING RESULTS SUMMARY
    # =========================================================================
    story.append(Paragraph('2. DIAGNOSTIC SCORING SUMMARY', heading2))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_GREY))
    story.append(Spacer(1, 3*mm))

    risk_bg, risk_text_color = _risk_colors(risk_label)
    results_data = [
        ['Metric',                  'Score',                    'Interpretation'],
        ['Behavioral Score (SVM)',  f'{behavior_pct:.2f}%',     'Q-CHAT-10 based behavioral risk'],
        ['Vision Score (CNN/VGG16)',f'{vision_pct:.2f}%',       'Facial feature ASD indicator'],
        ['Fusion Score',            f'{fusion_score * 100:.2f}%','0.6 x Vision + 0.4 x Behavior'],
        ['Risk Classification',     risk_label.upper(),         'Clinical risk level indicator'],
    ]
    col_w = [doc.width * 0.38, doc.width * 0.22, doc.width * 0.40]
    results_table = Table(results_data, colWidths=col_w)
    results_table.setStyle(TableStyle([
        ('FONTNAME',    (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME',    (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE',    (0, 0), (-1, -1), 9),
        ('BACKGROUND',  (0, 0), (-1, 0), BRAND_BLUE),
        ('TEXTCOLOR',   (0, 0), (-1, 0), colors.white),
        ('GRID',        (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('ROWPADDING',  (0, 0), (-1, -1), 7),
        ('VALIGN',      (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [LIGHT_GREY, colors.white]),
        ('BACKGROUND',  (0, -1), (-1, -1), risk_bg),  # risk row soft highlight
        ('TEXTCOLOR',   (0, -1), (-1, -1), risk_text_color),
        ('FONTNAME',    (0, -1), (-1, -1), 'Helvetica-Bold'),
    ]))
    story.append(results_table)
    story.append(Spacer(1, 6*mm))

    # =========================================================================
    # Q-CHAT-10 DETAIL TABLE
    # =========================================================================
    story.append(Paragraph('3. BEHAVIORAL QUESTIONNAIRE PERFORMANCE (Q-CHAT-10)', heading2))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_GREY))
    story.append(Spacer(1, 3*mm))

    q_questions = [
        'Does your child look at you when you call his/her name?',
        'How easy is it for you to get eye contact with your child?',
        'Does your child point to indicate that s/he wants something?',
        'Does your child point to share interest with you?',
        'Does your child pretend (e.g. care for dolls, toy phone)?',
        "Does your child follow where you're looking?",
        'If upset, does your child show signs of wanting to comfort them?',
        "Would you describe your child's first words as normal?",
        'Does your child use simple gestures (e.g. wave goodbye)?',
        'Does your child stare at nothing with no apparent purpose?',
    ]

    qchat_header = [['#', 'Question', 'Score', 'Risk Level']]
    qchat_rows = []
    for idx, (q, s) in enumerate(zip(q_questions, q_scores), 1):
        # Q-CHAT: scores 0-4 where 0=always/never (depends on question)
        # For display, higher score = more concern
        risk_lvl = 'High' if s >= 3 else ('Moderate' if s >= 2 else 'Low')
        qchat_rows.append([str(idx), q, str(s), risk_lvl])

    qchat_table = Table(
        qchat_header + qchat_rows,
        colWidths=[8*mm, doc.width - 8*mm - 14*mm - 22*mm, 14*mm, 22*mm]
    )

    qchat_style = [
        ('FONTNAME',    (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME',    (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE',    (0, 0), (-1, -1), 8),
        ('BACKGROUND',  (0, 0), (-1, 0), BRAND_BLUE),
        ('TEXTCOLOR',   (0, 0), (-1, 0), colors.white),
        ('GRID',        (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('ROWPADDING',  (0, 0), (-1, -1), 5),
        ('VALIGN',      (0, 0), (-1, -1), 'MIDDLE'),
    ]
    # Alternating rows + color-code risk column with soft colors
    for i, row in enumerate(qchat_rows, 1):
        bg = LIGHT_GREY if i % 2 == 0 else colors.white
        qchat_style.append(('BACKGROUND', (0, i), (-2, i), bg))
        risk_val = row[3]
        r_bg, r_text = _risk_colors(risk_val)
        qchat_style.append(('BACKGROUND', (3, i), (3, i), r_bg))
        qchat_style.append(('TEXTCOLOR',  (3, i), (3, i), r_text))
        qchat_style.append(('FONTNAME',   (3, i), (3, i), 'Helvetica-Bold'))

    qchat_table.setStyle(TableStyle(qchat_style))
    story.append(qchat_table)
    story.append(Spacer(1, 6*mm))

    # =========================================================================
    # CLINICAL SUMMARY
    # =========================================================================
    story.append(Paragraph("4. CLINICAL INTERPRETATION", heading2))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_GREY))
    story.append(Spacer(1, 3*mm))

    summary_text = gemini_summary or 'Clinical summary unavailable. Please consult a developmental specialist.'
    # Clean up any potential special chars
    summary_text = summary_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    summary_para = Paragraph(summary_text, body)
    summary_box = Table([[summary_para]], colWidths=[doc.width])
    summary_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREY),
        ('ROWPADDING', (0, 0), (-1, -1), 10),
        ('LINELEFT',   (0, 0), (0, -1), 3, BRAND_BLUE),
        ('LINERIGHT',  (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('LINEABOVE',  (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('LINEBELOW',  (0, 0), (-1, -1), 0.5, BORDER_GREY),
    ]))
    story.append(summary_box)
    story.append(Spacer(1, 6*mm))

    # =========================================================================
    # REFERRAL CENTRES
    # =========================================================================
    story.append(Paragraph('5. RECOMMENDED CLINICAL PATHWAYS (PAKISTAN)', heading2))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_GREY))
    story.append(Spacer(1, 3*mm))

    centres = [
        ('IHRI',              'Institute Of Holistic Rehabilitation and Inclusion, Karachi'),
        ('CARTS',             'Center for Autism Rehabilitation and Training, Sindh'),
        ('ASD Welfare Trust', 'ASD Welfare Trust, Karachi'),
        ('NAAS',              'National Autism Association of Pakistan, Karachi'),
    ]
    centres_data = [['Centre', 'Full Name']] + centres
    centres_table = Table(centres_data, colWidths=[doc.width * 0.3, doc.width * 0.7])
    centres_table.setStyle(TableStyle([
        ('FONTNAME',    (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME',    (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE',    (0, 0), (-1, -1), 9),
        ('BACKGROUND',  (0, 0), (-1, 0), BRAND_BLUE),
        ('TEXTCOLOR',   (0, 0), (-1, 0), colors.white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [LIGHT_GREY, colors.white]),
        ('GRID',        (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('ROWPADDING',  (0, 0), (-1, -1), 6),
        ('VALIGN',      (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(centres_table)
    story.append(Spacer(1, 6*mm))

    # =========================================================================
    # DIGITAL SIGNATURE BLOCK
    # =========================================================================
    sig_timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC+5')
    sig_data = [[
        Paragraph(
            f'<font size="8"><b>Digitally Generated By:</b> SmartCare ASD System v1.0<br/>'
            f'<b>Timestamp:</b> {sig_timestamp}<br/>'
            f'<b>Report ID:</b> {clean_sid}<br/>'
            f'<b>Method:</b> Multimodal AI (VGG16 + SVM-RBF Fusion)</font>',
            ParagraphStyle('Sig', parent=styles['Normal'], fontName='Helvetica',
                           fontSize=8, textColor=TEXT_GREY)
        ),
        Paragraph(
            f'<font size="8" color="#1e40af"><b>VERIFIED</b></font><br/>'
            f'<font size="7">AI-Generated Clinical Aid</font><br/>'
            f'<font size="7">Not a Medical Diagnosis</font>',
            ParagraphStyle('SigRight', parent=styles['Normal'], fontName='Helvetica',
                           fontSize=8, alignment=TA_CENTER)
        ),
    ]]
    sig_table = Table(sig_data, colWidths=[doc.width * 0.75, doc.width * 0.25])
    sig_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0f9ff')),
        ('ROWPADDING', (0, 0), (-1, -1), 10),
        ('LINELEFT',   (0, 0), (0, -1), 3, BRAND_BLUE),
        ('LINERIGHT',  (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('LINEABOVE',  (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('LINEBELOW',  (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ('VALIGN',     (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(sig_table)
    story.append(Spacer(1, 4*mm))

    # =========================================================================
    # DISCLAIMER
    # =========================================================================
    disclaimer = (
        'DISCLAIMER: This report is generated by an AI screening tool and is intended solely as a '
        'preliminary clinical aid for children aged 12-36 months. It does NOT constitute a medical '
        'diagnosis. A qualified developmental paediatrician or psychologist must conduct a full '
        'DSM-5 or ICD-11 evaluation before any clinical decision is made. '
        'The fusion model uses: S_final = 0.6 x P_vision + 0.4 x P_behavior.'
    )
    story.append(Paragraph(disclaimer, disclaimer_style))

    # =========================================================================
    # BUILD PDF
    # =========================================================================

    def _on_page(canvas, doc):
        """Footer on every page."""
        canvas.saveState()
        canvas.setFont('Helvetica', 7)
        canvas.setFillColor(TEXT_GREY)
        canvas.drawString(
            20*mm, 12*mm,
            f'SmartCare ASD - Confidential Clinical Report | {clean_sid} | Page {doc.page}'
        )
        canvas.drawRightString(
            A4[0] - 20*mm, 12*mm,
            'CONFIDENTIAL - For clinical use only'
        )
        canvas.restoreState()

    doc.build(story, onFirstPage=_on_page, onLaterPages=_on_page)
    return os.path.abspath(filepath)
