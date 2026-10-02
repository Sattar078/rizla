import os
from PIL import Image, ImageDraw, ImageFont

# Brand colors
BG_COLOR = (23, 51, 43)        # #17332b - Deep luxury pine green
CREAM_COLOR = (251, 250, 247)   # #fbfaf7 - Warm cream
GOLD_COLOR = (212, 175, 55)     # Warm gold accent
WHITE = (255, 255, 255)

def draw_coat_hanger(draw, center_x, center_y, scale, color, stroke_width):
    # Coat hanger emblem:
    # Hook on top (circle + neck), then triangular shoulders and crossbar
    hook_radius = 16 * scale
    hook_center_y = center_y - 38 * scale
    
    # Hook arc / circle
    draw.arc(
        [center_x - hook_radius, hook_center_y - hook_radius, center_x + hook_radius, hook_center_y + hook_radius],
        start=45, end=300, fill=color, width=stroke_width
    )
    # Hook neck down to collar
    neck_top = hook_center_y + hook_radius - 2 * scale
    collar_y = center_y - 10 * scale
    draw.line([(center_x, neck_top), (center_x, collar_y)], fill=color, width=stroke_width)
    
    # Hanger shoulder wings: collar to left and right tips
    left_x = center_x - 70 * scale
    right_x = center_x + 70 * scale
    shoulder_y = center_y + 25 * scale
    
    # Draw hanger triangle (collar -> left -> right -> collar)
    draw.line([(center_x, collar_y), (left_x, shoulder_y)], fill=color, width=stroke_width)
    draw.line([(center_x, collar_y), (right_x, shoulder_y)], fill=color, width=stroke_width)
    draw.line([(left_x, shoulder_y), (right_x, shoulder_y)], fill=color, width=stroke_width)

def create_pwa_icon(size, is_maskable=False, output_path=""):
    img = Image.new("RGBA", (size, size), BG_COLOR if is_maskable else (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    if not is_maskable:
        # Rounded squircle / soft rectangle for standard icons
        corner_radius = int(size * 0.22)
        draw.rounded_rectangle([0, 0, size, size], radius=corner_radius, fill=BG_COLOR)
    
    # Scale factor based on 512 base size
    # Safe zone for maskable is inner 80%, so scale down slightly for maskable
    scale = (size / 512.0) * (0.80 if is_maskable else 1.0)
    center_x = size // 2
    center_y = int(size * (0.42 if is_maskable else 0.40))
    stroke = max(2, int(12 * scale))
    
    # Draw Coat Hanger
    draw_coat_hanger(draw, center_x, center_y, scale, CREAM_COLOR, stroke)
    
    # Text RIZLA
    try:
        # Try finding standard fonts
        font_rizla = ImageFont.truetype("arial.ttf", int(58 * scale))
        font_boutique = ImageFont.truetype("arial.ttf", int(20 * scale))
    except Exception:
        font_rizla = ImageFont.load_default()
        font_boutique = ImageFont.load_default()
        
    text_y_rizla = center_y + int(55 * scale)
    bbox_r = draw.textbbox((0, 0), "RIZLA", font=font_rizla)
    w_r = bbox_r[2] - bbox_r[0]
    draw.text((center_x - w_r // 2, text_y_rizla), "RIZLA", font=font_rizla, fill=WHITE)
    
    text_y_boutique = text_y_rizla + int(60 * scale)
    bbox_b = draw.textbbox((0, 0), "B O U T I Q U E", font=font_boutique)
    w_b = bbox_b[2] - bbox_b[0]
    draw.text((center_x - w_b // 2, text_y_boutique), "B O U T I Q U E", font=font_boutique, fill=GOLD_COLOR)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Generated: {output_path} ({size}x{size})")

if __name__ == "__main__":
    out_dir = r"c:\Users\satta\OneDrive\Desktop\rizla\rizla-boutique\frontend\public"
    create_pwa_icon(192, is_maskable=False, output_path=os.path.join(out_dir, "pwa-192x192.png"))
    create_pwa_icon(512, is_maskable=False, output_path=os.path.join(out_dir, "pwa-512x512.png"))
    create_pwa_icon(512, is_maskable=True, output_path=os.path.join(out_dir, "maskable-icon-512x512.png"))
    create_pwa_icon(180, is_maskable=False, output_path=os.path.join(out_dir, "apple-touch-icon-180x180.png"))
