import sys
import subprocess
import os

def convert(input_file, output_folder):
    if not os.path.exists(input_file):
        print(f"Error: Input file does not exist: {input_file}", file=sys.stderr)
        sys.exit(1)

    try:
        # Determine the correct LibreOffice command based on OS
        libreoffice_cmd = 'soffice' if os.name == 'nt' else 'libreoffice'
        
        # call libreoffice headless
        result = subprocess.run([
            libreoffice_cmd, '--headless', '--convert-to', 'pdf',
            '--outdir', output_folder, input_file
        ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Determine the expected output path
        base_name = os.path.splitext(os.path.basename(input_file))[0]
        output_file = os.path.join(output_folder, f"{base_name}.pdf")
        
        if os.path.exists(output_file):
            print(output_file)
            sys.exit(0)
        else:
            print(f"Error: Output file not found at {output_file}", file=sys.stderr)
            sys.exit(1)

    except subprocess.CalledProcessError as e:
        print(f"LibreOffice error: {e.stderr.decode()}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError:
        print("Error: libreoffice command not found. Ensure LibreOffice is installed and in PATH.", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python office_to_pdf.py <input_file> <output_folder>", file=sys.stderr)
        sys.exit(1)
    
    convert(sys.argv[1], sys.argv[2])
