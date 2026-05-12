import sys
import argparse
import os
import subprocess
import tempfile
import zipfile

try:
    from pypdf import PdfReader, PdfWriter
    from pdf2image import convert_from_path
    import pikepdf
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from pdf2docx import Converter
except ImportError as e:
    print(f"Missing dependency: {e}. Please ensure pypdf, pdf2image, pikepdf, and reportlab are installed.", file=sys.stderr)
    sys.exit(1)

def merge_pdfs(inputs, output):
    writer = PdfWriter()
    try:
        for path in inputs:
            reader = PdfReader(path)
            for page in reader.pages:
                writer.add_page(page)
        with open(output, "wb") as f:
            writer.write(f)
        print(output)
    except Exception as e:
        print(f"Merge error: {e}", file=sys.stderr)
        sys.exit(1)

def split_pdf(input_path, output_zip, pages_str):
    try:
        reader = PdfReader(input_path)
        total_pages = len(reader.pages)
        
        # parse pages_str e.g., "1-3,5,7-9"
        page_indices = set()
        parts = pages_str.split(',')
        for part in parts:
            if '-' in part:
                start, end = map(int, part.split('-'))
                page_indices.update(range(start - 1, end))
            else:
                page_indices.add(int(part) - 1)
        
        valid_indices = sorted([i for i in page_indices if 0 <= i < total_pages])
        
        with tempfile.TemporaryDirectory() as tmpdirname:
            zip_path = output_zip
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for idx in valid_indices:
                    writer = PdfWriter()
                    writer.add_page(reader.pages[idx])
                    tmp_pdf = os.path.join(tmpdirname, f"page_{idx + 1}.pdf")
                    with open(tmp_pdf, "wb") as f:
                        writer.write(f)
                    zipf.write(tmp_pdf, arcname=f"page_{idx + 1}.pdf")
            print(output_zip)
    except Exception as e:
        print(f"Split error: {e}", file=sys.stderr)
        sys.exit(1)

def compress_pdf(input_path, output_path):
    try:
        # Using Ghostscript. Command may be 'gs' or 'gswin64c' on Windows
        gs_cmd = 'gs' if os.name != 'nt' else 'gswin64c'
        subprocess.run([
            gs_cmd, '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
            '-dPDFSETTINGS=/screen', '-dNOPAUSE', '-dQUIET', '-dBATCH',
            f'-sOutputFile={output_path}', input_path
        ], check=True)
        print(output_path)
    except FileNotFoundError:
        print("Ghostscript not found. Ensure it is installed and in PATH.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Compress error: {e}", file=sys.stderr)
        sys.exit(1)

def pdf_to_images(input_path, output_base, fmt):
    try:
        images = convert_from_path(input_path)
        if len(images) == 1:
            out_file = f"{output_base}.{fmt}"
            images[0].save(out_file, fmt.upper())
            print(out_file)
        else:
            zip_path = f"{output_base}.zip"
            with tempfile.TemporaryDirectory() as tmpdirname:
                with zipfile.ZipFile(zip_path, 'w') as zipf:
                    for i, image in enumerate(images):
                        img_path = os.path.join(tmpdirname, f"page_{i + 1}.{fmt}")
                        image.save(img_path, fmt.upper())
                        zipf.write(img_path, arcname=f"page_{i + 1}.{fmt}")
            print(zip_path)
    except Exception as e:
        print(f"Convert to images error: {e}", file=sys.stderr)
        sys.exit(1)

def protect_pdf(input_path, output_path, password):
    try:
        pdf = pikepdf.Pdf.open(input_path)
        pdf.save(output_path, encryption=pikepdf.Encryption(user=password, owner=password, allow=pikepdf.Permissions(extract=False)))
        print(output_path)
    except Exception as e:
        print(f"Protect error: {e}", file=sys.stderr)
        sys.exit(1)

def unlock_pdf(input_path, output_path, password):
    try:
        pdf = pikepdf.Pdf.open(input_path, password=password)
        pdf.save(output_path)
        print(output_path)
    except pikepdf.PasswordError:
        print("Incorrect password", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unlock error: {e}", file=sys.stderr)
        sys.exit(1)

def watermark_pdf(input_path, output_path, text):
    try:
        reader = PdfReader(input_path)
        writer = PdfWriter()
        
        # create a temp watermark pdf
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmpf:
            c = canvas.Canvas(tmpf.name, pagesize=letter)
            c.setFont("Helvetica-Bold", 60)
            c.setFillColorRGB(0.5, 0.5, 0.5, alpha=0.3)
            c.saveState()
            c.translate(300, 400)
            c.rotate(45)
            c.drawCentredString(0, 0, text)
            c.restoreState()
            c.save()
            wm_path = tmpf.name
            
        wm_reader = PdfReader(wm_path)
        wm_page = wm_reader.pages[0]
        
        for page in reader.pages:
            page.merge_page(wm_page)
            writer.add_page(page)
            
        with open(output_path, "wb") as f:
            writer.write(f)
            
        os.unlink(wm_path)
        print(output_path)
    except Exception as e:
        print(f"Watermark error: {e}", file=sys.stderr)
        sys.exit(1)
        
def pdf_to_docx(input_path, output_path):
    try:
        cv = Converter(input_path)
        cv.convert(output_path)
        cv.close()
        print(output_path)
    except Exception as e:
        print(f"PDF to Word error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--action', required=True)
    parser.add_argument('--input')
    parser.add_argument('--inputs', nargs='+')
    parser.add_argument('--output')
    parser.add_argument('--pages')
    parser.add_argument('--password')
    parser.add_argument('--text')
    
    args = parser.parse_args()
    
    if args.action == 'merge':
        merge_pdfs(args.inputs, args.output)
    elif args.action == 'split':
        split_pdf(args.input, args.output, args.pages)
    elif args.action == 'compress':
        compress_pdf(args.input, args.output)
    elif args.action == 'to-jpg':
        pdf_to_images(args.input, args.output, 'jpg')
    elif args.action == 'to-png':
        pdf_to_images(args.input, args.output, 'png')
    elif args.action == 'protect':
        protect_pdf(args.input, args.output, args.password)
    elif args.action == 'unlock':
        unlock_pdf(args.input, args.output, args.password)
    elif args.action == 'watermark':
        watermark_pdf(args.input, args.output, args.text)
    elif args.action == 'to-docx':
        pdf_to_docx(args.input, args.output)
