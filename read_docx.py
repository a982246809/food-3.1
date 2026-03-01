import sys
import zipfile
import xml.etree.ElementTree as ET

def extract(path):
    try:
        zf = zipfile.ZipFile(path)
        xml_content = zf.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        
        ns = {'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text = ""
        for p in tree.iterfind('.//w:p', namespaces=ns):
            line = ""
            for t in p.iterfind('.//w:t', namespaces=ns):
                line += t.text if t.text else ""
            text += line + "\n"
        return text
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        path = sys.argv[1]
        text = extract(path)
        with open(sys.argv[1] + ".txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("Success")
    else:
        print("Provide path")
