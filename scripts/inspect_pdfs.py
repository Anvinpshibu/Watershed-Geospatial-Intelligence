import pypdf
import glob
import re

for pdf in sorted(glob.glob("data/organizer_mord/*.pdf")):
    reader = pypdf.PdfReader(pdf)
    print(f"=== {pdf} ({len(reader.pages)} pages) ===")
    full_text = ""
    for page in reader.pages:
        t = page.extract_text() or ""
        full_text += t
    print("Length:", len(full_text))
    urls = re.findall(r"https?://[^\s<>\"'\)]+", full_text)
    if urls:
        print("URLs found:", urls)
    else:
        print("First 200 chars:", full_text[:200].replace("\n", " "))
