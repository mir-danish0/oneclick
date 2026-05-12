import sys
import argparse
import os
import subprocess
from PIL import Image

def convert_to_pdf(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: Input file does not exist: {input_path}", file=sys.stderr)
        sys.exit(1)
        
    try:
        image = Image.open(input_path)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        image.save(output_path, "PDF", resolution=100.0)
        print(output_path)
        sys.exit(0)
    except Exception as e:
        print(f"Image processing error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--action', required=True, choices=['to-pdf'])
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    
    args = parser.parse_args()
    
    if args.action == 'to-pdf':
        convert_to_pdf(args.input, args.output)
