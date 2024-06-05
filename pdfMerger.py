from PyPDF2 import PdfReader, PdfWriter, PdfMerger
from flask import Flask, render_template, request, send_file, jsonify
import os
import json

app = Flask(__name__, static_url_path='/static', static_folder='static')
UPLOAD_FOLDER = 'uploads'
MERGED_FOLDER = 'merged'
SPLIT_FOLDER = 'split'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MERGED_FOLDER, exist_ok=True)
os.makedirs(SPLIT_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/merge', methods=['POST'])
def merge():
    if 'files' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400
    
    files = request.files.getlist('files')
    if not files or files == [None]:
        return jsonify({"error": "No files uploaded"}), 400
    
    file_order = json.loads(request.form.get('fileOrder'))
    merger = PdfMerger()

    file_dict = {file.filename: file for file in files}
    for filename in file_order:
        if filename in file_dict:
            file = file_dict[filename]
            if file.filename.endswith('.pdf'):
                file_path = os.path.join(UPLOAD_FOLDER, file.filename)
                if os.path.exists(file_path):
                    return jsonify({"error": f"File {file.filename} already exists. Please rename the file."}), 400
                file.save(file_path)
                merger.append(file_path)
            else:
                return jsonify({"error": "Only PDF files are allowed"}), 400

    merged_pdf_path = os.path.join(MERGED_FOLDER, 'combined.pdf')
    merger.write(merged_pdf_path)
    merger.close()
    return send_file(merged_pdf_path, as_attachment=True)

@app.route('/split', methods=['POST'])
def split():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({"error": "No file uploaded"}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    pages = request.form.get('pages')
    if not pages:
        return jsonify({"error": "No pages provided"}), 400

    try:
        pages = [int(p) - 1 for p in pages.split(',')]
    except ValueError:
        return jsonify({"error": "Invalid page numbers provided"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    if os.path.exists(file_path):
        return jsonify({"error": f"File {file.filename} already exists. Please rename the file."}), 400
    file.save(file_path)

    with open(file_path, "rb") as f:
        reader = PdfReader(f)
        writer = PdfWriter()
        rest_writer = PdfWriter()

        for page in range(len(reader.pages)):
            if page in pages:
                writer.add_page(reader.pages[page])
            else:
                rest_writer.add_page(reader.pages[page])
        
        selected_pdf_path = os.path.join(SPLIT_FOLDER, 'selected.pdf')
        rest_pdf_path = os.path.join(SPLIT_FOLDER, 'rest.pdf')

        with open(selected_pdf_path, "wb") as f2:
            writer.write(f2)
        
        with open(rest_pdf_path, "wb") as f2:
            rest_writer.write(f2)
    
    return send_file(selected_pdf_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
