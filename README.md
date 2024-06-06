# PDF Merge and Split Tool
Welcome to the PDF Merge and Split Tool! This application allows you to easily merge multiple PDF files into one or split a PDF file into separate pages.

# Features
* Merge PDFs: Combine multiple PDF files into a single PDF document.
* Split PDFs: Extract specific pages from a PDF file and save them as a new PDF.

# Requirements
* Python 3.6+
* Flask
* PyPDF2

# Installation
1. Clone the repository:
   ```git clone https://github.com/yourusername/pdf-merge-split-tool.git cd pdf-merge-split-tool```
   
3. Install requirements
   ```
   pip install Flask
   pip install PyPDF2
   ```

# How to Use
### Merge PDFs
1. Select the PDF files you want to merge by dragging and dropping them into the designated area or by clicking to select files.
2. Arrange the files in the desired order by dragging and dropping.
3. Click the "Merge PDFs" button to merge the selected files into a single PDF.

### Split PDFs
1. Select the PDF file you want to split by clicking to select a file.
2. Enter the page numbers you want to extract, separated by commas (e.g., 1,3,5).
3. Click the "Split PDF" button to split the PDF and download the extracted pages.

# Acknowledgements
[Flask Documentation](https://flask.palletsprojects.com/en/3.0.x/)

[PyPDF2 Documentation](https://pypdf2.readthedocs.io/en/3.x/)
