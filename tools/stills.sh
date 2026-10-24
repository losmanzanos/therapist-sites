#!/bin/sh
# Recapture the TV stills (the images phones see instead of a live frame).
#
#   tools/stills.sh            all ten
#   tools/stills.sh rooted     just one (slug from the list below)
#
# Needs: Google Chrome, and Pillow for the WebP step (pip3 install pillow).
# Output: images/tv/<slug>.webp, 1280 wide. Then commit and push.

cd "$(dirname "$0")/.." || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME"; exit 1; }
python3 -c "import PIL" 2>/dev/null || { echo "Pillow is missing. Run:  pip3 install pillow   then try again."; exit 1; }

SITES="
fullbloom   https://fullbloomcounseling.com/
apex        https://apex-mhc.com/
lovett      https://lovettcounselingandconsulting.com/
goldenhour  https://goldenhourwellnesscolorado.com/
coolbird    https://coolbirdcounseling.com/
rooted      https://rootedresonancetherapy.com/
safersounds https://safersoundsclub.com/
sanare      https://www.sanare-colorado.com/
brunson     https://workwithbrunson.com/
logdog      https://logdogtimberworks.com/
"

mkdir -p images/tv
echo "$SITES" | while read -r slug url; do
  [ -z "$slug" ] && continue
  [ -n "$1" ] && [ "$1" != "$slug" ] && continue
  tmp="/tmp/tv-$slug.png"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1280,1013 --virtual-time-budget=6000 \
    --screenshot="$tmp" "$url" >/dev/null 2>&1
  [ -s "$tmp" ] || { echo "  $slug: Chrome produced no screenshot"; continue; }
  if python3 - "$tmp" "images/tv/$slug.webp" <<'PY'
import sys
from PIL import Image
Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], quality=78, method=6)
PY
  then echo "  $slug -> images/tv/$slug.webp"; else echo "  $slug: WebP conversion failed"; fi
done
echo "Done. Review the images, then: git add images/tv && git commit -m 'Recapture TV stills' && git push"
