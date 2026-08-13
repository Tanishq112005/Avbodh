import fitz  # PyMuPDF
import io

class PDFScraper:
    """
    A standalone tool for extracting text, metadata, and images from PDF files.
    """
    def __init__(self, file_path=None, file_bytes=None):
        self.file_path = file_path
        self.file_bytes = file_bytes
        self.doc = self._open_doc()

    def _open_doc(self):
        if self.file_path:
            return fitz.open(self.file_path)
        elif self.file_bytes:
            return fitz.open(stream=self.file_bytes, filetype="pdf")
        else:
            raise ValueError("Must provide either file_path or file_bytes")

    def extract_text(self):
        """
        Extracts all text page by page.
        Returns a list of dictionaries containing page numbers and text.
        """
        pages_data = []
        for page_num in range(len(self.doc)):
            page = self.doc.load_page(page_num)
            text = page.get_text()
            pages_data.append({
                "page_number": page_num + 1,
                "content": text.strip()
            })
        return pages_data

    def extract_images(self):
        """
        Extracts all images from the PDF.
        Returns a list of dictionaries containing the image bytes and extension.
        """
        extracted_images = []
        for page_num in range(len(self.doc)):
            page = self.doc.load_page(page_num)
            image_list = page.get_images(full=True)
            
            for img_index, img in enumerate(image_list):
                xref = img[0]
                base_image = self.doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                extracted_images.append({
                    "page_number": page_num + 1,
                    "image_index": img_index,
                    "extension": image_ext,
                    "bytes": image_bytes
                })
        return extracted_images

    def get_metadata(self):
        return self.doc.metadata

    def close(self):
        self.doc.close()
