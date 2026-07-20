
from PIL import Image

# Open the cropped original JPEG
img = Image.open('public/assets/cgb-logo-new-cropped.jpeg').convert('L') # Convert to grayscale
data = img.getdata()

new_data = []
for v in data:
    # v is grayscale value 0 (black) to 255 (white)
    
    # Thresholds
    high_thresh = 210 # Anything lighter than this is background
    low_thresh = 100  # Anything darker than this is solid logo
    
    if v > high_thresh:
        alpha = 0
    elif v < low_thresh:
        alpha = 255
    else:
        # Smooth transition for anti-aliasing
        alpha = int(255 * (high_thresh - v) / (high_thresh - low_thresh))
        
    # We want a pure white logo.
    # The user wants it white, so RGB is always 255, and alpha handles the shape.
    new_data.append((255, 255, 255, alpha))

out_img = Image.new('RGBA', img.size)
out_img.putdata(new_data)
out_img.save('public/assets/cgb-logo-clean.png', 'PNG')

