"""Build a deterministic extension ZIP; no credentials or dependencies are packaged."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
source = root / 'extensions' / 'feishu-publisher'
target = root / 'source' / 'downloads' / 'feishu-publisher.zip'
files = ['manifest.json', 'core.mjs', 'background.mjs', 'popup.html', 'popup.mjs',
         'options.html', 'options.mjs', 'style.css', 'README.md']
target.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    for name in sorted(files):
        info = ZipInfo('feishu-publisher/' + name, date_time=(2026, 10, 7, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        archive.writestr(info, (source / name).read_bytes())
print('Created source/downloads/feishu-publisher.zip')
