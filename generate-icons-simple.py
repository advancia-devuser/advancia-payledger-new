#!/usr/bin/env python3
"""
Advancia PayLedger App Icon Generator - Simplified Version
Creates all required iOS and Android app icons
"""

import os
from PIL import Image, ImageDraw

def create_advancia_icon(size):
    """Create Advancia PayLedger icon"""
    # Create square canvas
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors - Healthcare fintech theme
    primary_blue = (59, 130, 246)  # Blue
    accent_green = (34, 197, 94)   # Green for health
    dark_bg = (15, 23, 42)        # Dark background
    
    # Background
    draw.rectangle([0, 0, size, size], fill=primary_blue)
    
    # Inner background
    margin = size // 8
    draw.rectangle([margin, margin, size-margin, size-margin], fill=dark_bg)
    
    # Healthcare cross
    center = size // 2
    cross_size = size // 4
    line_width = max(3, size // 16)
    
    # Horizontal line
    draw.rectangle([center - cross_size, center - line_width//2, 
                   center + cross_size, center + line_width//2], fill=(255, 255, 255))
    
    # Vertical line
    draw.rectangle([center - line_width//2, center - cross_size, 
                   center + line_width//2, center + cross_size], fill=(255, 255, 255))
    
    # Dollar sign for larger icons
    if size >= 64:
        # Simple dollar representation
        dollar_size = size // 6
        draw.rectangle([center - dollar_size//2, center - dollar_size, 
                       center + dollar_size//2, center - dollar_size + line_width], fill=accent_green)
        draw.rectangle([center - dollar_size//2, center + dollar_size - line_width, 
                       center + dollar_size//2, center + dollar_size], fill=accent_green)
        draw.rectangle([center - dollar_size, center - line_width//2, 
                       center + dollar_size, center + line_width//2], fill=accent_green)
    
    return img

def generate_ios_icons():
    """Generate all iOS icon sizes"""
    ios_sizes = [
        (40, "AppIcon-20@2x.png"),
        (60, "AppIcon-20@3x.png"),
        (58, "AppIcon-29@2x.png"),
        (87, "AppIcon-29@3x.png"),
        (80, "AppIcon-40@2x.png"),
        (120, "AppIcon-40@3x.png"),
        (120, "AppIcon-60@2x.png"),
        (180, "AppIcon-60@3x.png"),
        (152, "AppIcon-76@2x.png"),
        (167, "AppIcon-83.5@2x.png"),
        (1024, "AppIcon-1024.png"),
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
        (512, "play-store-icon.png"),
    ]
    
    android_dir = "app-icons/android"
    os.makedirs(android_dir, exist_ok=True)
    
    # Create subdirectories
    for size, filename in android_sizes:
        if '/' in filename:
            subdir = os.path.join(android_dir, filename.split('/')[0])
            os.makedirs(subdir, exist_ok=True)
    
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
