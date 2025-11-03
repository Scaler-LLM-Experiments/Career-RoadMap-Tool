# Design System - Spacing & Alignment Standards

## Critical Alignment Rules

### 1. Top Padding Consistency
- **Sidebar top padding**: `48px`
- **ContentArea top padding**: `48px`
- **MUST MATCH** - These values should always be identical

### 2. Section Spacing
- **Between major sections**: `80px` (margin-bottom on Section component)
- **Mobile sections**: `48px`
- **ChatBubble bottom margin**: `80px` (to match section spacing)

### 3. Left Alignment
- **ChatBubble**: `padding-left: 0` - Must align with content, NOT indented
- **All content in ContentArea**: Left-aligned, no additional left padding beyond ContentArea's base padding

### 4. Layout Container
```css
max-width: 1200px;
margin: 0 auto;
padding: 0 20px;
```
- **Max Width**: `1200px` (matches navbar)
- **Auto Margins**: Centers content
- **Horizontal Padding**: `20px` (page margins)

### 5. ContentArea Padding
```css
padding: 48px 0 100px 48px;
```
- Top: `48px` (matches Sidebar)
- Right: `0` (controlled by container padding)
- Bottom: `100px` (breathing room for footer)
- Left: `48px` (spacing from sidebar border)

### 6. Sidebar Padding
```css
padding: 48px 32px 32px 0;
width: 280px;
```
- Top: `48px` (matches ContentArea)
- Right: `32px` (internal spacing)
- Bottom: `32px` (less than top for sticky behavior)
- Left: `0` (controlled by container padding)
- Width: `280px` (fixed width)

## Component Spacing Standards

### Sections
```javascript
const Section = styled.section`
  margin-bottom: 80px;  // Consistent section spacing

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;
```

### ChatBubble
```javascript
const ChatContainer = styled.div`
  margin: 0 0 80px 0;  // Bottom margin matches section spacing
  padding-left: 0;      // Left-aligned with content

  @media (max-width: 768px) {
    margin: 0 0 48px 0;
  }
`;
```

### Steps (Numbered Pattern - TEMPLATE)
```javascript
const StepContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    gap: 16px;
    margin-bottom: 24px;  // Gap before card
  }
`;

const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 0;  // Sharp corners
  background: #0f172a;
  color: #FFFFFF;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;  // Don't shrink
`;

const StepContent = styled.div`
  flex: 1;  // Take remaining space
`;
```

**Mobile Layout Rules:**
- Number and title remain **horizontally aligned** on mobile
- **Card/container comes BELOW** the number+title row (not wrapped inside)
- **24px gap** between number+title and card
- Cards are full-width with **20px left/right padding/margin** on mobile
- Content inside containers uses consistent 20px horizontal spacing

**Structure Pattern:**
```jsx
{/* Step header - horizontal */}
<StepContainer>
  <StepNumber>1</StepNumber>
  <StepContent>
    <StepTitle>Your Title</StepTitle>
  </StepContent>
</StepContainer>

{/* Card - full width below */}
<SkillMapContainer>
  <SkillsContentWrapper>
    {/* Content with 20px margin */}
  </SkillsContentWrapper>
</SkillMapContainer>
```

## Why These Values Matter

1. **48px top padding** creates vertical rhythm and breathing room
2. **80px section spacing** maintains consistent visual hierarchy with generous breathing room
3. **Left-alignment** (padding-left: 0) ensures content flows naturally
4. **Matching sidebar/content padding** creates a harmonious layout

## Quick Reference

| Element | Property | Value | Purpose |
|---------|----------|-------|---------|
| Sidebar | padding-top | 48px | Vertical alignment |
| ContentArea | padding-top | 48px | Vertical alignment |
| Section | margin-bottom | 80px | Section spacing |
| ChatBubble | margin-bottom | 80px | Section spacing |
| ChatBubble | padding-left | 0 | Left alignment |
| StepContainer | margin-bottom | 48px | Step spacing |
| StepContainer | display | flex | Horizontal layout |
| StepContainer | gap | 24px (16px mobile) | Space between number and content |
| StepNumber | width/height | 36px | Square number badge |
| SkillMapContainer (mobile) | padding | 24px 0 | Card vertical padding |
| SkillMapContainer (mobile) | margin | 0 | No extra margin on mobile |
| ContentWrapper (mobile) | padding | 0 20px | Content horizontal spacing |
| SkillsContentWrapper (mobile) | padding | 0 20px | Content horizontal spacing |
| StepContainer (mobile) | margin-bottom | 24px | Gap before card |
| StatsGrid (mobile) | padding | 16px | All around padding |
| Section (mobile) | margin-bottom | 48px | Between major sections |

## Mobile Breakpoints

### Tablet (max-width: 1024px)
```css
ContentArea: padding: 32px 40px 100px;
```

### Mobile (max-width: 768px)
```css
ContentArea: padding: 24px 20px 100px;
Section: margin-bottom: 48px;
ChatBubble: margin-bottom: 48px;
StepContainer: flex-direction: column; /* Stacks number above content */
```

## Design Principles

1. **Consistency First**: All top paddings match (48px)
2. **Rhythm**: Spacing creates visual flow (80px between sections on desktop, 48px on mobile)
3. **Alignment**: Everything left-aligns naturally
4. **Breathing Room**: Generous white space between sections

## CSS Specificity Notes

**IMPORTANT:** Mobile spacing uses `!important` flags to override any CSS specificity issues. This ensures consistent spacing across all card containers.

```javascript
// Always use !important for mobile spacing to avoid conflicts
@media (max-width: 768px) {
  padding: 0 20px !important;
  margin: 0 !important;
}
```

**Why:** Styled-components can generate different class names that may conflict. The `!important` flag ensures our spacing values always take precedence.

---

## Typography & Brand Standards

### Font Family
```css
font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```
- **Primary Font**: Plus Jakarta Sans (Google Fonts)
- **Weight Range**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
- **Usage**: All text throughout the application

### Button & CTA Standards

#### Primary CTA Button
```css
background-color: #B30158;
color: #FFFFFF;
font-family: 'Plus Jakarta Sans', sans-serif;
font-weight: 700; /* Bold */
letter-spacing: 0.05em;
padding: 0.875rem 1.5rem;
border-radius: 0px; /* Sharp corners */
border: none;
text-transform: uppercase; /* Optional, for emphasis */
cursor: pointer;
transition: all 0.2s ease;
box-shadow: 0 2px 4px rgba(179, 1, 88, 0.2);
```

**Hover State:**
```css
background-color: #8B0044; /* Darker shade of #B30158 */
box-shadow: 0 4px 8px rgba(179, 1, 88, 0.3);
transform: translateY(-1px);
```

#### Secondary Buttons
```css
background-color: transparent;
color: #B30158;
border: 2px solid #B30158;
border-radius: 0px; /* Sharp corners */
font-weight: 600;
letter-spacing: 0.05em;
```

### Corner Radius Standards
- **Default**: `0px` (sharp corners throughout)
- **Cards**: `0px`
- **Buttons**: `0px`
- **Input Fields**: `0px`
- **Pills/Badges**: `9999px` (only exception for circular badges)

### Color Palette

#### Primary Colors
```css
--color-primary: #B30158; /* Main CTA Color - Magenta/Pink */
--color-primary-hover: #8B0044; /* Darker shade for hover */
--color-primary-light: #FCE4EC;
```

#### Accent Colors
```css
--color-accent-blue: #2196F3;
--color-accent-purple: #667eea;
--color-accent-green: #10b981;
--color-accent-yellow: #F59E0B;
--color-accent-red: #EF4444;
```

#### Neutral Colors
```css
--color-text: #1F2937; /* Dark gray */
--color-text-secondary: #6B7280; /* Medium gray */
--color-text-light: #9CA3AF; /* Light gray */
--color-background: #F9FAFB; /* Very light gray */
--color-white: #FFFFFF;
--color-border: #E5E7EB; /* Light gray border */
```

---

**Last Updated**: October 25, 2025
**Enforced By**: Designer requirements - strict alignment and brand standards
