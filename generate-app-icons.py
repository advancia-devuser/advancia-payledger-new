#!/usr/bin/env python3
"""
Advancia PayLedger App Icon Generator
Creates all required iOS and Android app icons from a single source image
"""

import os
from PIL import Image, ImageDraw, ImageFont
import math

def create_advancia_icon(size):
    """Create Advancia PayLedger icon with healthcare fintech theme"""
    # Create square canvas
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors - Healthcare fintech theme
    primary_blue = (59, 130, 246)  # Blue
    accent_green = (34, 197, 94)   # Green for health
    dark_bg = (15, 23, 42)        # Dark background
    
    # Background gradient effect
    for i in range(size):
        if i < size:  # Ensure valid coordinates
            alpha = int(255 * (1 - i / size))
            color = (*primary_blue, alpha)
            draw.rectangle([i, i, size-i-1, size-i-1], fill=color)
    
    # Main background
    margin = size // 10
    if margin < size - margin:  # Ensure valid coordinates
        draw.rectangle([margin, margin, size-margin-1, size-margin-1], fill=dark_bg)
    
    # Healthcare cross + Dollar sign combination
    center = size // 2
    cross_size = size // 3
    line_width = max(2, size // 20)
    
    # Medical cross
    cross_color = (255, 255, 255)
    # Horizontal line
    draw.rectangle([center - cross_size//2, center - line_width//2, 
                   center + cross_size//2, center + line_width//2], fill=cross_color)
    # Vertical line
    draw.rectangle([center - line_width//2, center - cross_size//2, 
                   center + line_width//2, center + cross_size//2], fill=cross_color)
    
    # Dollar sign overlay
    if size >= 32:  # Only add dollar sign for larger icons
        try:
            font_size = max(12, size // 4)
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        text = "$"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Position dollar sign in center
        x = center - text_width // 2
        y = center - text_height // 2
        draw.text((x, y), text, fill=accent_green, font=font)
    
    return img

def generate_ios_icons():
    """Generate all iOS icon sizes"""
    ios_sizes = [
        (60, "AppIcon-20@2x.png"),
        (60, "AppIcon-20@2x.png"),  # iPhone 20pt @2x
        (120, "AppIcon-20@3x.png"),  # iPhone 20pt @3x
        (58, "AppIcon-29@2x.png"),   # iPhone 29pt @2x
        (87, "AppIcon-29@3x.png"),   # iPhone 29pt @3x
        (80, "AppIcon-40@2x.png"),   # iPhone 40pt @2x
        (120, "AppIcon-40@3x.png"),  # iPhone 40pt @3x
        (120, "AppIcon-60@2x.png"),  # iPhone 60pt @2x
        (180, "AppIcon-60@3x.png"),  # iPhone 60pt @3x
        (152, "AppIcon-76@2x.png"),  # iPad 76pt @2x
        (167, "AppIcon-83.5@2x.png"), # iPad 83.5pt @2x
        (1024, "AppIcon-1024.png"),   # App Store
    ]
    
    ios_dir = "app-icons/ios"
    os.makedirs(ios_dir, exist_ok=True)
    
    print("📱 Generating iOS icons...")
    for size, filename in ios_sizes:
        icon = create_advancia_icon(size)
        icon.save(os.path.join(ios_dir, filename))
        print(f"  ✅ {filename} ({size}x{size})")

def generate_android_icons():
    """Generate all Android icon sizes"""
    android_sizes = [
        (36, "drawable-ldpi/ic_launcher.png"),
        (48, "drawable-mdpi/ic_launcher.png"),
        (72, "drawable-hdpi/ic_launcher.png"),
        (96, "drawable-xhdpi/ic_launcher.png"),
        (144, "drawable-xxhdpi/ic_launcher.png"),
        (192, "drawable-xxxhdpi/ic_launcher.png"),
        (512, "play-store-icon.png"),  # Play Store
    ]
    
    android_dir = "app-icons/android"
    os.makedirs(android_dir, exist_ok=True)
    
    print("🤖 Generating Android icons...")
    for size, filename in android_sizes:
        icon = create_advancia_icon(size)
        icon.save(os.path.join(android_dir, filename))
        print(f"  ✅ {filename} ({size}x{size})")

def main():
    """Main function to generate all app icons"""
    print("🎨 Advancia PayLedger App Icon Generator")
    print("========================================")
    
    try:
        generate_ios_icons()
        generate_android_icons()
        
        print("\n✅ All icons generated successfully!")
        print("\n📁 Output directories:")
        print("  📱 iOS icons: app-icons/ios/")
        print("  🤖 Android icons: app-icons/android/")
        
        print("\n🎯 Next steps:")
        print("  📱 iOS: Copy app-icons/ios/* to Xcode Assets.xcassets/AppIcon")
        print("  🤖 Android: Copy app-icons/android/* to android/app/src/main/res/")
        
    except Exception as e:
        print(f"❌ Error generating icons: {e}")
        print("💡 Make sure you have Pillow installed: pip install Pillow")

if __name__ == "__main__":
    main()
