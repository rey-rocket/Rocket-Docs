# Rocket Learning Rewards Brand Guide

## Brand Identity
**Mission**: Fuel Engagement. Reward Progress. Drive Success.

**Brand Personality**: Motivational, empowering, professional yet approachable, focused on achievement and tangible progress.

## Color Palette

### Primary Colors
- **Rocket Orange**: `#F36739` (Primary brand color)
- **Deep Blue**: `#1863DC` (Secondary brand color)

### Supporting Colors
- **White**: `#FFFFFF` (Background, text on dark)
- **Dark Gray**: `#2E2E2E` (Text, headers)
- **Light Gray**: `#F5F5F5` (Backgrounds, dividers)

### CedarOS-Inspired Accents
- **Success Green**: `#10B981` (Positive actions, success states)
- **Warning Amber**: `#F59E0B` (Attention, warnings)
- **Info Blue**: `#3B82F6` (Information, links)

## Typography

### Font Stack
- **Primary**: Inter (Google Fonts)
- **Code**: JetBrains Mono
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Hierarchy
- **Hero Heading**: 42px, Bold (Inter 700)
- **Section Heading**: 32px, Semi-Bold (Inter 600)
- **Subsection**: 24px, Medium (Inter 500)
- **Body Text**: 16px, Regular (Inter 400)
- **Small Text**: 14px, Regular (Inter 400)

## Design Principles

### CedarOS-Inspired Layout
- **Clean, minimal sidebar navigation**
- **Generous whitespace**
- **Card-based content sections**
- **Subtle shadows and rounded corners**
- **Consistent icon usage**

### Visual Elements
- **Border Radius**: 8px (cards), 4px (buttons)
- **Shadows**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Spacing**: 8px, 16px, 24px, 32px grid system
- **Icons**: Material Design icons with 24px standard size

## Logo Usage
- **Rocket icon** representing growth and momentum
- **Clean, modern typography**
- **Minimum size**: 32px height
- **Clear space**: Minimum 1x logo height on all sides

## Documentation-Specific Elements

### Content Cards (CedarOS Style)
```css
.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}
```

### Quick Navigation Sections
- **Icon + Title** format
- **Descriptive subtitle** beneath
- **Hover states** with subtle color changes
- **Grid layout** for feature showcases

### Status Indicators
- **Green**: Success, completed, active
- **Orange**: In progress, warning
- **Blue**: Information, links
- **Gray**: Inactive, disabled

## Brand Voice Guidelines

### Tone
- **Empowering**: Focus on what users can achieve
- **Clear**: Use simple, direct language
- **Supportive**: Guide users through processes
- **Energetic**: Maintain enthusiasm for learning and rewards

### Writing Style
- **Action-oriented** headings ("Get Started", "Configure Rewards")
- **Benefit-focused** descriptions
- **Step-by-step** instructions
- **Inclusive** language

## Implementation Notes

### Cedar-Inspired Features to Adopt
1. **Left sidebar navigation** with expandable sections
2. **Card-based content layout** for main content
3. **Right-side table of contents** for page navigation
4. **Clean typography hierarchy** with consistent spacing
5. **Subtle animations** and hover states
6. **Icon-first** navigation items
7. **Search integration** in header
8. **Dark/light mode toggle**

### Rocket-Specific Adaptations
- Use Rocket orange as primary accent color
- Incorporate rocket/achievement iconography
- Maintain gamification visual elements
- Add progress indicators and achievement badges
- Include reward-themed visual metaphors

## File Structure
- Primary CSS: `stylesheets/rocket-theme.css`
- Cedar-inspired layout: `stylesheets/rocket-cedar.css`
- Custom components: `assets/css/custom.css`
- JavaScript enhancements: `assets/js/custom.js`