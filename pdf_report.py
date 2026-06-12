"""
SmartCare ASD — PDF Report Generator
Uses fpdf2 to produce a professional clinical PDF report.
"""

import os
import datetime
from fpdf import FPDF, XPos, YPos
from config import REPORTS_DIR


class ASDReport(FPDF):
    """Custom FPDF subclass with header/footer branding."""

    BRAND_COLOR   = (13,  110, 253)   # Bootstrap primary blue
    HIGH_COLOR    = (220,  53,  69)   # red
    MOD_COLOR     = (255, 193,   7)   # amber
    LOW_COLOR     = (25,  135, 84)    # green

    def header(self):
        self.set_fill_color(*self.BRAND_COLOR)
        self.rect(0, 0, 210, 18, 'F')
        self.set_font('Helvetica', 'B', 13)
        self.set_text_color(255, 255, 255)
        self.set_y(4)
        self.cell(0, 10, 'SmartCare ASD - Screening Report', align='C')
        self.set_text_color(0, 0, 0)
        self.ln(14)

    def footer(self):
        self.set_y(-14)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 8,
                  'CONFIDENTIAL - For clinical use only. '
                  'This AI output does not replace professional diagnosis.',
                  align='C')
        self.cell(0, 0, f'Page {self.page_no()}', align='R')


def _risk_color(label: str):
    if label == 'High':
        return (220, 53, 69)
    if label == 'Moderate':
        return (255, 193, 7)
    return (25, 135, 84)


def generate_pdf(
    child_name:    str,
    dob:           str,
    gender:        str,
    screened_at:   str,
    q_scores:      list[int],
    behavior_pct:  float,
    vision_pct:    float,
    fusion_score:  float,
    risk_label:    str,
    gemini_summary: str,
    screening_id:  int,
) -> str:
    """
    Generate and save the PDF report.

    Returns the absolute path to the saved PDF.
    """
    pdf = ASDReport()
    clean_sid = screening_id if isinstance(screening_id, str) else f'SC-{screening_id:05d}'
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=18)

    # --- Child Info block ---
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, 'Patient Information', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_fill_color(240, 245, 255)
    rows = [
        ('Child Name',    child_name),
        ('Date of Birth', dob),
        ('Gender',        gender.capitalize()),
        ('Screened On',   screened_at),
        ('Screening ID',  clean_sid),
    ]
    for label, value in rows:
        pdf.cell(55, 7, label + ':', fill=True)
        pdf.cell(0, 7, value, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)

    # --- Scores summary ---
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, 'Screening Scores', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('Helvetica', '', 10)
    score_rows = [
        ('Behavioral Score (SVM)', f'{behavior_pct:.2f}%'),
        ('Vision Score (CNN)',     f'{vision_pct:.2f}%'),
        ('Fusion Score (0.6V+0.4B)', f'{fusion_score*100:.2f}%'),
    ]
    for label, value in score_rows:
        pdf.cell(80, 7, label + ':')
        pdf.cell(0, 7, value, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

    # Risk badge
    rc = _risk_color(risk_label)
    pdf.set_fill_color(*rc)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 10, f'  Risk Classification:  {risk_label.upper()}  ',
             fill=True, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(4)

    # --- Q-CHAT-10 detail table ---
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, 'Q-CHAT-10 Question Detail', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    questions = [
        'Does your child look at you when you call his/her name?',
        'How easy is it for you to get eye contact with your child?',
        'Does your child point to indicate that s/he wants something?',
        'Does your child point to share interest with you?',
        'Does your child pretend (e.g. care for dolls)?',
        'Does your child follow where you\'re looking?',
        'If you or someone in the family is upset, does your child show signs of wanting to comfort them?',
        'Would you describe your child\'s first words as normal?',
        'Does your child use simple gestures (e.g. wave goodbye)?',
        'Does your child stare at nothing with no apparent purpose?',
    ]
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_fill_color(*ASDReport.BRAND_COLOR)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(10, 7, '#',    border=1, fill=True)
    pdf.cell(148, 7, 'Question',  border=1, fill=True)
    pdf.cell(22, 7, 'Score', border=1, fill=True, align='C',
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font('Helvetica', '', 8)
    for i, (q, s) in enumerate(zip(questions, q_scores), 1):
        fill = (i % 2 == 0)
        pdf.set_fill_color(245, 245, 250) if fill else pdf.set_fill_color(255, 255, 255)
        pdf.cell(10, 6, str(i), border=1, fill=fill)
        pdf.cell(148, 6, q,    border=1, fill=fill)
        pdf.cell(22, 6, str(s), border=1, fill=fill, align='C',
                 new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(5)

    # --- Clinical summary ---
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, "Clinical Summary", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_fill_color(250, 250, 255)
    pdf.multi_cell(0, 6, gemini_summary or 'No summary generated.', fill=True)
    pdf.ln(4)

    # --- Referral centres ---
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, 'Recommended Referral Centres (Pakistan)', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('Helvetica', '', 10)
    centres = [
        ('IHRI',             'Institute Of Holistic Rehabilitation and Inclusion, Karachi'),
        ('CARTS',            'Center for Autism Rehabilitation and Training, Sindh'),
        ('ASD Welfare Trust','ASD Welfare Trust, Karachi'),
    ]
    for abbr, full in centres:
        pdf.cell(32, 6, abbr + ':')
        pdf.cell(0, 6, full, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # --- Disclaimer ---
    pdf.ln(4)
    pdf.set_font('Helvetica', 'I', 8)
    pdf.set_text_color(120, 120, 120)
    pdf.multi_cell(0, 5,
        'DISCLAIMER: This report is generated by an AI screening tool and is intended '
        'solely as a preliminary clinical aid. It does not constitute a medical diagnosis. '
        'A qualified developmental paediatrician or psychologist must conduct a full '
        'DSM-5 or ICD-11 evaluation before any clinical decision is made.')

    # Save
    filename = f'{clean_sid}_{child_name.replace(" ","_")}.pdf'
    filepath = os.path.join(REPORTS_DIR, filename)
    pdf.output(filepath)
    return os.path.abspath(filepath)
