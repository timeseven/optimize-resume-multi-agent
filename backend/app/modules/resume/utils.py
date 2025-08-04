import io

import docx2txt
from fastapi import UploadFile
from pypdf import PdfReader

from app.modules.resume.exceptions import ResumeBadRequest


def extract_raw_text(file: UploadFile) -> str:
    suffix = file.filename.lower().split(".")[-1]

    if suffix == "pdf":
        return extract_pdf_text(file)
    elif suffix == "docx":
        return extract_docx_text(file)
    else:
        raise ResumeBadRequest(detail="Unsupported file type: only .pdf and .docx are supported")


def extract_pdf_text(file: UploadFile) -> str:
    file_bytes = file.file.read()
    with io.BytesIO(file_bytes) as f:
        reader = PdfReader(f)
        return "\n".join(page.extract_text() or "" for page in reader.pages)


def extract_docx_text(file: UploadFile) -> str:
    file_bytes = file.file.read()
    with io.BytesIO(file_bytes) as f:
        text = docx2txt.process(f)
    return text or ""
